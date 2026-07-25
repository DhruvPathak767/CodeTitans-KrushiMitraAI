# Performance

## Lazy Loading
- Use `React.lazy()` for feature pages not in the initial route
- `<Suspense fallback={<Skeleton />}>` around lazy components

## Code Splitting
- Vite automatic chunk splitting by route
- Heavy libraries (recharts, leaflet) loaded only on their pages

## Image Optimization
- Cloudinary transformations for crop images
- WebP format with quality=80
- Lazy loading via `loading="lazy"` attribute

## Caching
- WeatherContext: auto-refresh every 30 minutes
- localStorage: user profile, farm data, language, theme
- API responses: consider TanStack Query for automatic caching

## Bundle Optimization
- `lucide-react` excluded from optimizeDeps (tree-shaken)
- React deduplicated in Vite config
- Production build: minified + compressed

## Performance Budget
- First Contentful Paint: < 2s on 3G
- Time to Interactive: < 4s on 3G
- Bundle size: < 500KB gzipped (target)
