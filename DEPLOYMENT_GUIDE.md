# KrishiMitra AI — Deployment Guide

## Overview

This guide covers deploying the KrishiMitra AI platform across its three service components:

| Service | Tech | Recommended Host |
|---------|------|-----------------|
| Frontend | React + Vite | Vercel / Netlify |
| Backend | Node.js + Express | Render / Railway / DigitalOcean |
| Python AI | FastAPI + Uvicorn | Render / Railway (Python) |
| MongoDB | MongoDB Atlas | MongoDB Atlas (cloud) |

---

## Pre-Deployment Checklist

- [ ] All environment variables documented and secured
- [ ] MongoDB Atlas cluster created with production credentials
- [ ] All API keys acquired (Groq, WeatherAPI, Cloudinary, data.gov.in)
- [ ] Gmail App Password generated for SMTP
- [ ] `NODE_ENV=production` set in backend environment
- [ ] Python models verified and bundled (`yolov8n.pt`, `random_forest.joblib`)

---

## 1. MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with `readWriteAnyDatabase` role
3. Add `0.0.0.0/0` to IP Access List (or restrict to your server IPs)
4. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/krishimitra?retryWrites=true&w=majority
   ```
5. Set as `MONGO_URI` in backend environment

---

## 2. Backend Deployment (Render)

### Option A: Render (Recommended)

1. Create account at [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Runtime**: Node
5. Add all environment variables from `backend/.env.example`
6. Set `NODE_ENV=production`

### Option B: Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select the `backend` directory
4. Configure environment variables
5. Railway auto-detects Node.js and uses `npm start`

### Backend Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=<strong_random_64_char_string>
JWT_REFRESH_SECRET=<another_strong_64_char_string>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=your@gmail.com
GROQ_API_KEY=gsk_...
WEATHERAPI_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
MANDI_API_KEY=your_key
MANDI_API_BASE_URL=https://api.data.gov.in
MANDI_RESOURCE_ID=9ef84268-d588-465a-a308-a864a43d0070
PYTHON_AI_URL=https://your-python-service.onrender.com
```

---

## 3. Python AI Microservice Deployment (Render)

### Render Web Service (Python)

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `python-ai`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Runtime**: Python 3.11
4. Add `PYTHON_AI_URL` of this service to the backend's environment variables

> ⚠️ **Important**: The `yolov8n.pt` (6.2 MB) model file must be committed to the repository or downloaded at startup. Verify it is **not** in `.gitignore`.

### Dockerfile (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t krishimitra-ai-python .
docker run -p 8000:8000 krishimitra-ai-python
```

---

## 4. Frontend Deployment (Vercel)

### Vercel (Recommended)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

### Update Frontend API Base URL

In `frontend/src/api/`, ensure all API clients point to the production backend URL:

```typescript
// frontend/src/api/auth.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### Netlify (Alternative)

1. Connect repository to Netlify
2. Set:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. Add `_redirects` file in `frontend/public/`:
   ```
   /* /index.html 200
   ```

---

## 5. Production Build Verification

### Backend

```bash
cd backend
NODE_ENV=production node src/server.js
# Should start without errors and connect to Atlas
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
# Should serve production build at http://localhost:4173
```

### Python AI

```bash
cd python-ai
uvicorn main:app --host 0.0.0.0 --port 8000
curl http://localhost:8000/
# Should return: {"status": "Online", "modelLoaded": true}
```

---

## 6. CORS Configuration for Production

Update the backend CORS configuration in `src/app.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173'  // Keep for development
  ],
  credentials: true
}));
```

---

## 7. Security Hardening for Production

- [ ] Set strong, unique `JWT_SECRET` and `JWT_REFRESH_SECRET` (64+ characters)
- [ ] Restrict MongoDB Atlas IP access to only your backend server IPs
- [ ] Set `NODE_ENV=production` (enables combined Morgan logging, production error messages)
- [ ] Remove debug endpoint access (`GET /weather/debug`) in production or add auth guard
- [ ] Review Cloudinary upload presets and restrict upload folder access
- [ ] Enable rate limiting (future enhancement — not currently in codebase)

---

## 8. Monitoring & Logging

Winston logs are written to:
- **Console**: All environments
- **Log files**: `backend/logs/` directory (auto-created)

For production monitoring, consider:
- Render built-in log viewer
- MongoDB Atlas performance advisor
- Cloudinary usage dashboard
- Groq API dashboard for token usage

---

## 9. Background Job Verification

The APMC mandi price sync cron job runs every 6 hours automatically on backend startup:

```javascript
// Verify in logs:
// "MandiCron: Starting scheduled job (every 6 hours)..."
// "MandiCron: Running initial sync on startup..."
```

In production, verify the cron is running by checking:
```bash
GET /market/prices
# Should return recently synced prices (within 6 hours)
```

---

## Cost Estimation (Free Tier)

| Service | Free Tier | What You Get |
|---------|-----------|-------------|
| MongoDB Atlas | ✅ Free | 512 MB storage |
| Render (Backend) | ✅ Free | 750 hrs/month, sleeps after inactivity |
| Render (Python) | ✅ Free | 750 hrs/month |
| Vercel (Frontend) | ✅ Free | 100 GB bandwidth/month |
| WeatherAPI | ✅ Free | 1M calls/month |
| Groq Cloud | ✅ Free | 14.4K tokens/min |
| Cloudinary | ✅ Free | 25 GB storage |
| data.gov.in | ✅ Free | Open Government Data |

> **Total monthly cost for development/hackathon: $0**

---

*KrishiMitra AI Deployment Guide — Team CodeTitans*
