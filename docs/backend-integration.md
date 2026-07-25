# Backend Integration

## API Base URL

Development: `http://localhost:5000/api` (proxied via Vite at `/api`)

## Authentication

| Header | Value |
|---|---|
| `Authorization` | `Bearer <access_token>` |
| `Accept-Language` | `en` / `hi` / `gu` |
| `Content-Type` | `application/json` |

### Token Flow
1. Login → Returns `accessToken` + `refreshToken`
2. Store in `localStorage` (`km_access_token`, `km_refresh_token`)
3. Axios interceptor attaches `Authorization` header
4. On 401 → Auto-refresh via `/api/auth/refresh-token`
5. On refresh fail → Clear tokens, redirect to `/login`

## Key Endpoints

### Auth
```
POST /api/auth/register     { name, email, phone, password }
POST /api/auth/login         { email, password }
POST /api/auth/verify-otp    { email, otp }
GET  /api/auth/profile       → { user }
POST /api/auth/refresh-token { refreshToken }
POST /api/auth/logout
```

### Farms
```
GET  /api/farms                    → { farms[], total, page, totalPages }
POST /api/farms                    { farmName, cropName, area, location, address }
GET  /api/farms/check-status       → { hasFarm, farmCount, activeFarm }
PUT  /api/farms/:id/select-active  → { activeFarm }
```

### Weather
```
GET /api/weather/dashboard?lang=en → { current, location, forecast[] }
```

### Advisory
```
GET  /api/advisory?lang=en         → { advisory, growthStage, lastUpdated }
POST /api/advisory/refresh?lang=en → { advisory, growthStage }
```

### Disease Detection
```
POST /api/disease/detect   { image (multipart) } → { crop, disease, confidence, treatment }
```

### Market
```
GET /api/market/prices?crop=Cotton        → { prices[] }
GET /api/market/price-prediction?crop=... → { predictions[] }
```

### Sell/Store Recommendation
```
POST /api/recommendation/sell-store { farmId } → { recommendation, confidence, reason, actions }
```

## Error Handling

All APIs return:
```json
{ "success": false, "message": "Error description" }
```

Frontend should:
1. Show `<ErrorState />` with retry button
2. Log error to console
3. Never show raw error messages to farmers

## Loading States

Every API call should show `<Skeleton />` or `<CardSkeleton />` while loading.
Never show empty white space.
