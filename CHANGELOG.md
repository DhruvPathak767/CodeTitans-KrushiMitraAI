# Changelog

All notable changes to **KrishiMitra AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-07-28

### 🎉 Initial Release — Hackathon Submission

This is the first full release of KrishiMitra AI, built by **Team CodeTitans** for the hackathon submission.

---

### ✨ Added — Authentication & User Management

- Email + OTP registration flow with SMTP email delivery via Nodemailer
- JWT access token + refresh token dual-token authentication strategy
- Forgot password / reset password via email with secure token
- User profile management with Cloudinary profile image upload
- Role-based access control (`FARMER`, `SUPER_ADMIN`)
- Super admin auto-seeder on first server startup
- Language preference stored per user account (`en`, `hi`, `gu`)

---

### ✨ Added — Farm Registration & Location

- Multi-farm registration per user account
- GPS-based farm location capture in frontend
- GeoJSON `Point` location stored in MongoDB with 2dsphere index
- Reverse geocoding via OpenStreetMap Nominatim API
- Location search endpoint for India
- Active farm selection with one-click switching
- Farm attributes: name, crop, soil type, area (ACRE/HECTARE), sowing date, irrigation type
- Mandatory farm onboarding guard — routes to `/onboarding/farm` before app access

---

### ✨ Added — Weather Intelligence Module

- Live WeatherAPI 7-day forecast with AQI and weather alerts
- Hourly and daily forecast data formatting
- Air quality index: PM2.5, PM10, AQI status levels
- Weather-driven automatic notification creation
- Agriculture Rule Engine (`agricultureRuleEngine.js`) with 6 agronomic threshold rules:
  - Disease risk assessment
  - Heat stress detection
  - Chemical spray window evaluation
  - Irrigation advice generation
  - Crop comfort index
  - Field work recommendation
- All agriculture messages fully translated (en/hi/gu) via `i18n.util.js`
- Debug weather endpoint (`GET /weather/debug`) without authentication for testing
- Winston-logged coordinate verification between farm DB and WeatherAPI call

---

### ✨ Added — AI Crop Advisory (Groq LLaMA-3.3-70b)

- Groq Cloud integration with LLaMA-3.3-70b-versatile model
- Crop advisory prompt: injects farm context + live weather telemetry + agriculture rules
- Automatic crop growth stage calculation from sowing date (Seedling → Harvest Readiness)
- Multi-language advisory output enforced via prompt instruction
- Advisory history stored in MongoDB `Advisory` collection
- Force-refresh advisory endpoint

---

### ✨ Added — Smart Irrigation Engine

- `IrrigationEngineService` (554-line irrigation computation engine)
- Crop-specific water demand based on growth stage (Seedling: 1.2x, Vegetative: 1.0x, Flowering: 1.5x)
- Supports 12 crop types: Wheat, Cotton, Rice, Paddy, Maize, Tomato, Potato, Sugarcane, Soybean, Groundnut, Mustard, Onion
- Weather-adjusted irrigation recommendations
- `IrrigationCache` MongoDB collection for caching computed plans
- Irrigation history endpoint

---

### ✨ Added — AI Disease Detection (Python FastAPI + YOLOv8 + TensorFlow)

- Python FastAPI microservice running on port 8000
- Multi-stage inference pipeline:
  1. YOLOv8 (`yolov8n.pt`) — leaf detection in uploaded image
  2. OOD (Out-of-Distribution) detector — rejects non-plant images
  3. TensorFlow CNN classifier — disease classification with confidence score
- `DiseaseReport` MongoDB model stores full AI result + Cloudinary image URL
- Disease history with per-report retrieval and deletion
- Full disease history bulk clear endpoint
- Propagates Python validation errors (crop mismatch, OOD rejection) to frontend
- Cloudinary integration for image storage before inference

---

### ✨ Added — Market Intelligence (data.gov.in APMC)

- `MandiSyncService` fetching live APMC prices from data.gov.in OGD API
- Background `node-cron` sync job every 6 hours via `mandiCron.js`
- `MarketPrice` and `MarketTrend` MongoDB collections
- Endpoints: latest prices, price history, nearby markets, crops list, markets list
- Manual sync trigger endpoint (`POST /market/sync`)
- Market data seeder script: `npm run seed:market`
- Postman collections for testing market, price prediction, and recommendation APIs

---

### ✨ Added — AI Sell/Store Recommendation (Groq LLaMA-3.3-70b)

- `GroqPromptService` for generating AI sell/store decisions
- Decision types: `STORE`, `SELL_NOW`, `SELL_PARTIALLY`, `IMMEDIATE_SALE_DISEASE`, `IMMEDIATE_SALE_WEATHER`
- Inputs: crop, quantity, current mandi price, 15-day price forecast, weather context, disease severity, storage availability/cost
- Rule engine pre-evaluation with override guards
- Risk level: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Confidence score (50–100%) and estimated profit percentage
- Fallback rule-based decision when Groq API unavailable
- `SellRecommendation` and `Recommendation` MongoDB models
- Recommendation history and per-recommendation retrieval

---

### ✨ Added — Price Prediction (Python Random Forest)

- Random Forest model (`random_forest.joblib`) for crop price forecasting
- Python FastAPI router at `/price-prediction`
- `PricePrediction` MongoDB model with history
- Frontend `SellStore` page integrating price prediction + AI recommendation

---

### ✨ Added — Notification System

- `NotificationService` with telemetry-driven automatic notification creation
- Notification types: rain, disease, heat, harvest, irrigation, spray, ai, scheme, market, system, weather
- Priority levels: critical, high, medium, low
- Multi-language notification content (English/Hindi/Gujarati)
- Notification bell component with unread count badge
- Mark single / mark all as read endpoints
- Delete notification endpoint
- Indexed by userId + createdAt and userId + read for query performance

---

### ✨ Added — AI Chatbot (Groq LLaMA-3.3-70b)

- Conversational AI chat using Groq LLaMA-3.3-70b
- Farm context + weather automatically injected as system prompt context
- `ChatHistory` MongoDB collection for session persistence
- Clear chat history endpoint
- Floating assistant UI with animation
- `react-markdown` for rendering AI markdown responses

---

### ✨ Added — File Upload & Cloudinary CDN

- Multer middleware for multipart form data parsing
- Cloudinary SDK integration for image upload and deletion
- `Upload` MongoDB model tracking all uploads
- Public ID-based image deletion

---

### ✨ Added — Localization (i18n)

- Frontend: `dictionaries.ts` (74 KB) with comprehensive en/hi/gu translation keys
- Frontend: `AppContext.tsx` managing language state, persisted in `localStorage`
- Backend: `i18n.util.js` with weather + agronomy message translations
- Language synced between frontend and user's MongoDB document
- All AI prompts include explicit language instruction for multi-language output

---

### ✨ Added — Frontend UI/UX

- React 18 + TypeScript + Vite + TailwindCSS v3 progressive web app
- Framer Motion animations for page transitions and micro-interactions
- Recharts interactive charts for weather, market, and irrigation data
- React-Leaflet interactive maps for farm location
- Three.js 3D background effects on landing page
- Lucide React icon set throughout
- Dark/Light theme toggle with persistence
- Mobile-first bottom navigation bar
- Page-level lazy loading
- canvas-confetti on successful farm registration
- Cursor spotlight effect on landing page
- `jsPDF` + `jspdf-autotable` PDF report generation

---

### ✨ Added — Backend Infrastructure

- Express 5.2.1 with ESM module syntax (`import`/`export`)
- Helmet security headers
- Winston + Morgan structured logging
- Global error middleware with `ApiError` class
- 404 not-found middleware
- express-validator input validation on auth and farm routes
- Repository pattern between services and MongoDB
- Mongoose 9.8.0 with connection pooling
- nodemon in development mode

---

### 📁 Added — Documentation

- `docs/` directory with 25 internal documentation files covering:
  - Architecture, routing, state management, API contracts
  - Design system, animations, accessibility
  - i18n guide, security, performance, testing, deployment
  - Known issues, roadmap, contributing guide
- `backend/MARKET_MODULE_README.md`
- `backend/PRICE_PREDICTION_MODULE_README.md`
- `backend/RECOMMENDATION_MODULE_README.md`
- `frontend/FRONTEND_SYSTEM_OVERVIEW.md`
- Postman collections for backend API testing

---

[1.0.0]: https://github.com/CodeTitans/KrishiMitra-AI/releases/tag/v1.0.0
