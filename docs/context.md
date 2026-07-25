# KrishiMitra AI — Project Context

> **Single Source of Truth for AI Coding Assistants**
>
> Read this file first. It explains what this project does, why it exists, and how to contribute.

## What is KrishiMitra AI?

An AI-powered farming companion for Indian smallholder farmers. It helps them detect crop diseases, get weather-based advisory, check market prices, and make sell/store decisions — all in their local language.

## Design Philosophy

> "A Farmer Needs a Guide, Not an Assistant."

The app proactively guides the farmer through daily farming activities. The dashboard answers: **"What should I do today?"**

## User Personas

| Persona | Age | Literacy | Device | Language |
|---|---|---|---|---|
| Ramesh (Gujarat) | 45 | Low digital | Budget Android | Gujarati |
| Priya (Maharashtra) | 35 | Medium digital | Mid-range Android | Hindi |
| Suresh (Punjab) | 55 | Very low digital | Basic smartphone | Hindi |

**Common traits:** Work under sunlight, prefer visual interfaces, need one-tap access, trust simplicity over complexity.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Styling | TailwindCSS (earthy design system) |
| i18n | Custom dictionary-based (en, hi, gu) |
| State | React Context (AppContext, FarmContext, WeatherContext, AdvisoryContext) |
| Backend | Express.js + Mongoose + MongoDB Atlas |
| AI | FastAPI + TensorFlow + YOLOv8 + scikit-learn |
| LLM | Groq (llama-3.3-70b) |
| Weather | WeatherAPI.com |
| Storage | Cloudinary (images) |

## Existing Backend APIs

All endpoints are prefixed with `/api/`:

| Module | Key Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/verify-otp`, `GET /auth/profile` |
| Farm | `GET /farms`, `POST /farms`, `GET /farms/check-status`, `PUT /farms/:id/select-active` |
| Weather | `GET /weather/dashboard` |
| Advisory | `GET /advisory`, `POST /advisory/refresh` |
| Disease | `POST /disease/detect` |
| Market | `GET /market/prices`, `GET /market/price-prediction` |
| SellStore | `POST /recommendation/sell-store` |
| Schemes | `GET /schemes` |
| Chat | `POST /chat/ask` |

## Things That Must NEVER Change

- Backend API contracts (request/response shapes)
- MongoDB schema structures
- Auth flow (JWT access + refresh tokens)
- Python AI model inference pipeline
- i18n key format (dot-notation: `nav.home`, `common.loading`)

## Things That SHOULD Be Improved

- Migrate remaining mock data imports to API calls
- Add TanStack Query for better caching/loading states
- Add proper error boundaries around feature pages
- Improve existing page accessibility (font sizes, touch targets)
- Add unit tests for hooks and utilities

## UX Principles

1. **One Tap Rule** — Every important action reachable in one tap
2. **Progressive Disclosure** — Show only what's needed now
3. **Recognition > Recall** — Use icons, colors, not text-heavy menus
4. **Task-First Design** — Dashboard answers "What to do today?"
5. **Mobile-First** — Design for 375px first, scale up
6. **Accessibility First** — 18px min font, 56px buttons, high contrast

## Engineering Principles

1. **Feature-based folders** — Each feature is self-contained
2. **Zero hardcoded strings** — Everything through `t()` translation function
3. **Zero static data** — Every value from API, context, or user input
4. **API-driven UI** — Skeleton → Data → Error states
5. **DRY** — Reusable components in `components/ui/`
6. **Clean Architecture** — Separate UI, business logic, API layer

## Navigation Structure

```
Bottom Nav (4 tabs):
🏠 Home    → /app/home      (Dashboard + status + 4 action cards)
🌾 My Farm → /app/farm      (Farm management)
📈 Market  → /app/market    (Prices + sell/store)
👤 Profile → /app/profile   (Settings, reports, help, logout)

Feature pages (from Home action cards):
📷 Disease Detection  → /app/disease
🌱 Crop Advisory      → /app/advisory
🌦 Weather            → /app/weather
💧 Irrigation         → /app/irrigation
```

## Current Progress

- [x] Complete backend with all APIs
- [x] Python AI microservice with disease detection + price prediction
- [x] Frontend redesign: bottom nav, earthy design, new dashboard
- [x] i18n: 80+ new keys in en/hi/gu
- [ ] Migrate remaining pages to earthy design system
- [ ] Add TanStack Query
- [ ] Production deployment
