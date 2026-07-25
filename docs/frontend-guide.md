# Frontend Guide

## Folder Structure

See [folder-structure.md](./folder-structure.md) for detailed explanation.

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `ActionCard.tsx`, `BottomNav.tsx` |
| Hooks | camelCase with `use` prefix | `useGreeting.ts`, `useFarmStatus.ts` |
| Utilities | camelCase | `cn.ts`, `constants.ts` |
| Types | PascalCase interfaces | `ButtonProps`, `FarmStatusItem` |
| i18n keys | dot-notation | `home.scanCrop`, `bottomNav.home` |
| CSS classes | kebab-case | `earthy-card`, `earthy-btn-primary` |

## Component Organization

### UI Primitives (`components/ui/`)
Reusable, stateless design system components. Import via `@/components/ui`.

### Layout (`components/layout/`)
App shell, navigation, page containers. Used once in the app tree.

### Feature Components (`features/[name]/`)
Self-contained feature modules. Each feature folder may contain page components, sub-components, and feature-specific hooks.

## Best Practices

1. **Always use `t()` for text** — Never hardcode user-facing strings
2. **Use `<Skeleton />` for loading** — Never show empty space while loading
3. **Use `<ErrorState />` for errors** — Always provide retry button
4. **Use `<EmptyState />` for empty data** — Never show blank screens
5. **Minimum 56px button height** — For touch accessibility
6. **Minimum 18px font** — For readability under sunlight
