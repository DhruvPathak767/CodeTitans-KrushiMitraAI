from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class PredictRequest(BaseModel):
    imageUrl: str = Field(..., description="Cloudinary or HTTP URL of the leaf image")
    crop: Optional[str] = Field("Cotton", description="Selected crop type (e.g. Potato, Tomato, Cotton, Wheat, Rice)")

class CropPredictionInfo(BaseModel):
    crop: str = Field(..., description="Predicted crop species")
    confidence: float = Field(..., description="Calibrated confidence score percentage")

class DiseasePredictionInfo(BaseModel):
    disease: str = Field(..., description="Predicted disease for validated crop")
    fullLabel: Optional[str] = None
    confidence: float = Field(..., description="Calibrated confidence score percentage")
    severity: Optional[str] = "moderate"

class TreatmentInfo(BaseModel):
    fungicide: str = Field("", description="Recommended chemical fungicide")
    organic: str = Field("", description="Recommended organic bio-remedy")
    prevention: str = Field("", description="Preventative agricultural tips")

class PredictResponse(BaseModel):
    success: bool = True
    cropPrediction: CropPredictionInfo
    diseasePrediction: DiseasePredictionInfo
    treatment: TreatmentInfo
    predictionTime: Optional[str] = "45ms"
    reportId: Optional[str] = None
    debugInfo: Optional[Dict[str, Any]] = None
