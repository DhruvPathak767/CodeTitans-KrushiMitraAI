# Security

## Authentication
- JWT access tokens (short-lived)
- JWT refresh tokens (long-lived, httpOnly in production)
- OTP verification for registration
- Auto-refresh on 401

## Token Storage
- **Development:** `localStorage` (km_access_token, km_refresh_token)
- **Production recommendation:** httpOnly cookies for refresh tokens

## API Security
- CORS configured on backend
- Rate limiting on auth endpoints
- Input validation via Express middleware
- MongoDB injection prevention via Mongoose schemas

## Image Upload
- Multipart form data for disease detection
- Cloudinary handles storage (not local filesystem)
- Max file size enforced by Express middleware

## Dependencies
- Regular `npm audit` recommended
- No known critical vulnerabilities at time of writing
- Vite build strips console.log in production

## Frontend Security
- No secrets in frontend code
- API keys only on backend
- XSS prevention via React's default escaping
- CSRF: not applicable (JWT, not cookies)
