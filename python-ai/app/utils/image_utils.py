import io
import httpx
from PIL import Image
import numpy as np
from typing import Tuple

async def download_and_preprocess_image(image_url: str, target_size: Tuple[int, int] = (224, 224)) -> Tuple[np.ndarray, Tuple[int, int]]:
    """
    Downloads image from URL, resizes to target_size, and normalizes array to [0, 1].
    Returns (preprocessed_array, original_size).
    """
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(image_url)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch image from URL. Status code: {response.status_code}")
        image_bytes = response.content

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    original_size = image.size # (width, height)

    # Resize to standard CNN dimensions
    resized_image = image.resize(target_size)
    image_array = np.array(resized_image, dtype=np.float32) / 255.0

    # Expand dims to batch shape (1, 224, 224, 3)
    batch_array = np.expand_dims(image_array, axis=0)

    return batch_array, original_size
