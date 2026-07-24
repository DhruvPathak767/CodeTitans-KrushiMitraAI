import time
import logging
import numpy as np
from typing import Dict, Any

from app.config.settings import settings
from app.services.image_processor import download_and_read_image, analyze_leaf_features
from app.services.leaf_detector import leaf_detector_singleton
from app.services.crop_classifier import crop_classifier_singleton
from app.services.disease_classifier import crop_disease_engine
from app.services.ood_detector import ood_detector
from app.utils.treatment_mapping import get_treatment_details
from app.utils.disease_mapping import normalize_crop_name

logger = logging.getLogger("prediction_service")

class MultiStagePredictionService:
    """
    Production Multi-Stage AI Vision Pipeline & Debugging Engine:
    1. Download Image & Verify Plant Foliage Spectrum
    2. Primary Leaf ROI Localizing & Cropping (YOLOv8/11 + HSV fallback)
    3. Dedicated Crop Species Classification over Cropped Leaf ROI
    4. Independent Crop Identity Validation (Predicted Crop vs Selected Crop)
    5. Crop-Specific Disease Model Execution (ONLY invoked after crop validation succeeds)
    6. Dynamic Calibration, Margin Analysis & OOD Uncertainty Check
    7. Remedial Treatment Protocol Mapping & Debug Log Telemetry
    """
    async def predict_leaf_disease(self, image_url: str, selected_crop: str = "Cotton") -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"\n=================== AI INFERENCE PIPELINE START ===================")
        logger.info(f"[STAGE 1] Image Input URL: {image_url} | User-Selected Crop: '{selected_crop}'")

        # 1. Download & decode raw image bytes into RGB numpy array
        try:
            img_np = await download_and_read_image(image_url)
            h, w, c = img_np.shape
            logger.info(f"[STAGE 1 OK] Loaded Image dimensions: {w}x{h} (channels: {c})")
        except Exception as e:
            logger.error(f"[STAGE 1 FAIL] Image download/decode failure: {e}")
            raise ValueError(f"{str(e)}")

        # 2. Analyze foliage spectrum to verify plant leaf
        is_leaf, foliage_ratio, feature_vector = analyze_leaf_features(img_np)
        logger.info(f"[STAGE 1 PREPROCESS] Foliage Spectrum Ratio: {round(foliage_ratio*100, 2)}% | Features: {feature_vector}")

        if not is_leaf:
            msg = "Non-leaf image detected! The uploaded photo does not appear to be a crop leaf. Please upload a clear photo of a plant leaf."
            logger.warning(f"[STAGE 1 REJECT] {msg}")
            raise ValueError(msg)

        # 3. Stage 1 - Primary Leaf Detection & ROI Cropping
        try:
            cropped_roi, roi_stats, bbox = leaf_detector_singleton.detect_and_crop_leaf_roi(img_np, target_size=(224, 224))
            logger.info(f"[STAGE 2 ROI OK] Method: '{roi_stats.get('method')}' | BBox: {bbox} | Coverage: {round(roi_stats.get('roi_coverage', 1.0)*100, 2)}%")
        except Exception as e:
            logger.error(f"[STAGE 2 ROI WARN] Leaf ROI extraction fallback: {e}")
            cropped_roi = img_np
            roi_stats = {"is_cropped": False, "method": "fallback"}

        # Normalize cropped leaf ROI tensor (1, 224, 224, 3) exactly as training: float32 / 255.0
        normalized_roi = cropped_roi.astype(np.float32) / 255.0
        roi_tensor = np.expand_dims(normalized_roi, axis=0)

        # 4. Stage 2 - Crop Species Classifier over Cropped Leaf ROI
        predicted_crop, raw_crop_conf, crop_probs = crop_classifier_singleton.predict_crop(
            roi_tensor, feature_vector, confidence_threshold=settings.CROP_CONFIDENCE_THRESHOLD, selected_crop=selected_crop
        )

        logger.info(f"[STAGE 3 CROP PREDICTION] Predicted Species: '{predicted_crop}' | Raw Confidence: {raw_crop_conf}%")

        # Independent Crop OOD & Threshold Validation
        is_valid_crop, calibrated_crop_conf, crop_ood_msg, crop_debug_metrics = ood_detector.validate_confidence_and_ood(
            crop_probs, threshold=settings.CROP_CONFIDENCE_THRESHOLD * 100.0, is_crop_validation=True
        )

        logger.info(f"[STAGE 3 CROP OOD AUDIT] Valid: {is_valid_crop} | Calibrated Conf: {calibrated_crop_conf}% | Msg: '{crop_ood_msg}'")

        if predicted_crop == "Unknown Crop" or not is_valid_crop:
            error_msg = f"Unable to identify the crop species with sufficient confidence ({calibrated_crop_conf}%). Please upload a clearer leaf image."
            logger.warning(f"[STAGE 3 CROP REJECT] {error_msg}")
            raise ValueError(error_msg)

        # 5. Stage 3 - Crop Identity Validation (Predicted Crop vs Selected Crop)
        normalized_selected = normalize_crop_name(selected_crop)
        normalized_predicted = normalize_crop_name(predicted_crop)

        logger.info(f"[STAGE 4 CROP VALIDATION] Selected: '{selected_crop}' ({normalized_selected}) vs Predicted: '{predicted_crop}' ({normalized_predicted})")

        if normalized_selected != normalized_predicted:
            error_msg = f"Uploaded image is not a {selected_crop.capitalize()} leaf. It appears to be {predicted_crop.capitalize()}."
            logger.warning(f"[STAGE 4 MISMATCH REJECT] {error_msg}")
            raise ValueError(error_msg)

        # 6. Stage 4 - Crop-Specific Disease Classifier Execution
        # Disease model is executed ONLY AFTER crop validation passes!
        disease_name, raw_disease_conf, disease_probs = crop_disease_engine.predict_disease_for_crop(
            crop=normalized_predicted,
            input_tensor=roi_tensor,
            feature_vector=feature_vector
        )

        logger.info(f"[STAGE 5 DISEASE PREDICTION] Raw Disease Output: '{disease_name}' | Raw Confidence: {round(raw_disease_conf, 2)}%")

        # Independent Disease OOD & Margin Validation (Uses DISEASE_CONFIDENCE_THRESHOLD, e.g. 30.0%)
        is_valid_disease, calibrated_disease_conf, disease_ood_msg, disease_debug_metrics = ood_detector.validate_confidence_and_ood(
            disease_probs, threshold=settings.DISEASE_CONFIDENCE_THRESHOLD * 100.0, is_crop_validation=False
        )

        logger.info(f"[STAGE 6 DISEASE OOD AUDIT] Valid: {is_valid_disease} | Calibrated Conf: {calibrated_disease_conf}% | Msg: '{disease_ood_msg}'")

        if not is_valid_disease:
            error_msg = f"Unable to identify disease on this crop leaf with high confidence ({calibrated_disease_conf}%). Please upload a clearer leaf image."
            logger.warning(f"[STAGE 6 DISEASE REJECT] {error_msg}")
            raise ValueError(error_msg)

        # 7. Stage 5 - Remedial Treatment Protocol Mapping
        details = get_treatment_details(disease_name)
        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        logger.info(f"[STAGE 7 FINAL DECISION] Success! Final Disease: '{details['disease']}' | Latency: {elapsed_ms}ms")
        logger.info(f"=================== AI INFERENCE PIPELINE END ===================\n")

        response = {
            "success": True,
            "cropPrediction": {
                "crop": predicted_crop.capitalize(),
                "confidence": round(calibrated_crop_conf, 1)
            },
            "diseasePrediction": {
                "disease": details["disease"],
                "fullLabel": disease_name,
                "confidence": round(calibrated_disease_conf, 1),
                "severity": details["severity"]
            },
            "treatment": {
                "fungicide": details["fungicide"],
                "organic": details["organicAlternative"],
                "prevention": details["prevention"]
            },
            "predictionTime": f"{elapsed_ms}ms"
        }

        # Include debugInfo in response during development mode
        if settings.DEBUG or settings.ENABLE_DEBUG_LOGS:
            response["debugInfo"] = {
                "cropPrediction": predicted_crop.capitalize(),
                "cropConfidence": round(calibrated_crop_conf, 2),
                "diseasePrediction": disease_name,
                "diseaseConfidence": round(calibrated_disease_conf, 2),
                "cropDebugMetrics": crop_debug_metrics,
                "diseaseDebugMetrics": disease_debug_metrics,
                "pipelineLatencyMs": elapsed_ms
            }

        return response

prediction_service = MultiStagePredictionService()
