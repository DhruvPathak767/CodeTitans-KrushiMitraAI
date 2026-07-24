import asyncio
import numpy as np

from app.services.leaf_detector import leaf_detector_singleton
from app.services.crop_classifier import crop_classifier_singleton
from app.services.disease_classifier import crop_disease_engine
from app.services.ood_detector import ood_detector
from app.services.prediction_service import prediction_service
from app.config.settings import settings

def test_leaf_detection_roi_cropping():
    print("=== Testing Stage 1: Leaf Detection & Primary ROI Extraction ===")

    img_np = np.zeros((400, 400, 3), dtype=np.uint8)
    img_np[100:300, 100:300, 1] = 180  # Green leaf patch

    roi_img, stats, bbox = leaf_detector_singleton.detect_and_crop_leaf_roi(img_np, target_size=(224, 224))
    print(f"Leaf ROI Extracted -> Shape: {roi_img.shape} | Method: {stats.get('method')} | BBox: {bbox}")

    assert roi_img.shape == (224, 224, 3), "Cropped ROI image must be (224, 224, 3)"
    assert stats["is_cropped"] is True, "Expected leaf ROI to be cropped!"

    print("[OK] Stage 1 Primary Leaf Detection Test Passed!\n")

def test_crop_classification_and_threshold_rejection():
    print("=== Testing Stage 2 & 3: Crop Classifier & Threshold Rejection ===")

    cotton_tensor = np.zeros((1, 224, 224, 3), dtype=np.float32)
    cotton_tensor[0, :, :, 1] = 0.55
    cotton_tensor[0, :, :, 2] = 0.35
    cotton_features = {"foliage_ratio": 0.5, "dark_spot_ratio": 0.04, "yellow_halo_ratio": 0.035, "necrotic_density": 0.06}

    pred_crop, crop_conf, crop_probs = crop_classifier_singleton.predict_crop(
        cotton_tensor, cotton_features, confidence_threshold=settings.CROP_CONFIDENCE_THRESHOLD, selected_crop="Cotton"
    )
    print(f"High-Confidence Test -> Predicted: '{pred_crop}' ({crop_conf}%)")
    assert pred_crop == "Cotton", f"Expected Cotton, got {pred_crop}"
    assert crop_conf >= 50.0, f"Expected confidence >= 50.0%, got {crop_conf}%"

    # Low-Confidence Ambiguous Input Rejection
    noisy_tensor = np.ones((1, 224, 224, 3), dtype=np.float32) * 0.33
    noisy_features = {"foliage_ratio": 0.15, "dark_spot_ratio": 0.0, "yellow_halo_ratio": 0.0, "necrotic_density": 0.0}

    pred_crop_low, crop_conf_low, _ = crop_classifier_singleton.predict_crop(
        noisy_tensor, noisy_features, confidence_threshold=0.999
    )
    print(f"Low-Confidence Test -> Predicted: '{pred_crop_low}' ({crop_conf_low}%)")
    assert pred_crop_low == "Unknown Crop", f"Expected Unknown Crop rejection, got {pred_crop_low}"

    print("[OK] Stage 2 & 3 Crop Classification & Rejection Test Passed!\n")

def test_cross_crop_validation_mismatch_rejection():
    print("=== Testing Stage 4: Cross-Crop Mismatch Rejection (Rice, Cotton, Potato, Tomato) ===")

    cotton_tensor = np.zeros((1, 224, 224, 3), dtype=np.float32)
    cotton_tensor[0, :, :, 1] = 0.55
    cotton_tensor[0, :, :, 2] = 0.35
    cotton_features = {"foliage_ratio": 0.5, "dark_spot_ratio": 0.04, "yellow_halo_ratio": 0.035, "necrotic_density": 0.06}

    pred_crop, _, _ = crop_classifier_singleton.predict_crop(cotton_tensor, cotton_features, selected_crop="Cotton")

    mismatch_cases = ["Potato", "Rice", "Tomato", "Wheat"]
    for selected_crop in mismatch_cases:
        assert pred_crop.lower() != selected_crop.lower()
        expected_error = f"Uploaded image is not a {selected_crop.capitalize()} leaf. It appears to be {pred_crop.capitalize()}."
        print(f"Cross-Crop Mismatch Caught: Selected='{selected_crop}' vs Predicted='{pred_crop}' -> Error: '{expected_error}'")

    print("[OK] Stage 4 Cross-Crop Mismatch Rejection Test Passed!\n")

def test_crop_specific_disease_models_and_calibration():
    print("=== Testing Stage 5 & 6: Crop-Specific Disease Model Execution & Dynamic Calibration ===")

    tensor = np.zeros((1, 224, 224, 3), dtype=np.float32)
    tensor[0, :, :, 0] = 0.4
    tensor[0, :, :, 1] = 0.5

    # Potato Disease Model
    potato_disease, p_conf, p_probs = crop_disease_engine.predict_disease_for_crop("potato", tensor, {"dark_spot_ratio": 0.05})
    print(f"Potato Disease Model -> Predicted: '{potato_disease}' ({round(p_conf, 1)}%)")
    assert "Potato" in potato_disease

    is_valid, cal_conf, msg, metrics = ood_detector.validate_confidence_and_ood(p_probs, threshold=30.0, is_crop_validation=False)
    print(f"OOD Audit -> Valid: {is_valid} | Calibrated Conf: {cal_conf}% | Margin: {metrics['margin']} | OOD Score: {metrics['ood_score']}")
    assert is_valid is True, "Valid Potato prediction should NOT be rejected!"

    # Rice Disease Model
    rice_disease, r_conf, r_probs = crop_disease_engine.predict_disease_for_crop("rice", tensor, {"necrotic_density": 0.04})
    print(f"Rice Disease Model -> Predicted: '{rice_disease}' ({round(r_conf, 1)}%)")
    assert "Rice" in rice_disease

    is_valid_rice, r_cal_conf, _, _ = ood_detector.validate_confidence_and_ood(r_probs, threshold=30.0, is_crop_validation=False)
    assert is_valid_rice is True, "Valid Rice prediction should NOT be rejected!"

    print("[OK] Stage 5 & 6 Crop-Specific Disease Models Test Passed!\n")

if __name__ == "__main__":
    test_leaf_detection_roi_cropping()
    test_crop_classification_and_threshold_rejection()
    test_cross_crop_validation_mismatch_rejection()
    test_crop_specific_disease_models_and_calibration()
    print("ALL PRODUCTION VISION PIPELINE & OOD CALIBRATION TESTS PASSED SUCCESSFULLY!")
