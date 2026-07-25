# Error Handling

## Strategy

Every user-facing component that consumes API data must handle 4 states:

```
Loading → Skeleton → Data → Success
                  ↘ Error → ErrorState + Retry
                  ↘ Empty → EmptyState
```

## Component Usage

### Loading State
```tsx
if (loading) return <CardSkeleton />;
// or
if (loading) return <Skeleton lines={3} />;
```

### Error State
```tsx
if (error) {
  return (
    <ErrorState
      title={t('state.error')}
      description={error.message}
      onRetry={refetch}
      retryLabel={t('state.retry')}
    />
  );
}
```

### Empty State
```tsx
if (data.length === 0) {
  return (
    <EmptyState
      icon={<FileBarChart className="h-8 w-8" />}
      title={t('state.noData')}
      description={t('market.noDataDesc')}
    />
  );
}
```

## API Error Handling

```typescript
try {
  const res = await apiClient.get('/endpoint');
  return res.data;
} catch (err) {
  console.error('[API Error]', err);
  // Context providers set error state
  // Components read error state and render ErrorState
}
```

## Rules

1. **Never show raw API errors to farmers** — Always use friendly messages via `t()`
2. **Always provide retry** — `onRetry` callback on ErrorState
3. **Never show blank screens** — Skeleton while loading, EmptyState when empty
4. **Log errors** — `console.error` with context for debugging
5. **Graceful degradation** — If weather fails, still show other dashboard sections
