# Contributing

## Getting Started

1. Read [context.md](./context.md) first — it explains the project philosophy
2. Read [coding-standards.md](./coding-standards.md) for conventions
3. Read [i18n-guide.md](./i18n-guide.md) — never hardcode strings

## Pull Request Workflow

1. Create a feature branch: `feat/your-feature-name`
2. Make changes following [coding-standards.md](./coding-standards.md)
3. Ensure zero hardcoded strings — use `t()` for everything
4. Test on mobile viewport (375px)
5. Submit PR with description of changes and UX rationale

## Commit Convention

```
feat: add disease detection action card
fix: correct Hindi translation for irrigation
refactor: extract useGreeting hook
docs: update component library
```

## Code Review Checklist

- [ ] No hardcoded user-facing strings
- [ ] All buttons ≥ 56px height
- [ ] All text ≥ 16px
- [ ] Loading/error/empty states handled
- [ ] Responsive on 375px, 768px, 1024px
- [ ] i18n keys added in en, hi, gu
- [ ] Accessibility: keyboard nav + screen reader

## Architecture Rules

1. Never import `features/` from `components/ui/`
2. Never import React from `api/`
3. Never mutate context state directly — use setter functions
4. Never use mock data in production components
