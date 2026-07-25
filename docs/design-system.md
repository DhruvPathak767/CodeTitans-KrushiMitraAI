# Design System

## Tokens

Defined in `src/design-system/tokens.ts`. Referenced by Tailwind config.

## Colors

See [ui-ux-guidelines.md](./ui-ux-guidelines.md#color-palette) for the full palette.

## Buttons

| Variant | Class | Min Height | Usage |
|---|---|---|---|
| Primary | `earthy-btn-primary` / `<Button variant="primary">` | 56px | Main CTAs |
| Secondary | `earthy-btn-secondary` / `<Button variant="secondary">` | 56px | Secondary actions |
| Outline | `<Button variant="outline">` | 56px | Tertiary actions |
| Ghost | `<Button variant="ghost">` | 44px | Navigation, less emphasis |
| Danger | `<Button variant="danger">` | 56px | Destructive actions (logout) |

## Cards

| Variant | Class | Usage |
|---|---|---|
| Default | `earthy-card` / `<Card>` | Content containers |
| Interactive | `<Card interactive>` | Clickable cards |
| No padding | `<Card padding="none">` | Menu lists |

## Inputs

| Class | Min Height | Font Size |
|---|---|---|
| `earthy-input` / `<Input>` | 56px | 18px |

## Icons

- Library: Lucide React
- Size: 20-24px in cards, 48px in action cards
- Color: matches context (primary, slate, semantic)

## Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `gap-2` | 8px | Tight spacing |
| `gap-3` | 12px | Default gap |
| `gap-4` | 16px | Card gap |
| `gap-6` | 24px | Section gap |
| `p-4` | 16px | Mobile page padding |
| `p-5` | 20px | Card padding |

## Elevation (Shadows)

| Level | Shadow | Usage |
|---|---|---|
| Surface | None | Background areas |
| Card | `card-earthy` | Cards, containers |
| Card Hover | `card-earthy-hover` | Interactive card hover |
| Navigation | `nav` | Bottom nav bar |
| Button | `button` | Primary button |

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-xl` | 12px | Inputs, small elements |
| `rounded-2xl` | 16px | Cards, buttons |
| `rounded-full` | 9999px | Badges, pills |
