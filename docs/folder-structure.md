# Folder Structure

```
frontend/src/
├── api/                    # Axios API layer — one file per backend module
│   ├── auth.ts             # Auth endpoints (login, register, profile, refresh)
│   ├── farm.ts             # Farm CRUD endpoints
│   ├── weather.ts          # Weather dashboard endpoint
│   ├── advisory.ts         # Advisory get/refresh endpoints
│   ├── disease.ts          # Disease detection endpoint
│   ├── market.ts           # Market prices endpoint
│   ├── chat.ts             # AI chatbot endpoint
│   └── user.ts             # User preference endpoints
│
├── components/             # Shared, reusable components
│   ├── ui/                 # Design system primitives
│   │   ├── Button.tsx      # 56px min-height button
│   │   ├── Card.tsx        # Earthy card container
│   │   ├── Skeleton.tsx    # Loading placeholders
│   │   ├── EmptyState.tsx  # No-data state
│   │   ├── ErrorState.tsx  # Error + retry state
│   │   ├── ProgressBar.tsx # ARIA progress bar
│   │   ├── Badge.tsx       # Status badges
│   │   └── index.ts        # Barrel export
│   ├── layout/             # App-level layout
│   │   ├── AppShell.tsx    # TopBar + Content + BottomNav
│   │   ├── TopBar.tsx      # Greeting + bell + lang switcher
│   │   └── BottomNav.tsx   # 4-tab bottom navigation
│   ├── farm-status/        # Farm status hero widget
│   │   └── FarmStatusHero.tsx
│   ├── Controls.tsx        # LanguageSwitcher, ThemeToggle
│   └── NotificationBell.tsx
│
├── features/               # Feature modules (self-contained)
│   ├── home/               # Dashboard feature
│   │   ├── HomePage.tsx    # Main dashboard page
│   │   ├── ActionCard.tsx  # 4 primary action cards
│   │   ├── TodaysTasks.tsx # Task checklist from advisory
│   │   └── RecentAlerts.tsx # Alert feed
│   └── profile/            # Profile feature
│       └── ProfilePage.tsx # User settings, reports, help
│
├── pages/                  # Legacy page components (being migrated)
│   ├── Weather.tsx, DiseaseDetection.tsx, Advisory.tsx, etc.
│
├── context/                # React Context providers
│   ├── FarmContext.tsx
│   ├── WeatherContext.tsx
│   └── AdvisoryContext.tsx
│
├── hooks/                  # Custom React hooks
│   ├── useGreeting.ts      # Time-based greeting
│   └── useFarmStatus.ts    # Aggregated farm status
│
├── i18n/                   # Internationalization
│   ├── AppContext.tsx       # App provider + t() function
│   └── dictionaries.ts     # Translation keys (en, hi, gu)
│
├── design-system/          # Design tokens
│   └── tokens.ts           # Colors, spacing, typography, shadows
│
├── lib/                    # Shared utilities
│   ├── cn.ts               # Tailwind class merge utility
│   └── constants.ts        # App-wide constants
│
├── types/                  # TypeScript type definitions
│
├── App.tsx                 # Root component with routing
├── main.tsx                # Vite entry point
└── index.css               # Global styles + design system classes
```

## Why This Structure?

| Folder | Rationale |
|---|---|
| `api/` | Isolates network calls. Easy to mock for testing. |
| `components/ui/` | Design system primitives — never contain business logic. |
| `components/layout/` | Used once in app tree. Structural, not reusable. |
| `features/` | Self-contained modules. Can be lazy-loaded. |
| `context/` | Global state containers. Accessed via hooks. |
| `hooks/` | Shared logic. No UI rendering. |
| `lib/` | Pure utility functions. No React dependency. |
| `design-system/` | Token definitions. Referenced by Tailwind config. |

## Dependency Rules

- `ui/` components must NOT import from `features/` or `context/`
- `features/` CAN import from `ui/`, `hooks/`, `context/`, `api/`
- `hooks/` CAN import from `context/` and `api/`
- `api/` must NOT import from any React code
