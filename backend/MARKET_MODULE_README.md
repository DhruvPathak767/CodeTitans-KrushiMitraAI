# KrishiMitra AI - Market Intelligence Module

The **Market Intelligence Module** provides real-time and historical agricultural commodity prices across Indian APMC Mandis, supporting crop filtering, district/state queries, price trend history, and nearby mandi lookups.

---

## 🏗️ Architecture Design (Clean Architecture)

The module follows strict **Clean Architecture (MVC + Service Layer + Repository Pattern)**:

```
backend/src/
├── models/
│   └── MarketPrice.js           # Mongoose Schema & Indexes
├── repositories/
│   └── market.repository.js     # MongoDB Database Queries
├── services/
│   └── market.service.js        # Business Logic & Trend Analysis
├── controllers/
│   └── market.controller.js     # HTTP Request/Response Handler
├── routes/
│   └── market.routes.js         # Express Route Registry
├── scripts/
│   └── seedMarketData.js        # Data Seeder Script
└── data/
    ├── market_prices.json       # Seed Dataset (JSON)
    └── market_prices.csv        # Seed Dataset (CSV)
```

> **Future Live API Readiness**: The Service Layer (`market.service.js`) encapsulates all market data retrieval logic. Transitioning from local JSON/MongoDB dataset to a live **AGMARKNET / eNAM / Government Mandi API** in future releases requires editing **only** `market.service.js`, keeping the controller, routes, and frontend completely unchanged.

---

## 🗄️ Database Schema (`MarketPrices` Collection)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `crop` | String | Yes | Name of the agricultural produce (e.g., Cotton, Wheat) |
| `market` | String | Yes | Name of APMC Mandi (e.g., Rajkot APMC) |
| `district` | String | Yes | District name (e.g., Rajkot) |
| `state` | String | Yes | State name (e.g., Gujarat) |
| `price` | Number | Yes | Price per quintal in INR |
| `unit` | String | Yes | Measurement unit (Default: `Quintal`) |
| `date` | Date | Yes | Price report date |
| `source` | String | No | Data source provider (Default: `AGMARKNET Local`) |
| `createdAt` | Date | Auto | Record creation timestamp |
| `updatedAt` | Date | Auto | Record update timestamp |

**Indexes**:
- Compound Unique Index: `{ crop: 1, market: 1, date: 1 }` (Prevents duplicate price records)

---

## 🚀 Data Seeding Command

To seed/sync local market prices into MongoDB:

```bash
npm run seed:market
```

**Features**:
- Validates records against Mongoose schema rules
- Performs bulk upsert operations to avoid duplicates
- Outputs total records imported into MongoDB

---

## 📡 API Endpoints Reference

### 1. Get Latest Prices
* **Endpoint**: `GET /api/market/prices`
* **Query Parameters**:
  * `crop` *(optional)*: Filter by crop name (e.g., `Cotton`, `Wheat`)
  * `district` *(optional)*: Filter by district (e.g., `Rajkot`)
  * `state` *(optional)*: Filter by state (e.g., `Gujarat`)
  * `sort` *(optional)*: `latest` (default), `price_asc`, `price_desc`, `crop`
  * `limit` *(optional)*: Number of items per page (default: `20`)
  * `search` *(optional)*: Search across crop, mandi, district, and state
* **Example**: `GET http://localhost:5000/api/market/prices?crop=Cotton`

**Response (`200 OK`)**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Market prices fetched successfully",
  "data": [
    {
      "id": "66a267f81b...",
      "crop": "Cotton",
      "market": "Rajkot APMC",
      "district": "Rajkot",
      "state": "Gujarat",
      "price": 7250,
      "unit": "Quintal",
      "date": "2026-07-25",
      "source": "AGMARKNET Local"
    }
  ]
}
```

---

### 2. Get Historical Price Trends
* **Endpoint**: `GET /api/market/history`
* **Query Parameters**:
  * `crop` *(required if market not provided)*: Crop name (e.g., `Potato`)
  * `market` *(optional)*: Mandi name (e.g., `Agra APMC`)
  * `days` *(optional)*: History window in days (default: `30`)
* **Example**: `GET http://localhost:5000/api/market/history?crop=Potato&days=30`

---

### 3. Get Nearby Market Prices
* **Endpoint**: `GET /api/market/nearby`
* **Query Parameters**:
  * `district` *(optional)*: District name (e.g., `Rajkot`)
  * `state` *(optional)*: State name (e.g., `Gujarat`)
  * `crop` *(optional)*: Crop filter (e.g., `Cotton`)
* **Example**: `GET http://localhost:5000/api/market/nearby?district=Rajkot&crop=Cotton`

---

### 4. Get Supported Crops
* **Endpoint**: `GET /api/market/crops`
* **Returns**: Array of distinct crops available in the system.

---

### 5. Get Supported Markets
* **Endpoint**: `GET /api/market/markets`
* **Returns**: Array of supported APMC Mandis along with district and state mappings.

---

## 🎨 Frontend Integration Details

The React frontend page `src/pages/Market.tsx` connects seamlessly to `/api/market/prices` and `/api/market/crops`.
- Real-time search and drop-down crop filtering.
- Automatic fallback snapshot if backend is offline.
- **UI Preservation**: Existing theme, colors, glassmorphism cards, produce banner, typography, and charts remain 100% untouched.
