# Coding Standards

## TypeScript
- Strict mode enabled
- Use `interface` for object shapes, `type` for unions/intersections
- Export types alongside components
- No `any` — use `unknown` if type is uncertain

## React
- Functional components only (no class components)
- Custom hooks for shared logic (prefix `use`)
- Avoid prop drilling — use context or hooks
- Memoize expensive computations with `useMemo`
- Use `useCallback` for stable function references passed as props

## Naming
- **Files:** PascalCase for components (`ActionCard.tsx`), camelCase for utilities (`useGreeting.ts`)
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Types/Interfaces:** PascalCase with descriptive names (`ButtonProps`, `FarmStatusItem`)

## i18n
- NEVER hardcode user-facing strings
- Use `t('key.subkey')` for all text
- Keys follow dot-notation: `section.item` (e.g., `home.scanCrop`)

## Styling
- TailwindCSS utility classes
- `cn()` utility for conditional classes (from `@/lib/cn`)
- Design system classes for new components (`.earthy-card`, `.earthy-btn-primary`)
- Legacy classes (`.glass`, `.btn-primary`) for existing pages only

## Error Handling
- Wrap async operations in try/catch
- Show `<ErrorState />` on API failure
- Log errors to console (never show raw errors to users)
- Always provide retry functionality

## Commits
- Format: `feat: description`, `fix: description`, `refactor: description`
- Keep commits atomic — one logical change per commit

## Linting
- ESLint with React + TypeScript rules
- Prettier for formatting
- No unused imports or variables
