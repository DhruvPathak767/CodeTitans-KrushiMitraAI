import cv2
import numpy as np
import logging
from typing import Tuple, Dict, Any, Optional

logger = logging.getLogger("leaf_detector")

class FieldLeafDetector:
    """
    Field-Ready Primary Leaf Detector & ROI Extractor.
    Localizes the primary crop leaf in field photos using YOLOv8/YOLO11 or HSV contour detection,
    cropping the Region of Interest (ROI) to isolate leaf tissue from background soil,
    farmer hands, sky, and background weeds.
    """
    def __init__(self, min_leaf_area_ratio: float = 0.06, yolo_model: Optional[Any] = None):
        self.min_leaf_area_ratio = min_leaf_area_ratio
        self.yolo_model = yolo_model

    def set_yolo_model(self, yolo_model: Any):
        """Sets or updates the loaded YOLO leaf detector model singleton."""
        self.yolo_model = yolo_model
        logger.info("YOLO Leaf Detector model attached to FieldLeafDetector.")

    def detect_and_crop_leaf_roi(
        self,
        img_np: np.ndarray,
        target_size: Tuple[int, int] = (224, 224)
    ) -> Tuple[np.ndarray, Dict[str, Any], Tuple[int, int, int, int]]:
        """
        Detects primary leaf ROI using YOLO or contour segmentation and crops the leaf area.
        Returns (cropped_leaf_roi: np.ndarray, roi_stats: dict, bbox: tuple).
        """
        if img_np is None or img_np.size == 0:
            raise ValueError("Input image array is empty or invalid.")

        h, w, _ = img_np.shape
        total_area = h * w

        # 1. Try YOLOv8/YOLO11 Object Detection / Segmentation if model is available
        if self.yolo_model is not None:
            try:
                results = self.yolo_model.predict(img_np, verbose=False, conf=0.25)
                if results and len(results) > 0 and len(results[0].boxes) > 0:
                    # Select largest or highest-confidence box
                    boxes = results[0].boxes.xyxy.cpu().numpy()
                    confs = results[0].boxes.conf.cpu().numpy()
                    
                    # Compute area for each box
                    areas = [(box[2] - box[0]) * (box[3] - box[1]) for box in boxes]
                    best_idx = int(np.argmax(confs * np.sqrt(areas)))
                    
                    box = boxes[best_idx]
                    x1, y1, x2, y2 = map(int, box)
                    
                    # Add 5% padding around detected leaf box
                    pad_w = int((x2 - x1) * 0.05)
                    pad_h = int((y2 - y1) * 0.05)
                    x1 = max(0, x1 - pad_w)
                    y1 = max(0, y1 - pad_h)
                    x2 = min(w, x2 + pad_w)
                    y2 = min(h, y2 + pad_h)

                    cropped_roi = img_np[y1:y2, x1:x2]
                    if cropped_roi.size > 0:
                        resized_roi = cv2.resize(cropped_roi, target_size, interpolation=cv2.INTER_AREA)
                        roi_coverage = float((x2 - x1) * (y2 - y1) / total_area)
                        
                        logger.info(f"YOLO Leaf Detector -> Primary Leaf ROI bbox ({x1},{y1},{x2},{y2}) Coverage: {round(roi_coverage * 100, 2)}% Conf: {round(float(confs[best_idx])*100, 1)}%")
                        return resized_roi, {
                            "roi_coverage": roi_coverage,
                            "is_cropped": True,
                            "method": "yolo_detector",
                            "confidence": float(confs[best_idx]),
                            "bbox": (x1, y1, x2, y2)
                        }, (x1, y1, x2, y2)
            except Exception as e:
                logger.warning(f"YOLO leaf detection fallback to HSV contour: {e}")

        # 2. HSV Foliage Segmentation Fallback
        hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)

        # Green foliage mask (Hue [20, 98])
        lower_green = np.array([20, 25, 25])
        upper_green = np.array([98, 255, 255])
        mask_green = cv2.inRange(hsv, lower_green, upper_green)

        # Yellow/Chlorotic leaf mask (Hue [10, 38])
        lower_yellow = np.array([10, 40, 40])
        upper_yellow = np.array([38, 255, 255])
        mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)

        foliage_mask = cv2.bitwise_or(mask_green, mask_yellow)

        # Morphological operations to clean noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        cleaned_mask = cv2.morphologyEx(foliage_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
        cleaned_mask = cv2.morphologyEx(cleaned_mask, cv2.MORPH_OPEN, kernel, iterations=1)

        contours, _ = cv2.findContours(cleaned_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            resized = cv2.resize(img_np, target_size, interpolation=cv2.INTER_AREA)
            return resized, {"roi_coverage": 1.0, "is_cropped": False, "method": "full_image"}, (0, 0, w, h)

        largest_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest_contour)
        coverage_ratio = area / total_area

        if coverage_ratio < self.min_leaf_area_ratio:
            logger.warning(f"Primary leaf ROI area ({round(coverage_ratio*100, 2)}%) below threshold ({round(self.min_leaf_area_ratio*100, 2)}%)")
            resized = cv2.resize(img_np, target_size, interpolation=cv2.INTER_AREA)
            return resized, {"roi_coverage": coverage_ratio, "is_cropped": False, "method": "full_image"}, (0, 0, w, h)

        x, y, bw, bh = cv2.boundingRect(largest_contour)
        pad_x = int(bw * 0.05)
        pad_y = int(bh * 0.05)

        x1 = max(0, x - pad_x)
        y1 = max(0, y - pad_y)
        x2 = min(w, x + bw + pad_x)
        y2 = min(h, y + bh + pad_y)

        cropped_roi = img_np[y1:y2, x1:x2]
        if cropped_roi.size == 0:
            cropped_roi = img_np

        resized_roi = cv2.resize(cropped_roi, target_size, interpolation=cv2.INTER_AREA)
        roi_coverage = float((x2 - x1) * (y2 - y1) / total_area)

        logger.info(f"Contour Leaf Detector -> Extracted Leaf ROI bbox ({x1},{y1},{x2},{y2}) Coverage: {round(roi_coverage * 100, 2)}%")

        roi_stats = {
            "roi_coverage": roi_coverage,
            "is_cropped": True,
            "method": "hsv_contour",
            "bbox": (x1, y1, x2, y2)
        }

        return resized_roi, roi_stats, (x1, y1, x2, y2)

leaf_detector_singleton = FieldLeafDetector(min_leaf_area_ratio=0.06)
