# Deployment

## Build Process

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Vite produces optimized, minified bundles with:
- Tree shaking
- Code splitting per route
- CSS purging via TailwindCSS
- Asset hashing for cache busting

## Production Checklist

- [ ] All environment variables set
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Cloudinary upload preset configured
- [ ] WeatherAPI key active
- [ ] Groq API key active
- [ ] Python AI models downloaded and loaded
- [ ] Frontend `dist/` served via CDN or static host
- [ ] Backend CORS configured for production domain
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting enabled on API

## CI/CD (Recommended)

```yaml
# Example GitHub Actions
name: Build & Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd frontend && npm ci && npm run build
      - run: cd backend && npm ci
      # Deploy steps...
```
