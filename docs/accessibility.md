# Accessibility

## Target Users
Indian farmers aged 30-65 with:
- Low digital literacy
- Possible vision issues (no corrective lenses)
- Working under bright sunlight
- Using budget Android phones with small screens

## Typography
- Minimum font size: **18px** (body text)
- Minimum helper text: **16px**
- Bold headings for clear hierarchy
- Inter font family (high x-height, excellent readability)

## Touch Targets
- Minimum button height: **56px**
- Minimum touch target: **48×48px**
- Adequate spacing between targets (8px+ gap)

## Contrast
- WCAG AA minimum: 4.5:1 for normal text
- WCAG AA minimum: 3:1 for large text (24px+)
- Earthy palette tested for sunlight readability

## Keyboard Navigation
- All interactive elements focusable via Tab
- Focus rings: 2px `primary-500` with 2px offset
- Escape key closes modals/dropdowns
- Enter/Space activates buttons

## Screen Readers
- `role` attributes on navigation, status, alert elements
- `aria-label` on icon-only buttons
- `aria-current="page"` on active nav items
- `aria-live="polite"` on dynamic status areas
- `sr-only` class for hidden descriptive text
- `aria-valuenow/min/max` on progress bars

## Language Support
- `document.documentElement.lang` synced with current language
- Language switcher prominent in TopBar and Profile
- Right-to-left (RTL) support: prepared via `dir` attribute (future)

## Motion
- `prefers-reduced-motion` respected via Framer Motion
- No essential information conveyed only through animation
