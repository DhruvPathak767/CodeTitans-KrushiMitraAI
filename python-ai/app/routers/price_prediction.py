from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import logging
from app.services.price_prediction_service import price_prediction_service_singleton

logger = logging.getLogger("price_prediction_router")
router = APIRouter(tags=["Price Prediction"])

class PricePredictionRequest(BaseModel):
    crop: str = Field(..., example="Cotton")
    market: str = Field(..., example="Rajkot APMC")
    district: str = Field(..., example="Rajkot")
    current_price: float = Field(None, example=2500.0)

class PricePredictionResponse(BaseModel):
    today: int
    after3days: int
    after7days: int
    after15days: int
    trend: str
    confidence: int

@router.post(
    "/predict-price",
    response_model=PricePredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Crop Market Prices for 3, 7, and 15 Days"
)
async def predict_price(payload: PricePredictionRequest):
    try:
        if not payload.crop or not payload.market:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Crop and Market parameters are required."
            )

        prediction = price_prediction_service_singleton.predict_price(
            crop=payload.crop,
            market=payload.market,
            district=payload.district,
            current_price=payload.current_price
        )
        return prediction
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error during price prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Price Prediction Engine error: {str(e)}"
        )
