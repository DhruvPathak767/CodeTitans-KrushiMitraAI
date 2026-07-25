# UI/UX Guidelines

## Design Philosophy

> "A Farmer Needs a Guide, Not an Assistant."

Every screen answers: **"What is the next action the farmer should take today?"**

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary-500` | `#2D6A4F` | CTA buttons, active states, progress |
| `primary-700` | `#1B4332` | Text on light backgrounds |
| `secondary-500` | `#8B5E3C` | Warm accents, earthy details |
| `surface-50` | `#FFFDF7` | Page backgrounds |
| `surface-100` | `#FEFCF3` | Card backgrounds |
| `weather-500` | `#3B82F6` | Weather-only elements |
| `red-600` | `#DC2626` | Disease alerts, errors |
| `amber-600` | `#D97706` | Warnings |

### Color Rules
- **Green** = growth, trust, primary actions
- **Brown** = earth, warmth, secondary elements
- **Blue** = water/weather ONLY, never for non-weather UI
- **Red** = disease, errors ONLY

## Typography

| Level | Size | Weight | Usage |
|---|---|---|---|
| Hero | 32px | Bold | Home greeting |
| Page Title | 28px | Bold | Page headings |
| Section Heading | 24px | Bold | Section titles |
| Card Title | 20px | Bold | Card headings |
| Body | 18px | Regular | Default body text |
| Small | 16px | Medium | Helper text (minimum) |

**Rule:** NEVER use text smaller than 16px anywhere in the app.

## Spacing System

- **Card padding:** 20px
- **Page padding:** 16px (mobile), 32px (desktop)
- **Section gap:** 24px
- **Card gap:** 16px
- **Bottom nav height:** 72px (+ safe area)
- **Top bar height:** 64px

## Card Design

```
┌──────────────────────────┐
│  20px padding            │
│  ┌─────────┐             │
│  │ 48px    │  Title 20px │
│  │ icon    │  Desc  16px │
│  └─────────┘             │
│                          │
│  ┌──────────────────┐    │
│  │   CTA Button     │    │  ← 56px min height
│  │   56px height     │    │
│  └──────────────────┘    │
│                          │
└──────────────────────────┘
   border-radius: 16px
   shadow: earthy soft
```

## Navigation Principles

1. **4 bottom tabs only** — Home, Farm, Market, Profile
2. **Everything accessible from Home** — Action cards link to features
3. **No sidebar** — Mobile-first, thumb-zone optimized
4. **Bell icon in TopBar** — Notifications accessible from any page
5. **Back button** — Browser native, no custom back navigation

## Information Hierarchy

1. **Farm status hero** — Dynamic, API-driven, scrollable pills
2. **4 action cards** — ONLY the 4 most important daily actions
3. **Today's tasks** — Derived from advisory API
4. **Recent alerts** — Weather + disease warnings
5. **Everything else** — Accessible from Profile or deep links

## Mobile-First Design

- Design for 375px width first
- Scale up to tablet (768px) and desktop (1024px+)
- Desktop max-width: 1280px centered
- Bottom nav: visible on mobile, hidden on desktop
- Touch targets: minimum 48×48px

## Accessibility Rules

- WCAG AA minimum contrast (4.5:1 for text, 3:1 for large text)
- All interactive elements keyboard-focusable
- `role` and `aria-*` attributes on dynamic content
- Screen reader text via `sr-only` class
- Focus rings: 2px primary-500 with offset
