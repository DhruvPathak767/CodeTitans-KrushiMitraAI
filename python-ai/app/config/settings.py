import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KrishiMitra AI - Leaf Disease Classifier"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ENABLE_DEBUG_LOGS: bool = True

    MODEL_PATH: str = os.path.join(os.path.dirname(__file__), "..", "weights", "leaf_disease_model.h5")
    YOLO_LEAF_MODEL_PATH: str = os.path.join(os.path.dirname(__file__), "..", "weights", "yolov8n-leaf.pt")
    CROP_MODEL_PATH: str = os.path.join(os.path.dirname(__file__), "..", "weights", "crop_classifier.keras")

    # Configurable Thresholds & Calibration Parameters
    CROP_CONFIDENCE_THRESHOLD: float = float(os.getenv("CROP_CONFIDENCE_THRESHOLD", "0.50"))        # 50% threshold for crop species
    DISEASE_CONFIDENCE_THRESHOLD: float = float(os.getenv("DISEASE_CONFIDENCE_THRESHOLD", "0.30"))  # 30% threshold for disease classifier
    OOD_ENTROPY_THRESHOLD: float = float(os.getenv("OOD_ENTROPY_THRESHOLD", "0.96"))                # 96% max entropy threshold
    TEMPERATURE_SCALING: float = float(os.getenv("TEMPERATURE_SCALING", "1.2"))                     # T = 1.2 Softmax scaling

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
