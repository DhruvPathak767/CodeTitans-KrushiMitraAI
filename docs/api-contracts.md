# API Contracts

See [backend-integration.md](./backend-integration.md) for full endpoint documentation.

## Type Interfaces

### Auth
```typescript
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  language: string;
  activeFarm?: string;
}
```

### Farm
```typescript
interface FarmData {
  _id: string;
  farmName: string;
  cropName: string;
  area: number;
  soilType: string;
  irrigationSource: string;
  location: { type: 'Point'; coordinates: [number, number] };
  address: {
    formattedAddress: string;
    village: string; taluka: string;
    district: string; state: string;
    accuracy?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Weather
```typescript
interface WeatherApiResponse {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
    cloudCoverage: number;
    weatherCondition: string;
  };
  location: {
    farmName: string;
    weatherLocationName: string;
  };
  forecast?: Array<{ date: string; maxTemp: number; minTemp: number; rainProb: number }>;
}
```

### Advisory
```typescript
interface AdvisoryResponse {
  advisory: {
    priority: string;
    irrigation: { status: string };
    diseaseRisk: { level: string; reason: string };
    sprayWindow: { bestTime: string };
    nextAction: string;
    warning?: string;
    cropHealthScore: number;
    estimatedYieldImpact: string;
    estimatedWaterSaving: string;
    estimatedCostSaving: string;
  };
  growthStage: string;
  lastUpdated: string;
}
```

## Error Response
```typescript
interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}
```

## Loading / Error / Empty Pattern

Every API-consuming component must handle:
1. **Loading** → `<Skeleton />` or `<CardSkeleton />`
2. **Error** → `<ErrorState title={t('state.error')} onRetry={refetch} retryLabel={t('state.retry')} />`
3. **Empty** → `<EmptyState icon={...} title={t('state.noData')} description={...} />`
4. **Success** → Render data
