# Testing

## Current State
No automated tests exist yet. This is a known gap.

## Recommended Test Strategy

### Unit Tests (Vitest)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Priority targets:**
1. `useGreeting` hook — deterministic, easy to test
2. `useFarmStatus` hook — aggregation logic
3. `cn()` utility — class merging
4. `constants.ts` — config values
5. i18n `t()` function — fallback behavior

### Component Tests (Testing Library)
**Priority targets:**
1. `<Button />` — variant rendering, disabled state
2. `<Card />` — padding variants, interactive mode
3. `<BottomNav />` — active tab highlighting
4. `<ActionCard />` — click navigation

### Integration Tests
- Auth flow: login → farm check → dashboard
- Disease detection: upload → API → results
- Language switch: change lang → verify UI updates

### E2E Tests (Playwright recommended)
```bash
npm install -D @playwright/test
```

**Critical flows:**
1. Login → Dashboard → Scan Crop → Results
2. Login → Advisory → Refresh → Updated Data
3. Login → Market → Sell/Store → Recommendation
4. Language switch (en → hi → gu)

## Running Tests
```bash
npm test          # Unit + component tests
npm run test:e2e  # E2E tests (requires dev server running)
```
