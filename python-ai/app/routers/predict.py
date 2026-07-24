from fastapi import APIRouter, HTTPException, status
from app.models.schemas import PredictRequest, PredictResponse
from app.services.prediction_service import prediction_service

router = APIRouter(tags=["Multi-Stage Plant Disease AI Engine"])

@router.post("/predict", response_model=PredictResponse)
@router.post("/api/v1/predict", response_model=PredictResponse)
async def predict_disease(payload: PredictRequest):
    """
    Multi-Stage Plant Disease AI Inference Endpoint:
    1. Image Preprocessing & Foliage Spectrum Verification
    2. Crop Species Classification
    3. Crop Validation (Predicted Crop vs Selected Crop) -> HTTP 400 on Mismatch
    4. Out-of-Distribution (OOD) & Uncertainty Check -> HTTP 400 on Low Confidence
    5. Crop-Specific Disease Model Execution
    6. Temperature Scaling Calibration (T = 1.5)
    7. Treatment Protocol Mapping
    """
    if not payload.imageUrl or not payload.imageUrl.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid image URL starting with http:// or https:// is required."
        )

    try:
        res = await prediction_service.predict_leaf_disease(payload.imageUrl, payload.crop or "Cotton")
        return res
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Prediction error: {str(e)}"
        )
