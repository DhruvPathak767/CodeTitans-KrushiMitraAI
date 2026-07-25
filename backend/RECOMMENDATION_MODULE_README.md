# KrishiMitra AI - Sell / Store Decision Engine Module

The **AI-powered Sell / Store Decision Engine Module** provides intelligent agronomic & financial advice to farmers, recommending whether to **STORE**, **SELL NOW**, **SELL PARTIALLY**, or execute **IMMEDIATE SALE** due to disease or weather risks.

---

## 🏗️ Architecture Design (Clean Architecture)

```
backend/src/
├── models/
│   └── Recommendation.js           # Mongoose Schema & Indexes (Recommendations collection)
├── repositories/
│   └── recommendation.repository.js# MongoDB Persistence Operations
├── services/
│   ├── ruleEngine.service.js       # Pre-Evaluated Rule Evaluator
│   ├── groqPrompt.service.js       # Groq AI (llama-3.3-70b-versatile) JSON Builder
│   └── recommendation.service.js   # Main Decision Engine Orchestrator
├── controllers/
│   └── recommendation.controller.js# HTTP Request/Response Handler
└── routes/
    └── recommendation.routes.js    # Express Route Registry
```

---

## ⚙️ Decision Pipeline & Rule Engine

```
Frontend Request 
    ↓
1. Fetch Telemetry across Farm, Weather, Market, and Disease Modules
    ↓
2. Rule Engine Evaluation
   - Rule 1: High Disease Severity -> IMMEDIATE_SALE_DISEASE
   - Rule 2: Rain > 80% & No Storage -> IMMEDIATE_SALE_WEATHER
   - Rule 3: Upward Price Trend + Storage -> STORE
   - Rule 4: Stable Price + Healthy Crop -> STORE
   - Rule 5: Downward Price Trend -> SELL_NOW
    ↓
3. Groq AI Analysis (llama-3.3-70b-versatile)
    ↓
4. MongoDB Persistence (Recommendations Collection)
    ↓
5. JSON API Response
```

---

## 📡 API Endpoints Reference

### 1. Generate Decision Recommendation
* **Endpoint**: `POST /api/recommendation/generate`
* **Request Body**:
```json
{
  "farmId": "66a267f...",
  "storageAvailable": true,
  "storageCost": 150
}
```
* **Response (`200 OK`)**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Recommendation generated successfully",
  "data": {
    "id": "6a645fc5...",
    "crop": "Cotton",
    "quantity": 100,
    "marketPrice": 7250,
    "predictedPrice": 8120,
    "decision": "STORE",
    "estimatedProfit": "12%",
    "riskLevel": "LOW",
    "confidence": 95,
    "reason": "Market prices are expected to increase over the next 5 days while weather conditions remain favorable.",
    "recommendationSummary": "Store the crop for approximately one week before selling.",
    "storageAvailable": true,
    "storageCost": 150,
    "createdAt": "2026-07-25T07:03:33.225Z"
  }
}
```

---

### 2. Get Recommendation History
* **Endpoint**: `GET /api/recommendation/history`
* **Query Parameters**: `farmerId` *(optional)*, `farmId` *(optional)*

---

### 3. Get Recommendation Details by ID
* **Endpoint**: `GET /api/recommendation/:id`

---

## 🎨 Frontend Integration Details

The React frontend page `src/pages/SellStore.tsx` connects directly to `/api/recommendation/generate`:
- Interactive re-triggering via the "Re-Run Decision Engine" button.
- Dynamic decision rendering, confidence metric, profit comparison cards, price forecast chart, and Groq AI explanation.
- **UI Aesthetics**: 100% of existing gold/brand gradients, cards, glassmorphic styling, typography, and theme preserved.
