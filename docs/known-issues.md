# Known Issues

## Technical Debt

1. **Legacy pages still use glassmorphism** — Weather, Disease, Advisory, Market, and other existing pages still use the old `.glass` / `.glass-strong` CSS classes. They should be gradually migrated to the earthy design system.

2. **Mock data still imported** — `src/data/mock.ts` and `src/data/ai.ts` are still imported by existing pages (Dashboard charts, FloatingAssistant). The old Dashboard is no longer routed to, but the files remain.

3. **No TanStack Query** — Data fetching uses `useEffect` + `useState` in context providers. Should be migrated to TanStack Query for better caching, deduplication, and loading states.

4. **Hardcoded strings in legacy pages** — Some existing pages (Sidebar, AppLayout, FloatingAssistant) contain hardcoded English strings like `"Core Modules"`, `"Future Farming AI"`, `"Active GPS"`. These should use `t()` keys.

5. **No error boundaries** — Feature pages don't have React error boundaries. A crash in one page crashes the entire app.

6. **Old Sidebar and AppLayout still exist** — The files `Sidebar.tsx` and `AppLayout.tsx` are no longer imported by `App.tsx` but haven't been deleted. They can be safely removed.

7. **No unit tests** — No test files exist. Hooks and utilities should have tests.

## Limitations

- **Offline mode** — Not supported. Requires internet for all features.
- **PWA** — Not configured yet. Service worker not registered.
- **RTL languages** — Prepared but not implemented (Urdu, Arabic).
- **Accessibility audit** — No automated a11y testing (axe-core).

## Browser Compatibility

- Chrome 80+ (Android WebView)
- Safari 14+ (iOS)
- Firefox 78+
- Edge 80+
- No IE11 support
