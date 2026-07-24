import io
import httpx
import numpy as np
from PIL import Image
import cv2
import logging
from typing import Tuple, Dict

logger = logging.getLogger("image_processor")

def is_plant_leaf_image(img_np: np.ndarray) -> Tuple[bool, float, dict]:
    """
    Analyzes HSV color spectrum and foliage texture to verify if an image is a plant leaf,
    and extracts visual disease lesion feature indicators.
    Returns (is_leaf: bool, foliage_ratio: float, feature_vector: dict).
    """
    if img_np is None or img_np.size == 0:
        return False, 0.0, {}

    # Convert RGB numpy array to HSV color space
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)

    # 1. Green Foliage Mask (Hue [22, 98])
    lower_green = np.array([22, 20, 20])
    upper_green = np.array([98, 255, 255])
    mask_green = cv2.inRange(hsv, lower_green, upper_green)

    # 2. Yellowish / Chlorotic Halo Mask (Hue [10, 35])
    lower_yellow = np.array([10, 30, 30])
    upper_yellow = np.array([38, 255, 255])
    mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)

    # 3. Brownish / Necrotic Lesion Spectrum (Hue [0, 25])
    lower_brown = np.array([0, 20, 20])
    upper_brown = np.array([25, 255, 220])
    mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)

    # 4. Dark Necrotic Lesion Mask (Low Value/Brightness on leaf)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    _, mask_dark_spots = cv2.threshold(gray, 115, 255, cv2.THRESH_BINARY_INV)

    # Combined foliage mask including diseased brown leaf regions
    foliage_mask = cv2.bitwise_or(cv2.bitwise_or(mask_green, mask_yellow), mask_brown)

    total_pixels = img_np.shape[0] * img_np.shape[1]
    foliage_pixels = np.sum(foliage_mask > 0)
    foliage_ratio = float(foliage_pixels / total_pixels)

    # Calculate spot ratios within foliage area
    dark_spot_pixels = np.sum(cv2.bitwise_and(mask_dark_spots, foliage_mask) > 0)
    yellow_halo_pixels = np.sum(mask_yellow > 0)

    dark_spot_ratio = float(dark_spot_pixels / total_pixels)
    yellow_halo_ratio = float(yellow_halo_pixels / total_pixels)
    necrotic_density = dark_spot_ratio + (yellow_halo_ratio * 0.5)

    feature_vector = {
        "foliage_ratio": foliage_ratio,
        "dark_spot_ratio": dark_spot_ratio,
        "yellow_halo_ratio": yellow_halo_ratio,
        "necrotic_density": necrotic_density,
    }

    logger.info(f"Foliage spectrum ratio: {round(foliage_ratio * 100, 2)}% | Spot ratio: {round(dark_spot_ratio * 100, 2)}%")

    # If foliage ratio is below 12%, reject non-leaf images
    is_leaf = foliage_ratio >= 0.12 or dark_spot_ratio >= 0.04
    return is_leaf, foliage_ratio, feature_vector

analyze_leaf_features = is_plant_leaf_image

async def download_and_read_image(image_url: str) -> np.ndarray:
    """
    Downloads image stream from URL and returns decoded RGB numpy array.
    """
    if not image_url or not isinstance(image_url, str):
        raise ValueError("Image URL must be a valid string.")

    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(image_url)
            if response.status_code != 200:
                raise ValueError(f"Cloudinary download failed with status code: {response.status_code}")
            image_bytes = response.content
    except Exception as e:
        logger.error(f"Failed to download image from {image_url}: {e}")
        raise ValueError(f"Unable to download image from URL: {str(e)}")

    try:
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        logger.error(f"Corrupted or invalid image data: {e}")
        raise ValueError("Provided file is not a valid or supported image.")

    img_np = np.array(pil_img)
    if len(img_np.shape) == 2:
        img_np = cv2.cvtColor(img_np, cv2.COLOR_GRAY2RGB)

    return img_np

async def preprocess_image_from_url(image_url: str, target_size: tuple = (224, 224)) -> Tuple[np.ndarray, dict]:
    """
    Downloads leaf image from URL, verifies foliage, normalizes to tensor shape (1, 224, 224, 3).
    """
    img_np = await download_and_read_image(image_url)
    is_leaf, foliage_ratio, feature_vector = is_plant_leaf_image(img_np)
    if not is_leaf:
        logger.warning(f"Non-leaf image rejected. Foliage ratio: {round(foliage_ratio * 100, 2)}%")
        raise ValueError("Non-leaf image detected! The uploaded photo does not appear to be a crop leaf. Please upload a clear photo of a plant leaf.")

    resized_img = cv2.resize(img_np, target_size, interpolation=cv2.INTER_AREA)
    normalized_tensor = resized_img.astype(np.float32) / 255.0
    batch_tensor = np.expand_dims(normalized_tensor, axis=0)

    return batch_tensor, feature_vector
