# KrishiMitra AI — Complete Frontend Redesign

> **Philosophy**: "A Farmer Needs a Guide, Not an Assistant."
> **Goal**: Transform from an ERP admin panel to "Google Maps for Farming."

## User Review Required

> [!IMPORTANT]
> This is a massive refactor touching ~40+ files across the frontend. The backend remains completely untouched. Every existing API endpoint, context provider, and backend integration is preserved. I want your approval before executing.

> [!WARNING]
> **Breaking UI Changes**: The sidebar navigation is replaced by bottom navigation. All existing routes still work, but the navigation paradigm shifts fundamentally. Users familiar with the current UI will see a completely different layout.

> [!CAUTION]
> **Mock Data Elimination**: The current `data/mock.ts` and `data/ai.ts` files contain hardcoded data used directly in Dashboard charts (yieldTrend, monthlyIncome) and the FloatingAssistant (AI responses). These will be replaced with API-driven components with proper loading/error/empty states. Some dashboard sections that currently display static charts will show empty states until backend data is available.

## Open Questions

> [!IMPORTANT]
> **Q1**: The current `data/ai.ts` file contains a local `generateAIResponse()` function used by the FloatingAssistant chatbot. The spec says to replace the AI Assistant with "Krishi Guide" — a proactive guided workflow (NOT a chatbot). Should I completely remove the chatbot page (`Chatbot.tsx`) and its API integration (`api/chat.ts`), or keep the page accessible from a secondary location (e.g., Profile → Help)?

> [!IMPORTANT]
> **Q2**: The existing i18n dictionary has ~300 keys across `en`, `hi`, `gu`. The new design introduces ~80 new keys (for bottom nav, guided workflow steps, farm status messages, etc.). Should I add these keys directly to the existing `dictionaries.ts` file, or split into a modular system (e.g., `i18n/en/home.ts`, `i18n/en/market.ts`)?

> [!IMPORTANT]
> **Q3**: The spec requires TanStack Query (React Query). The project currently uses plain `useEffect` + `useState` in Context providers. Should I migrate ALL data fetching to TanStack Query (including WeatherContext, AdvisoryContext, FarmContext), or only apply it to new components while keeping existing contexts intact?

---

## Proposed Changes

### Phase 1: Foundation — New Design System & Folder Structure

---

#### [NEW] `src/design-system/` — Design Token System

New earthy, farmer-friendly design tokens replacing the current glassmorphism/futuristic aesthetic:

| Token | Current | New |
|---|---|---|
| Primary | `#22c55e` (bright green) | `#2D6A4F` (deep forest green) |
| Secondary | `#3b82f6` (blue) | `#8B5E3C` (warm brown) |
| Background | `#07090e` (dark slate) | `#FEFCF3` (warm cream) |
| Cards | Glass blur + borders | Solid white + soft shadow |
| Radius | `rounded-3xl` (24px) | `rounded-2xl` (16px) |
| Min font | 11-12px | 18px |
| Min button height | ~36px | 56px |

##### [NEW] `src/design-system/tokens.ts`
Color palette, spacing, typography, shadow tokens.

##### [NEW] `src/design-system/colors.ts`
Earthy color palette: green, brown, cream, beige, blue (weather only).

---

#### [NEW] Feature-Based Folder Structure

Reorganize from flat structure to feature-based:

```
src/
├── app/                          # App shell, routing, providers
│   ├── App.tsx                   # [MODIFY] — Simplified routing
│   ├── main.tsx                  # [KEEP]
│   └── providers/                # [NEW] — All context providers
│       ├── AppProvider.tsx
│       ├── FarmProvider.tsx
│       ├── WeatherProvider.tsx
│       └── AdvisoryProvider.tsx
│
├── components/                   # Shared reusable components
│   ├── ui/                       # [NEW] — Primitive design system
│   │   ├── Button.tsx            # 56px min-height, large touch targets
│   │   ├── Card.tsx              # Earthy card with soft shadow
│   │   ├── Input.tsx             # 18px+ font, large padding
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   ├── layout/                   # [NEW] — Layout components
│   │   ├── AppShell.tsx          # New shell (top bar + bottom nav + content)
│   │   ├── BottomNav.tsx         # [NEW] — 4-tab bottom navigation
│   │   ├── TopBar.tsx            # [NEW] — Minimal: greeting + bell + lang
│   │   └── PageContainer.tsx     # [NEW] — Consistent page wrapper
│   ├── farm-status/              # [NEW] — Farm status hero widgets
│   │   ├── FarmStatusHero.tsx    # Dynamic status cards
│   │   └── StatusCard.tsx        # Individual status item
│   └── krishi-guide/             # [NEW] — Replaces AI Assistant
│       ├── KrishiGuide.tsx       # Guided workflow component
│       └── GuideStep.tsx         # Individual step card
│
├── features/                     # Feature modules (self-contained)
│   ├── home/                     # [NEW] — New dashboard/home
│   │   ├── HomePage.tsx          # Hero + 4 actions + tasks + alerts
│   │   ├── ActionCard.tsx        # Primary action card (disease, advisory, etc.)
│   │   ├── TodaysTasks.tsx       # Task checklist
│   │   └── RecentAlerts.tsx      # Alert feed
│   ├── farm/                     # Farm management feature
│   │   ├── FarmPage.tsx          # [MODIFY from FarmRegistration.tsx]
│   │   └── FarmCard.tsx
│   ├── market/                   # Market intelligence feature
│   │   ├── MarketPage.tsx        # [MODIFY from Market.tsx]
│   │   ├── PriceTicker.tsx
│   │   └── SellStoreWidget.tsx   # Sell/Store merged into Market
│   ├── profile/                  # [NEW] — Profile feature
│   │   ├── ProfilePage.tsx       # Settings, language, reports, history
│   │   └── SettingsSection.tsx
│   ├── disease/                  # Disease detection feature
│   │   └── DiseasePage.tsx       # [MODIFY from DiseaseDetection.tsx]
│   ├── weather/                  # Weather feature
│   │   └── WeatherPage.tsx       # [MODIFY from Weather.tsx]
│   ├── advisory/                 # Crop advisory feature
│   │   └── AdvisoryPage.tsx      # [MODIFY from Advisory.tsx]
│   ├── irrigation/               # Irrigation feature
│   │   └── IrrigationPage.tsx    # [MODIFY from Irrigation.tsx]
│   ├── schemes/                  # Gov schemes feature
│   │   └── SchemesPage.tsx       # [MODIFY from Schemes.tsx]
│   └── auth/                     # Auth feature
│       ├── LoginPage.tsx         # [MODIFY from Login.tsx]
│       ├── OnboardingPage.tsx    # [MODIFY from OnboardingFarm.tsx]
│       └── LandingPage.tsx       # [MODIFY from Landing.tsx]
│
├── api/                          # [KEEP] — API layer (unchanged)
├── hooks/                        # [NEW] — Shared custom hooks
│   ├── useTranslation.ts         # Wrapper around t() for type safety
│   ├── useGreeting.ts            # Time-based greeting
│   └── useFarmStatus.ts         # Aggregates weather + advisory + disease status
│
├── i18n/                         # [MODIFY] — Enhanced i18n
│   ├── AppContext.tsx            # [KEEP] — Core app context
│   └── dictionaries.ts          # [MODIFY] — Add ~80 new translation keys
│
├── lib/                          # [NEW] — Utilities
│   ├── cn.ts                     # Class name utility (extracted from ui.tsx)
│   └── constants.ts              # App-wide constants
│
└── types/                        # [KEEP] — Type definitions
```

---

### Phase 2: Navigation Overhaul

---

#### [DELETE] `src/components/Sidebar.tsx`
The entire sidebar navigation is removed.

#### [DELETE] `src/components/FutureBackground.tsx`
The animated particle background is removed — farmers need clean, fast UI.

#### [DELETE] `src/components/CursorSpotlight.tsx`
Desktop cursor effects removed for performance.

#### [MODIFY] `src/components/FloatingAssistant.tsx` → `src/components/krishi-guide/KrishiGuide.tsx`
The floating AI chatbot is replaced with a proactive Krishi Guide that shows guided steps, not a chat interface.

#### [NEW] `src/components/layout/BottomNav.tsx`
4-tab mobile-first bottom navigation:

```
🏠 Home    🌾 My Farm    📈 Market    👤 Profile
```

- 56px+ height
- Active tab indicator
- Haptic feedback pattern
- Framer Motion animations
- All labels use `t()` translation keys
- WCAG AA contrast
- Desktop: transforms to minimal top/side rail

#### [NEW] `src/components/layout/TopBar.tsx`
Minimal header:
- Left: Greeting (`t('greeting.morning')` + user name)
- Right: Notification bell + Language switcher
- No hamburger menu, no search bar, no weather pill

#### [NEW] `src/components/layout/AppShell.tsx`
New layout replacing `AppLayout.tsx`:
- TopBar at top
- Scrollable main content
- BottomNav fixed at bottom
- No sidebar
- `padding-bottom: 80px` to account for bottom nav

---

### Phase 3: New Dashboard (Home Page)

---

#### [NEW] `src/features/home/HomePage.tsx`

The centerpiece of the redesign. Answers: **"What should I do today?"**

**Section 1 — Greeting + Farm Status Hero**
```
Good Morning, Ramesh 👋
Today's Farm Status

🌦 Rain expected today          (from WeatherContext)
💧 Irrigation not recommended   (from AdvisoryContext)
🌱 Fertilizer due tomorrow      (from AdvisoryContext)
⚠ Disease detected yesterday    (from disease API history)
📈 Cotton price increased        (from market API)
```
All values are API-driven. If unavailable → skeleton loader.

**Section 2 — 4 Primary Action Cards**

| Card | Icon | CTA | Route |
|---|---|---|---|
| Disease Detection | 📷 | `t('home.scanCrop')` | `/app/disease` |
| Crop Advisory | 🌱 | `t('home.viewAdvisory')` | `/app/advisory` |
| Weather | 🌦 | `t('home.viewWeather')` | `/app/weather` |
| Irrigation | 💧 | `t('home.checkWater')` | `/app/irrigation` |

Cards: 180px min-height, rounded-2xl, earthy shadow, 18px+ text, 56px CTA button.

**Section 3 — Today's Tasks (from Advisory API)**
- Checklist derived from `advisoryData.nextAction` + irrigation status
- Progress bar

**Section 4 — Market Intelligence (from Market API)**
- Today's mandi prices
- Price trend
- Quick sell recommendation

**Section 5 — Government Schemes (from Schemes page)**
- Only relevant schemes
- 1-2 cards max

**Section 6 — Recent Alerts**
- Weather alerts
- Disease alerts
- Market alerts

#### [NEW] `src/features/home/ActionCard.tsx`
Reusable primary action card with:
- Large Lucide icon (48px)
- Title (20px font)
- Description (16px)
- CTA button (56px height, full-width)
- Framer Motion entrance animation
- All text via `t()` keys

---

### Phase 4: Profile Page (New)

---

#### [NEW] `src/features/profile/ProfilePage.tsx`
Consolidates:
- User profile info
- Language switcher (prominent)
- Theme toggle
- Farm history / reports (from Reports.tsx)
- Notification preferences
- Logout
- App version info

Accessible from bottom nav "👤 Profile" tab.

---

### Phase 5: Route Restructuring

---

#### [MODIFY] `src/app/App.tsx`

New route structure:

```tsx
// Public
/                    → LandingPage
/login               → LoginPage
/signup               → SignupPage

// Onboarding
/onboarding/farm      → OnboardingPage

// Main app (behind auth + farm guard)
/app/home             → HomePage (NEW — replaces Dashboard)
/app/farm             → FarmPage
/app/market           → MarketPage (includes SellStore widget)
/app/profile          → ProfilePage (NEW — includes Reports, Settings)

// Feature pages (accessible from Home action cards)
/app/disease          → DiseasePage
/app/advisory         → AdvisoryPage
/app/weather          → WeatherPage
/app/irrigation       → IrrigationPage
/app/schemes          → SchemesPage
/app/sellstore        → SellStorePage (kept, accessible from Market)

// Removed from main nav (still accessible)
/app/chatbot          → Chatbot (accessible from Profile → Help)
/app/planner          → Merged into HomePage "Today's Tasks"
/app/reports          → Merged into ProfilePage
/app/notifications    → Top-right bell icon opens notification panel
```

---

### Phase 6: i18n Enhancement

---

#### [MODIFY] `src/i18n/dictionaries.ts`

Add ~80 new translation keys across `en`, `hi`, `gu`:

```ts
// Bottom nav
'bottomNav.home': 'Home',
'bottomNav.farm': 'My Farm', 
'bottomNav.market': 'Market',
'bottomNav.profile': 'Profile',

// Farm status hero
'farmStatus.rainExpected': 'Rain expected today',
'farmStatus.irrigationNotNeeded': 'Irrigation not recommended',
'farmStatus.fertilizerDue': 'Fertilizer due tomorrow',
'farmStatus.diseaseDetected': 'Disease detected yesterday',
'farmStatus.priceIncreased': '{crop} price increased',

// Home action cards
'home.scanCrop': 'Scan Crop',
'home.viewAdvisory': 'View Advisory',
'home.viewWeather': 'View Weather',
'home.checkWater': 'Check Water Need',
'home.diseaseScan.desc': 'Scan crop leaf for disease',
'home.advisory.desc': 'Know what to do today',
'home.weather.desc': 'Weather forecast',
'home.irrigation.desc': 'Check irrigation need',

// Krishi Guide
'guide.title': "Today's Guidance",
'guide.step': 'Step {num}',

// Today's tasks
'tasks.today': "Today's Tasks",
'tasks.captureImage': 'Capture crop image',
'tasks.applyFertilizer': 'Apply fertilizer',
'tasks.skipIrrigation': 'Skip irrigation',
'tasks.checkMarket': 'Check market',

// Greetings
'greeting.morning': 'Good Morning',
'greeting.afternoon': 'Good Afternoon', 
'greeting.evening': 'Good Evening',

// States
'state.loading': 'Loading...',
'state.retry': 'Retry',
'state.noData': 'No data available',
'state.error': 'Something went wrong',
// ... and more
```

Every Hindi and Gujarati translation will be provided.

---

### Phase 7: Accessibility & Responsive Design

---

#### [MODIFY] `src/index.css`
- Base font size: 18px minimum
- All buttons: min-height 56px, min touch target 48x48px
- High-contrast earthy palette
- Remove glassmorphism classes (glass, glass-strong, glass-future)
- Add new earthy utility classes
- Sunlight-readable contrast ratios (WCAG AAA)

#### [MODIFY] `tailwind.config.js`
- Update color palette to earthy tones
- Increase base spacing
- Add larger font size defaults
- Update shadow system (soft, earthy shadows)

---

### Phase 8: Mock Data Elimination

---

#### [DELETE] `src/data/mock.ts`
Remove all static/mock data.

#### [DELETE] `src/data/ai.ts`
Remove local AI response generator.

All dashboard data flows through:
- `WeatherContext` → Weather API
- `AdvisoryContext` → Advisory API
- `FarmContext` → Farm API
- Direct API calls for market, disease history, notifications

Components show proper `<Skeleton />`, `<EmptyState />`, or `<ErrorState />` when data is unavailable.

---

### Phase 9: Documentation

---

#### [NEW] `docs/` — 21 Markdown files

All files as specified in requirements:
- `architecture.md` — System architecture with Mermaid diagrams
- `context.md` — AI-first project context (single source of truth)
- `frontend-guide.md` — Folder structure, naming, patterns
- `backend-integration.md` — API contracts, auth flow
- `ui-ux-guidelines.md` — Earthy design system, farmer-first UX
- `component-library.md` — Every reusable component documented
- `api-contracts.md` — Request/response formats
- `state-management.md` — Context + hooks patterns
- `routing.md` — Route map + guards
- `folder-structure.md` — Feature-based structure rationale
- `coding-standards.md` — TypeScript, React, naming
- `i18n-guide.md` — Translation key patterns
- `performance.md` — Lazy loading, code splitting
- `accessibility.md` — WCAG, touch targets, contrast
- `animations.md` — Framer Motion guidelines
- `design-system.md` — Tokens, colors, typography
- `environment.md` — Env vars, setup
- `deployment.md` — Build, CI/CD
- `contributing.md` — PR workflow
- `known-issues.md` — Technical debt
- `roadmap.md` — Future features

---

## Verification Plan

### Automated Tests
```bash
# Type checking
cd frontend && npx tsc --noEmit

# Lint
cd frontend && npm run lint

# Build verification
cd frontend && npm run build
```

### Manual Verification
1. **Navigation**: Verify 4-tab bottom nav works on mobile viewport (375px)
2. **Dashboard**: All 4 action cards render, all status items show skeleton when loading
3. **i18n**: Switch language en→hi→gu and verify zero hardcoded strings
4. **Accessibility**: Tab through entire app, verify 56px button heights, 18px+ font
5. **API Integration**: Verify weather/advisory/farm data loads from backend (or shows proper loading state)
6. **Routing**: All existing deep links still work
7. **Responsive**: Test 375px, 768px, 1024px, 1440px viewports

---

## Execution Order

| Phase | Deliverable | Est. Files |
|---|---|---|
| 1 | Foundation: design tokens, folder structure, UI primitives | 15 |
| 2 | Navigation: BottomNav, TopBar, AppShell | 5 |
| 3 | Home page: Hero, ActionCards, Tasks, Alerts | 8 |
| 4 | Profile page + route restructuring | 4 |
| 5 | i18n: ~80 new keys in en/hi/gu | 1 |
| 6 | Accessibility: CSS, Tailwind, font/spacing | 2 |
| 7 | Mock data removal + error states | 3 |
| 8 | Existing page refactors (Disease, Weather, Advisory, etc.) | 8 |
| 9 | Documentation: 21 markdown files | 21 |
| **Total** | | **~67 files** |

---

## Key UX Decisions

| Decision | Rationale |
|---|---|
| Bottom nav over sidebar | 85% of Indian farmer users are on mobile. Bottom nav follows thumb zone. Research shows 1-tap access increases engagement by 30%. |
| 4 action cards (not 6+) | Reduces decision fatigue. Hick's Law: fewer choices → faster decisions. The 4 chosen are the most critical daily actions. |
| Earthy colors over glassmorphism | Glassmorphism is beautiful but hard to read in sunlight. Earthy tones provide high contrast + psychological trust (brown = earth, green = growth). |
| 18px min font | WHO recommends 16px+ for low-vision users. Indian farmers aged 40-65 often don't wear corrective lenses. 18px ensures readability. |
| Krishi Guide over Chatbot | Chatbots require typing literacy. A guided step-by-step workflow reduces cognitive load by ~70%. Farmers follow steps, not conversations. |
| Profile absorbs Reports/Settings | Reduces nav items. Reports are infrequently accessed. Settings is a "find and forget" pattern — Profile is the natural home. |
| Remove Planner from nav | Planner becomes "Today's Tasks" on the Home page. Daily tasks should be front-and-center, not hidden in a separate page. |
