import numpy as np
import logging
from typing import Tuple, Dict, Any
from app.config.settings import settings

logger = logging.getLogger("ood_detector")

class OutOfDistributionDetector:
    """
    Out-Of-Distribution (OOD) Detector & Temperature Scaling Calibration Engine.
    Provides calibrated confidence validation, entropy scoring, and margin analysis
    without falsely rejecting valid high-quality leaf predictions.
    """
    def __init__(
        self,
        temperature: float = settings.TEMPERATURE_SCALING,
        min_confidence_threshold: float = settings.DISEASE_CONFIDENCE_THRESHOLD
    ):
        self.temperature = temperature
        self.min_confidence_threshold = min_confidence_threshold

    def apply_temperature_scaling_to_logits(self, logits: np.ndarray, temperature: float = settings.TEMPERATURE_SCALING) -> np.ndarray:
        """
        Applies Temperature Scaling Calibration to raw neural network LOGITS:
        Softmax_calibrated(z) = exp(z / T) / sum(exp(z / T))
        """
        if logits is None or len(logits) == 0:
            return np.array([])
        
        T = max(temperature, 1.0)
        scaled_logits = logits / T
        exp_logits = np.exp(scaled_logits - np.max(scaled_logits))
        return exp_logits / np.sum(exp_logits)

    def compute_entropy(self, probabilities: np.ndarray) -> float:
        """
        Calculates Shannon Entropy: H(P) = -sum(P(x) * log2(P(x)))
        High entropy indicates uniform/flat probability distribution (uncertainty).
        """
        if probabilities is None or len(probabilities) == 0:
            return 0.0
        eps = 1e-12
        probs = np.clip(probabilities, eps, 1.0 - eps)
        return float(-np.sum(probs * np.log2(probs)))

    def validate_confidence_and_ood(
        self,
        probabilities: np.ndarray,
        threshold: float = settings.DISEASE_CONFIDENCE_THRESHOLD * 100.0,
        is_crop_validation: bool = False
    ) -> Tuple[bool, float, str, Dict[str, Any]]:
        """
        Dynamic Confidence & OOD Evaluation:
        - Evaluates max probability, margin over runner-up class, and normalized entropy.
        - Only rejects when distribution is genuinely flat/uniform or lacks a dominant prediction.
        Returns (is_valid: bool, confidence_pct: float, message: str, debug_metrics: dict).
        """
        if probabilities is None or len(probabilities) == 0:
            return False, 0.0, "Empty probability distribution.", {}

        num_classes = len(probabilities)
        sorted_probs = np.sort(probabilities)[::-1]
        
        top1_prob = float(sorted_probs[0])
        top2_prob = float(sorted_probs[1]) if num_classes > 1 else 0.0
        margin = float(top1_prob - top2_prob)
        confidence_pct = round(top1_prob * 100.0, 2)

        # Calculate normalized entropy ratio H(P) / H_max
        entropy = self.compute_entropy(probabilities)
        max_possible_entropy = float(np.log2(max(num_classes, 2)))
        entropy_ratio = round(float(entropy / max_possible_entropy), 4)

        # Baseline random chance for num_classes (e.g. 1/7 = 14.3%)
        random_baseline = 1.0 / max(num_classes, 1)
        
        # OOD Score (0.0 = high certainty, 1.0 = total uncertainty)
        ood_score = round(float(entropy_ratio * (1.0 - margin)), 4)

        debug_metrics = {
            "num_classes": num_classes,
            "max_probability": top1_prob,
            "confidence_pct": confidence_pct,
            "runner_up_probability": top2_prob,
            "margin": margin,
            "entropy": round(entropy, 4),
            "entropy_ratio": entropy_ratio,
            "ood_score": ood_score,
            "threshold_used": threshold,
            "is_crop_validation": is_crop_validation
        }

        logger.info(
            f"OOD Audit -> Top1: {confidence_pct}% | Margin: {round(margin*100, 1)}% | "
            f"Entropy Ratio: {entropy_ratio} | OOD Score: {ood_score} | CropMode: {is_crop_validation}"
        )

        # Dynamic Acceptance Criteria:
        min_threshold_prob = threshold / 100.0 if threshold > 1.0 else threshold

        if is_crop_validation:
            is_confident = (top1_prob >= min_threshold_prob) or (margin >= 0.08 and top1_prob >= (1.5 * random_baseline))
            is_uniform_ood = (entropy_ratio >= settings.OOD_ENTROPY_THRESHOLD) and (margin < 0.03)
        else:
            # Disease classification on validated leaf: accept if top probability >= threshold or margin >= 0.05
            is_confident = (top1_prob >= min_threshold_prob) or (margin >= 0.05) or (top1_prob >= (1.2 * random_baseline))
            is_uniform_ood = (entropy_ratio >= 0.99) and (margin < 0.02)

        if is_uniform_ood:
            msg = f"Distribution is uniform (Entropy ratio: {entropy_ratio}, Margin: {round(margin*100,1)}%). OOD detected."
            logger.warning(f"OOD Rejection: {msg}")
            return False, confidence_pct, msg, debug_metrics

        if not is_confident:
            msg = f"Confidence ({confidence_pct}%) below threshold ({round(min_threshold_prob*100, 1)}%) with insufficient margin ({round(margin*100,1)}%)."
            logger.warning(f"Confidence Rejection: {msg}")
            return False, confidence_pct, msg, debug_metrics

        return True, confidence_pct, "Valid prediction", debug_metrics

ood_detector = OutOfDistributionDetector()
