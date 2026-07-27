# KrishiMitra AI — Project Architecture

## Overview

KrishiMitra AI is a **polyglot, microservice-oriented** full-stack platform composed of three independent, cooperating services:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KRISHIMITRA AI SYSTEM                        │
├────────────────┬──────────────────────┬─────────────────────────────┤
│   React PWA    │  Node.js Backend     │  Python FastAPI AI Service  │
│   Port: 5173   │  Port: 5000          │  Port: 8000                 │
│   TypeScript   │  Express 5 + Mongoose│  FastAPI + TensorFlow       │
└────────────────┴──────────────────────┴─────────────────────────────┘
         │                  │                          │
         └──────────────────┴──────────────────────────┘
                                    │
         ┌─────────────────────────────────────────────┐
         │              External Services              │
         │  WeatherAPI | Groq Cloud | data.gov.in      │
         │  Cloudinary | OpenStreetMap | Gmail SMTP    │
         └─────────────────────────────────────────────┘
                                    │
         ┌─────────────────────────────────────────────┐
         │         MongoDB (Local or Atlas)            │
         │  20+ Collections | GeoJSON Indexes          │
         └─────────────────────────────────────────────┘
```

---

## Architectural Principles

| Principle | Implementation |
|-----------|----------------|
| **Separation of Concerns** | Controllers delegate to Services, Services use Repositories |
| **Repository Pattern** | All DB access isolated in `repositories/` layer |
| **Service Layer** | Business logic lives exclusively in `services/` |
| **Multi-language First** | Every AI prompt and response handles en/hi/gu |
| **Fail-Safe Design** | Groq failures fall back to rule-based decisions |
| **Telemetry-Driven Notifications** | Notifications generated automatically from live weather data |
| **Singleton ML Models** | Python AI models loaded once on startup, reused for all requests |

---

## Layer Architecture (Backend)

```
HTTP Request
    │
    ▼
┌────────────────────────────────────────────┐
│  Express Middleware Stack                   │
│  helmet → cors → json → cookie → morgan    │
└────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│  Route Layer (routes/*.routes.js)           │
│  auth | farm | weather | advisory |        │
│  disease | irrigation | market | chat |    │
│  notification | recommendation | upload    │
└────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│  Middleware Guards                          │
│  authenticate | validate | uploadSingle    │
└────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│  Controller Layer (controllers/*/)          │
│  Parses request, calls service, sends JSON │
└────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│  Service Layer (services/*/)               │
│  Business logic, AI calls, external APIs  │
└────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│  Repository Layer (repositories/*/)        │
│  Mongoose queries, DB abstraction          │
└────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│  Model Layer (models/*.js)                  │
│  Mongoose schemas, indexes, enums          │
└────────────────────────────────────────────┘
    │
    ▼
    MongoDB
```

---

## Frontend Architecture

```
src/
├── main.tsx              ← React 18 createRoot entry
├── App.tsx               ← BrowserRouter + Context providers + Route tree
│
├── Context Providers (wrapping all routes)
│   ├── AppProvider       ← Auth, language, theme, user state
│   ├── FarmProvider      ← Active farm, farm list, onboarding state
│   ├── WeatherProvider   ← Weather data cache
│   └── AdvisoryProvider  ← Advisory data cache
│
├── Route Guards
│   ├── ProtectedRoutes   ← Redirects to /login if !user
│   ├── OnboardingRouteGuard ← Redirects to /login if !user
│   └── MandatoryFarmGuard   ← Redirects to /onboarding/farm if !hasFarm
│
├── Pages (route-level components)
│   └── [16 page components — each corresponds to 1 route]
│
├── Features (domain feature modules)
│   ├── home/             ← Dashboard widgets
│   └── profile/          ← User profile management
│
├── Components (reusable)
│   ├── layout/           ← AppShell, TopBar, BottomNav, PageHeader
│   └── ui/               ← Atomic: Button, Card, Badge, Skeleton, etc.
│
├── API Layer (api/*.ts)
│   └── Axios wrappers per domain (auth, farm, weather, etc.)
│
├── Services (services/*.ts)
│   └── geocoding.ts      ← OpenStreetMap client
│
└── i18n/
    ├── AppContext.tsx     ← Global app state + language
    └── dictionaries.ts   ← 74KB translation dictionary
```

---

## Python AI Microservice Architecture

```
FastAPI App (main.py)
    │
    ├── Lifespan startup → model_loader_singleton.load_model()
    │     ├── YOLOv8 model loaded (yolov8n.pt)
    │     ├── TensorFlow CNN model loaded
    │     ├── OOD Detector initialized
    │     └── Random Forest model loaded (random_forest.joblib)
    │
    ├── Router: /predict  (Disease Detection)
    │     └── prediction_service.py
    │           ├── image_processor.py   ← Download + preprocess image
    │           ├── leaf_detector.py     ← YOLOv8 leaf bounding box
    │           ├── ood_detector.py      ← Reject non-plant images
    │           ├── crop_classifier.py   ← Verify crop type matches
    │           └── disease_classifier.py ← TensorFlow CNN inference
    │
    └── Router: /price-prediction
          └── price_prediction_service.py
                ├── feature_engineering.py ← Feature extraction
                └── models/random_forest.joblib ← Prediction
```

---

## Data Flow: Full Request Cycle (Crop Advisory)

```
1. Browser: GET /api/advisory
   ↓
2. Backend auth.middleware.js: Verifies JWT → attaches user to req
   ↓
3. advisory.controller.js: Calls advisoryService.getLatestAdvisory(user, false, lang)
   ↓
4. advisory.service.js:
   a. Resolve active farm from DB (farmRepository)
   b. Call weatherService.getWeatherForActiveFarm(user, lang)
      → WeatherAPI.com REST call with farm GPS coordinates
      → evaluateAgricultureRules(weather, lang)
   c. calculateGrowthStage(farm.sowingDate)
   d. groqService.generateCropAdvisory({farm, weather, agriculture, growthStage}, lang)
      → Groq Cloud API call (LLaMA-3.3-70b)
      → JSON response with full advisory
   e. Save Advisory document to MongoDB
   ↓
5. Controller sends 200 JSON response to frontend
   ↓
6. Frontend Advisory.tsx renders AI advisory with Framer Motion
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                    │
├─────────────────────────────────────────────────────┤
│  1. Helmet        → Security HTTP headers           │
│  2. CORS          → Cross-origin request control    │
│  3. express-validator → Input sanitization          │
│  4. JWT           → Stateless auth (access token)   │
│  5. Refresh Token → Persistent sessions (httpOnly)  │
│  6. bcrypt(10)    → Password hashing                │
│  7. OTP Email     → Email verification              │
│  8. Multer        → File type + size validation     │
│  9. Cloudinary    → Secure image CDN                │
│  10. .env secrets → Never committed to git          │
└─────────────────────────────────────────────────────┘
```

---

## Background Jobs

| Job | Schedule | File |
|-----|----------|------|
| APMC Mandi Price Sync | Every 6 hours (`node-cron`) | `scripts/mandiCron.js` |
| Initial sync on startup | Once on server start | `scripts/mandiCron.js` |

---

## MongoDB Collection Summary

| Collection | Purpose | Key Indexes |
|------------|---------|-------------|
| `users` | User accounts | `email` (unique), `phone` (unique) |
| `farms` | Farm registrations | `location` (2dsphere), `userId+createdAt` |
| `advisories` | AI crop advisories | `userId`, `farmId` |
| `weathercaches` | Weather cache | TTL |
| `chathistories` | AI chat sessions | `userId` |
| `chatmessages` | Individual messages | `historyId` |
| `diseasereports` | Disease detection results | `userId`, `farmId` |
| `notifications` | System notifications | `userId+createdAt`, `userId+read` |
| `marketprices` | APMC mandi prices | `commodity`, `state`, `district` |
| `markettrends` | Price trend analysis | `commodity` |
| `pricepredictions` | ML price forecasts | `userId`, `crop` |
| `recommendations` | AI sell/store decisions | `userId` |
| `sellrecommendations` | Sell recommendations | `userId` |
| `irrigationcaches` | Irrigation plan cache | `userId+farmId` |
| `uploads` | Cloudinary upload records | `userId` |
| `analytics` | Usage analytics | `userId` |
| `modelmetadatas` | ML model version info | `modelType` |
| `spoilagepredictions` | Crop spoilage predictions | `userId` |

---

## API Gateway Pattern

The Node.js backend acts as an **API Gateway** for the Python AI microservice:

```
Frontend → Node.js Backend (Port 5000) → Python FastAPI (Port 8000)
                                                │
                                         ┌──────────────┐
                                         │ TensorFlow   │
                                         │ YOLOv8       │
                                         │ Random Forest│
                                         └──────────────┘
```

The backend:
1. Authenticates the user (JWT verification)
2. Retrieves the Cloudinary image URL from the request
3. Forwards the request to Python FastAPI via `axios.post(PYTHON_AI_URL/predict)`
4. Stores the AI result in MongoDB
5. Returns the formatted response to the frontend

This design keeps the ML serving infrastructure completely decoupled from the Node.js business logic layer.

---

*KrishiMitra AI — Architecture by Team CodeTitans*
