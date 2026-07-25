# State Management

## Architecture

KrishiMitra uses React Context for state management. No external state library (Redux, Zustand, etc.).

## Context Providers

### AppContext (`src/i18n/AppContext.tsx`)
**Scope:** Global — wraps entire app
- `lang` / `setLang` — current language (en/hi/gu)
- `theme` / `toggleTheme` — light/dark mode
- `user` / `login` / `logout` — auth state
- `t(key)` — translation function
- `loadingUser` — initial auth check

### FarmContext (`src/context/FarmContext.tsx`)
**Scope:** Authenticated users
- `farms` — user's farm list
- `activeFarm` — currently selected farm
- `hasFarm` — onboarding check
- CRUD operations: `createFarm`, `updateFarm`, `deleteFarm`, `selectActiveFarm`

### WeatherContext (`src/context/WeatherContext.tsx`)
**Scope:** Active farm
- `weatherData` — current weather + forecast
- Auto-refreshes every 30 minutes
- Re-fetches on `activeFarm` or `lang` change

### AdvisoryContext (`src/context/AdvisoryContext.tsx`)
**Scope:** Active farm
- `advisoryData` — AI crop advisory
- `refreshAdvisory()` — manual refresh
- Re-fetches on `activeFarm` or `lang` change

## Provider Nesting Order

```tsx
<AppProvider>           // Auth, lang, theme
  <FarmProvider>        // Farm data (needs user)
    <WeatherProvider>   // Weather (needs activeFarm)
      <AdvisoryProvider> // Advisory (needs activeFarm)
        <BrowserRouter>
          {/* Routes */}
        </BrowserRouter>
      </AdvisoryProvider>
    </WeatherProvider>
  </FarmProvider>
</AppProvider>
```

## Custom Hooks

| Hook | Location | Purpose |
|---|---|---|
| `useApp()` | `i18n/AppContext.tsx` | Access lang, user, t(), theme |
| `useFarm()` | `context/FarmContext.tsx` | Access farm data |
| `useWeather()` | `context/WeatherContext.tsx` | Access weather data |
| `useAdvisory()` | `context/AdvisoryContext.tsx` | Access advisory data |
| `useGreeting()` | `hooks/useGreeting.ts` | Time-based greeting |
| `useFarmStatus()` | `hooks/useFarmStatus.ts` | Aggregated status items |

## Caching Strategy

- **localStorage:** User profile, language, theme, farm (for instant load)
- **Context state:** API data (refreshed on mount)
- **Auto-refresh:** Weather every 30 min, advisory on demand
