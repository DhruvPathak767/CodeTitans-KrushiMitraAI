# Animations

## Library
Framer Motion (`framer-motion`) is the sole animation library.

## Principles
1. **Purposeful** — Animations guide attention, never distract
2. **Fast** — Duration 200-400ms for UI transitions
3. **Subtle** — Scale 0.97-1.0 for tap feedback
4. **Accessible** — Respect `prefers-reduced-motion`

## Standard Animations

### Page/Section Entrance
```tsx
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
```

### Card Entrance (staggered)
```tsx
<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
```

### Button Tap
```tsx
<motion.button whileTap={{ scale: 0.97 }}>
```

### Bottom Nav Active Indicator
```tsx
<motion.div layoutId="bottomnav-indicator" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
```

### Progress Bar Fill
```tsx
<motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
```

## Durations
| Animation | Duration |
|---|---|
| Micro-interaction (tap) | 100-150ms |
| UI transition | 200-300ms |
| Page entrance | 400ms |
| Progress fill | 800ms |
| Status pill entrance | 300ms + stagger |

## What NOT to Animate
- Text content changes
- Loading spinners (use CSS `animate-spin`)
- Background colors (use CSS transitions)
