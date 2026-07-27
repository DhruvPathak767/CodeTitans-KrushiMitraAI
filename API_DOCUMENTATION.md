# KrishiMitra AI — API Documentation

## Base URLs

| Service | Base URL |
|---------|---------|
| Node.js Backend | `http://localhost:5000` |
| Python AI Microservice | `http://localhost:8000` |

## Authentication

All protected endpoints require a **Bearer JWT token** in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

Access tokens are obtained from `/auth/login` or `/auth/verify-otp`.
Use `/auth/refresh` with a valid refresh token to get a new access token.

---

## Response Format

All backend responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup

Register a new farmer account.

**Request Body:**
```json
{
  "name": "Ramesh Patel",
  "email": "ramesh@farm.com",
  "phone": "9876543210",
  "password": "Password@123"
}
```

**Response — 201:**
```json
{
  "success": true,
  "message": "Account created. OTP sent to ramesh@farm.com",
  "data": { "userId": "..." }
}
```

---

### POST /auth/verify-otp

Verify email with the OTP sent during signup.

**Request Body:**
```json
{
  "email": "ramesh@farm.com",
  "otp": "123456"
}
```

**Response — 200:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { "id": "...", "name": "Ramesh Patel", "email": "...", "role": "FARMER" }
  }
}
```

---

### POST /auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "ramesh@farm.com",
  "password": "Password@123"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { ... }
  }
}
```

---

### POST /auth/refresh

Refresh the access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "accessToken": "eyJ..." }
}
```

---

### POST /auth/forgot-password

Request a password reset email.

**Request Body:**
```json
{
  "email": "ramesh@farm.com"
}
```

---

### POST /auth/reset-password

Reset password with token received via email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword@123"
}
```

---

### POST /auth/logout *(Protected)*

Invalidate the refresh token and logout.

**Headers:** `Authorization: Bearer <token>`

---

### GET /auth/me *(Protected)*

Get the authenticated user's profile.

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Ramesh Patel",
    "email": "ramesh@farm.com",
    "phone": "9876543210",
    "role": "FARMER",
    "preferredLanguage": "English",
    "language": "en",
    "emailVerified": true,
    "activeFarm": "..."
  }
}
```

---

### PUT /auth/profile *(Protected)*

Update user profile.

**Request Body (all fields optional):**
```json
{
  "name": "Ramesh B. Patel",
  "profileImage": "https://cloudinary.com/...",
  "preferredLanguage": "Hindi",
  "language": "hi"
}
```

---

## 🏡 Farm Management Endpoints

### POST /farms/ *(Protected)*

Register a new farm.

**Request Body:**
```json
{
  "farmName": "Ramesh's Cotton Farm",
  "cropName": "Cotton",
  "soilType": "Black Soil",
  "area": 3.5,
  "areaUnit": "ACRE",
  "sowingDate": "2025-06-15",
  "irrigationType": "Drip Irrigation",
  "location": {
    "coordinates": [70.8022, 22.3039]
  },
  "address": {
    "state": "Gujarat",
    "district": "Rajkot",
    "village": "Shapar"
  }
}
```

**Response — 201:**
```json
{
  "success": true,
  "message": "Farm created successfully",
  "data": { "farm": { "_id": "...", "farmName": "..." } }
}
```

---

### GET /farms/ *(Protected)*

List all farms for the authenticated user.

**Response — 200:**
```json
{
  "success": true,
  "data": { "farms": [ { ... }, { ... } ] }
}
```

---

### GET /farms/check *(Protected)*

Check if the user has at least one farm registered (used for onboarding guard).

**Response — 200:**
```json
{
  "success": true,
  "data": { "hasFarm": true }
}
```

---

### GET /farms/:id *(Protected)*

Get a specific farm by ID.

---

### PUT /farms/:id *(Protected)*

Update farm details.

---

### DELETE /farms/:id *(Protected)*

Delete a farm.

---

### PATCH /farms/:id/select *(Protected)*

Set a farm as the active farm for weather/advisory context.

---

## 🌦️ Weather Endpoints

### GET /weather/ *(Protected)*

Get full live weather data for the user's active farm.

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "isCached": false,
    "location": {
      "farmName": "Ramesh's Cotton Farm",
      "village": "Shapar",
      "district": "Rajkot",
      "state": "Gujarat",
      "latitude": 22.3039,
      "longitude": 70.8022
    },
    "current": {
      "temperature": 32,
      "feelsLike": 35,
      "humidity": 72,
      "windSpeed": 14,
      "windDirection": 270,
      "rainProbability": 45,
      "rainVolume": 0,
      "uvIndex": 7,
      "pressure": 1008,
      "visibility": 10,
      "weatherCondition": "Partly cloudy"
    },
    "hourly": [ ... ],
    "daily": [ ... ],
    "airQuality": {
      "aqi": 2,
      "aqiStatus": "Fair",
      "pm25": 18.5,
      "pm10": 32.1
    },
    "agriculture": {
      "diseaseRisk": "Moderate Disease Risk (Monitor lower leaves)",
      "heatStress": "Optimal Thermal Range",
      "sprayWindow": "Favorable Spray Window (Clear weather & low wind)",
      "irrigationAdvice": "Normal Irrigation Schedule",
      "cropComfort": "Optimal",
      "fieldWorkRecommendation": "Favorable for Field Operations"
    },
    "alerts": []
  }
}
```

---

### GET /weather/debug

Get full debug weather data **without authentication** (for testing).

Returns the same structure as above plus `rawResponse` and `request` debug info.

---

## 🤖 AI Crop Advisory Endpoints

### GET /advisory/ *(Protected)*

Get the latest AI crop advisory for the active farm.

**Query Parameters:**
- `lang` — Language code: `en`, `hi`, `gu` (default: user preference)

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "advisory": {
      "overallStatus": "Good",
      "reason": "Current weather is favorable for Cotton growth.",
      "nextAction": "Schedule drip irrigation in 2 days",
      "irrigation": { "status": "Not Required", "schedule": "..." },
      "fertilizer": { "status": "Recommended", "type": "NPK 19:19:19" },
      "fieldWork": [ "Apply fungicide on lower leaves", "Check for aphids" ],
      "timeline": [ ... ],
      "warning": null
    },
    "weather": { ... },
    "farm": { ... },
    "language": "en",
    "generatedAt": "2026-07-28T00:00:00.000Z"
  }
}
```

---

### POST /advisory/refresh *(Protected)*

Force-regenerate the AI advisory regardless of cache.

---

### GET /advisory/history *(Protected)*

Get the advisory generation history.

---

## 💧 Smart Irrigation Endpoints

### GET /irrigation/ *(Protected)*

Get the current smart irrigation recommendation.

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "irrigationPlan": {
      "crop": "Cotton",
      "growthStage": "Flowering",
      "daysSinceSowing": 52,
      "waterDemandMultiplier": 1.5,
      "recommendedWaterVolume": "45 liters/sq.m",
      "nextIrrigationDate": "2026-07-30",
      "advice": "Flowering stage requires 50% more water. Schedule irrigation every 4 days.",
      "weatherAdjustment": "Reduce by 20% due to 45% rain probability forecast"
    }
  }
}
```

---

### POST /irrigation/refresh *(Protected)*

Force refresh the irrigation plan.

---

### GET /irrigation/history *(Protected)*

Get irrigation plan history.

---

## 🐛 Disease Detection Endpoints

### POST /api/upload/image *(Protected)*

Upload a crop leaf image to Cloudinary before disease detection.

**Request:** `multipart/form-data`
- `image`: Image file (JPEG, PNG, WebP)

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://res.cloudinary.com/.../leaf.jpg",
    "publicId": "krishimitra/leaf_abc123"
  }
}
```

---

### POST /api/disease/predict *(Protected)*

Run the multi-stage AI disease detection pipeline.

**Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/.../leaf.jpg",
  "crop": "Cotton",
  "farmId": "optional_farm_id"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "report": {
      "_id": "...",
      "imageUrl": "...",
      "crop": "Cotton",
      "disease": "Bacterial Blight",
      "confidence": 0.94,
      "severity": "HIGH",
      "aiData": {
        "leafDetected": true,
        "oodScore": 0.12,
        "topPredictions": [
          { "label": "Bacterial Blight", "confidence": 0.94 },
          { "label": "Healthy", "confidence": 0.04 }
        ]
      },
      "createdAt": "..."
    }
  }
}
```

**Error — 400 (OOD Rejection):**
```json
{
  "success": false,
  "message": "Image does not appear to contain a plant leaf. Please upload a clear crop leaf image."
}
```

---

### GET /api/disease/history *(Protected)*

Get disease detection history for the authenticated user.

---

### GET /api/disease/:id *(Protected)*

Get a specific disease report by ID.

---

### DELETE /api/disease/history/all *(Protected)*

Delete all disease reports for the user.

---

### DELETE /api/disease/:id *(Protected)*

Delete a specific disease report.

---

## 📊 Market Intelligence Endpoints

### GET /market/prices

Get the latest APMC mandi prices.

**Query Parameters:**
- `crop` — Filter by crop name (optional)
- `state` — Filter by state (optional)
- `limit` — Results limit (default: 50)

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "prices": [
      {
        "commodity": "Cotton",
        "market": "Rajkot",
        "state": "Gujarat",
        "district": "Rajkot",
        "minPrice": 5800,
        "maxPrice": 6400,
        "modalPrice": 6100,
        "arrivedAt": "2026-07-28"
      }
    ]
  }
}
```

---

### GET /market/history

Get historical mandi price data.

---

### GET /market/nearby

Get market prices for nearby mandis.

**Query Parameters:**
- `lat` — Latitude
- `lng` — Longitude
- `radius` — Search radius in km

---

### GET /market/crops

Get list of all commodities available in the market database.

---

### GET /market/markets

Get list of all markets/mandis in the database.

---

### POST /market/sync

Trigger a manual sync of APMC prices from data.gov.in.

---

## 💹 AI Sell/Store Recommendation Endpoints

### POST /recommendation/generate

Generate an AI sell/store decision for a farmer's crop.

**Request Body:**
```json
{
  "crop": "Cotton",
  "quantity": 25,
  "currentPrice": 6100,
  "storageAvailable": true,
  "storageCost": 50
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "recommendation": {
      "decision": "STORE",
      "estimatedProfit": "12%",
      "riskLevel": "LOW",
      "confidence": 92,
      "reason": "Market prices are expected to increase over the next 7 days while weather remains favorable for dry storage.",
      "recommendationSummary": "Store the crop for approximately 7-10 days to maximize APMC mandi rate."
    }
  }
}
```

**Decision enum values:** `STORE` | `SELL_NOW` | `SELL_PARTIALLY` | `IMMEDIATE_SALE_DISEASE` | `IMMEDIATE_SALE_WEATHER`

---

### GET /recommendation/history

Get the farmer's recommendation history.

---

### GET /recommendation/:id

Get a specific recommendation by ID.

---

## 📈 Price Prediction Endpoints

### POST /price-prediction/

Generate a crop price prediction.

**Request Body:**
```json
{
  "crop": "Cotton",
  "state": "Gujarat",
  "district": "Rajkot",
  "forecastDays": 15
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "prediction": {
      "crop": "Cotton",
      "currentPrice": 6100,
      "predictedPrice": 6850,
      "trend": "RISING",
      "forecastDays": 15,
      "confidence": 0.87
    }
  }
}
```

---

### GET /price-prediction/history

Get prediction history for the user.

---

### GET /price-prediction/:id

Get a specific prediction by ID.

---

## 🔔 Notification Endpoints

### GET /notifications/ *(Protected)*

Get all notifications for the authenticated user.

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "title": "Heavy Rain Probability Alert",
        "message": "Rain probability is 75% for Ramesh's Cotton Farm. Postpone chemical spraying.",
        "type": "rain",
        "priority": "high",
        "language": "en",
        "read": false,
        "createdAt": "2026-07-28T00:00:00.000Z"
      }
    ],
    "unreadCount": 3
  }
}
```

---

### POST /notifications/read *(Protected)*

Mark a specific notification as read.

**Request Body:**
```json
{ "notificationId": "..." }
```

---

### POST /notifications/read-all *(Protected)*

Mark all notifications as read.

---

### DELETE /notifications/ *(Protected)*

Delete a specific notification.

**Request Body:**
```json
{ "notificationId": "..." }
```

---

## 💬 AI Chat Endpoints

### POST /chat/ *(Protected)*

Send a message to the AI farming assistant.

**Request Body:**
```json
{
  "message": "What fertilizer should I apply for cotton in flowering stage?",
  "lang": "en"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "reply": "For Cotton in the Flowering stage, I recommend applying **DAP (Di-Ammonium Phosphate)** at 25 kg/acre to support boll development...",
    "language": "en"
  }
}
```

---

### GET /chat/history *(Protected)*

Get the full chat history for the user.

---

### DELETE /chat/history *(Protected)*

Clear all chat history for the user.

---

## 📍 Location Endpoints

### POST /location/reverse

Reverse geocode GPS coordinates to an address.

**Request Body:**
```json
{
  "latitude": 22.3039,
  "longitude": 70.8022
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "formattedAddress": "Shapar, Rajkot, Gujarat 360024, India",
    "state": "Gujarat",
    "district": "Rajkot",
    "village": "Shapar",
    "pincode": "360024",
    "country": "India"
  }
}
```

---

### GET /location/search?q= 

Search for locations within India.

**Query Parameters:**
- `q` — Search query string (e.g., `Rajkot Gujarat`)

---

## 🐍 Python AI Microservice Endpoints

Base URL: `http://localhost:8000`

### POST /predict

Run the full multi-stage disease detection pipeline.

**Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/.../leaf.jpg",
  "crop": "Cotton"
}
```

**Response — 200:**
```json
{
  "disease": "Bacterial Blight",
  "confidence": 0.94,
  "severity": "HIGH",
  "leafDetected": true,
  "oodScore": 0.12,
  "topPredictions": [
    { "label": "Bacterial Blight", "confidence": 0.94 },
    { "label": "Healthy", "confidence": 0.04 }
  ],
  "inferenceTimeMs": 847
}
```

**Error — 400 (OOD):**
```json
{ "detail": "Image does not appear to contain a plant leaf." }
```

---

### POST /price-prediction

Run Random Forest price prediction.

**Request Body:**
```json
{
  "crop": "Cotton",
  "state": "Gujarat",
  "district": "Rajkot",
  "forecastDays": 15
}
```

---

### GET /docs

Interactive FastAPI Swagger documentation UI.

### GET /redoc

FastAPI ReDoc documentation.

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request / Validation error |
| `401` | Unauthorized (missing/invalid JWT) |
| `403` | Forbidden |
| `404` | Resource not found |
| `422` | Unprocessable entity (validation) |
| `503` | Service unavailable (WeatherAPI, Groq, Python AI down) |
| `500` | Internal server error |

---

*KrishiMitra AI API Documentation — Team CodeTitans*
