# Component Library

## UI Primitives (`@/components/ui`)

### Button
**Purpose:** Primary interactive element with accessibility built-in.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size (md = 56px min-height) |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `icon` | `ReactNode` | — | Leading icon |
| `fullWidth` | `boolean` | `false` | Stretches to full width |

```tsx
<Button variant="primary" icon={<Camera />} onClick={handleScan}>
  {t('home.scanCrop')}
</Button>
```

### Card
**Purpose:** Container for content blocks.

| Prop | Type | Default | Description |
|---|---|---|---|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner padding |
| `interactive` | `boolean` | `false` | Hover shadow lift |

### Skeleton / CardSkeleton
**Purpose:** Loading placeholder.

```tsx
<Skeleton className="h-12 w-full" />
<Skeleton lines={3} />
<CardSkeleton />
```

### EmptyState
**Purpose:** Shown when API returns no data.

| Prop | Type | Description |
|---|---|---|
| `icon` | `ReactNode` | Empty state illustration |
| `title` | `string` | Heading (use `t()`) |
| `description` | `string` | Helper text (use `t()`) |
| `action` | `ReactNode` | Optional CTA button |

### ErrorState
**Purpose:** Shown when API call fails.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Error heading (use `t()`) |
| `description` | `string` | Error details |
| `onRetry` | `() => void` | Retry callback |
| `retryLabel` | `string` | Button label (use `t()`) |

### Badge
**Purpose:** Status indicator.

Variants: `success`, `warning`, `error`, `info`, `neutral`

### ProgressBar
**Purpose:** Progress visualization with ARIA attributes.

## Layout Components (`@/components/layout`)

### AppShell
TopBar + scrollable content area + BottomNav. Used once in App.tsx.

### BottomNav
4-tab bottom navigation. Hidden on desktop (lg:hidden).

### TopBar
Greeting + notification bell + language switcher.

## Feature Components

### ActionCard (`@/features/home/ActionCard`)
180px min-height action card with icon, title, description, CTA button.

### FarmStatusHero (`@/components/farm-status/FarmStatusHero`)
Horizontally scrollable status pills derived from weather + advisory APIs.

### TodaysTasks (`@/features/home/TodaysTasks`)
Task checklist derived from Advisory API.

### RecentAlerts (`@/features/home/RecentAlerts`)
Alert feed from weather + advisory APIs.
