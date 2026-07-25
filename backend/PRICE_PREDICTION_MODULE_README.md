# KrishiMitra AI - Crop Price Prediction Engine

The **Crop Price Prediction Engine** utilizes machine learning (**Random Forest Regressor**) trained on historical Indian APMC Mandi daily price datasets to forecast crop prices across **Today**, **Next 3 Days**, **Next 7 Days**, and **Next 15 Days**, classifying trend trajectory (`Increasing`, `Stable`, `Decreasing`) and confidence score.

---

## 🏗️ System Architecture & ML Pipeline

```
Python AI Service (python-ai/)
├── datasets/market_prices.csv           # Historical Time Series Dataset
├── training/train_price_model.py         # Training Pipeline & Model Persistence
├── app/models/random_forest.joblib      # Model & Feature Encoder Bundle
├── app/services/
│   ├── feature_engineering.py          # Lag, Moving Average & Date Encoders
│   ├── dataset_loader.py               # Singleton Dataset Loader
│   └── price_prediction_service.py     # Singleton Inference Engine
└── app/routers/price_prediction.py      # FastAPI Endpoint (POST /predict-price)

Node.js Backend (backend/src/)
├── models/PricePrediction.js            # Mongoose Schema (PricePredictions collection)
├── repositories/pricePrediction.repository.js # MongoDB Queries
├── services/pricePrediction.service.js   # Gateway Service
├── controllers/pricePrediction.controller.js # HTTP Handlers
└── routes/pricePrediction.routes.js     # Express Router (POST /api/price-prediction)
```

---

## 📊 Model Evaluation Metrics

Train-Test Evaluation Summary from `train_price_model.py`:
- **Mean Absolute Error (MAE)**: ₹132.68
- **Root Mean Squared Error (RMSE)**: ₹159.42
- **R² Score**: **0.9930**

**Feature Importances**:
1. `ma_7` (7-Day Moving Average): 20.1%
2. `ma_3` (3-Day Moving Average): 16.6%
3. `ma_15` (15-Day Moving Average): 16.3%
4. `prev_price` (Previous Day Price): 13.2%
5. `market_encoded` (APMC Mandi): 11.5%
6. `district_encoded` (District): 11.0%
7. `crop_encoded` (Crop Species): 10.9%

---

## 📡 API Endpoints Reference

### 1. Python FastAPI Inference Service
* **Endpoint**: `POST http://localhost:8000/predict-price`
* **Request**:
```json
{
  "crop": "Cotton",
  "market": "Rajkot APMC",
  "district": "Rajkot"
}
```
* **Response (`200 OK`)**:
```json
{
  "today": 7209,
  "after3days": 7314,
  "after7days": 7439,
  "after15days": 7726,
  "trend": "Increasing",
  "confidence": 91
}
```

---

### 2. Node.js API Gateway (With MongoDB Persistence)
* **Endpoint**: `POST http://localhost:5000/api/price-prediction`
* **Request**:
```json
{
  "crop": "Cotton",
  "market": "Rajkot APMC",
  "district": "Rajkot"
}
```
* **Response (`200 OK`)**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Price prediction generated successfully",
  "data": {
    "id": "6a646ca3...",
    "crop": "Cotton",
    "market": "Rajkot APMC",
    "district": "Rajkot",
    "today": 7209,
    "after3days": 7314,
    "after7days": 7439,
    "after15days": 7726,
    "trend": "Increasing",
    "confidence": 91,
    "predictionDate": "2026-07-25T07:58:27.256Z"
  }
}
```

---

### 3. Fetch Prediction History
* **Endpoint**: `GET http://localhost:5000/api/price-prediction/history`
* **Query Parameters**: `crop`, `farmId`, `farmerId`

---

## 🚀 How to Train Model

To retrain the Random Forest model on updated CSV data:

```bash
cd python-ai
py training/train_price_model.py
```
