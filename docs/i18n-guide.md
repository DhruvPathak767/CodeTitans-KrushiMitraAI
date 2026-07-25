# i18n Guide

## Architecture

Custom dictionary-based translation system in `src/i18n/dictionaries.ts`.

## Supported Languages

| Code | Language | Native |
|---|---|---|
| `en` | English | English |
| `hi` | Hindi | हिन्दी |
| `gu` | Gujarati | ગુજરાતી |

## How It Works

```typescript
// In AppContext.tsx
const t = (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
```

Fallback chain: Current language → English → Raw key (for debugging)

## Using Translations

```tsx
const { t } = useApp();

// In JSX
<h1>{t('greeting.morning')}</h1>
<Button>{t('home.scanCrop')}</Button>
```

## Key Naming Convention

```
section.subsection.item
```

| Pattern | Example |
|---|---|
| Navigation | `bottomNav.home`, `nav.main` |
| Greetings | `greeting.morning`, `greeting.afternoon` |
| Home page | `home.diseaseScan.title`, `home.scanCrop` |
| Farm status | `farmStatus.rainExpected` |
| Tasks | `tasks.today`, `tasks.captureImage` |
| Alerts | `alerts.heavyRain`, `alerts.diseaseRisk` |
| Profile | `profile.language`, `profile.manageFarms` |
| UI states | `state.loading`, `state.retry`, `state.error` |
| Common | `common.farmer`, `common.save`, `common.cancel` |

## Rules

1. **NEVER hardcode user-facing strings** — always use `t('key')`
2. **Add keys in ALL 3 languages** — en, hi, gu
3. **Keep keys descriptive** — `home.diseaseScan.desc` not `txt1`
4. **Fallback is English** — If a key is missing in hi/gu, English is shown
5. **Language switching is instant** — No page reload needed
6. **Backend syncs language** — `setLang()` also calls `/api/users/language`

## Adding New Keys

1. Open `src/i18n/dictionaries.ts`
2. Add key to `en` dictionary
3. Add translation to `hi` dictionary
4. Add translation to `gu` dictionary
5. Use `t('your.new.key')` in components
