# KrishiMitra AI — Complete Setup Guide

This guide provides **step-by-step instructions** to set up the KrishiMitra AI platform from scratch on a fresh machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Download | Verify |
|----------|---------|---------|--------|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/en/download) | `node --version` |
| **npm** | v9 or higher | Bundled with Node.js | `npm --version` |
| **Python** | v3.10 or higher | [python.org](https://www.python.org/downloads) | `python --version` |
| **pip** | Latest | Bundled with Python | `pip --version` |
| **Git** | Latest | [git-scm.com](https://git-scm.com/downloads) | `git --version` |
| **MongoDB** | v6.0 or higher | [mongodb.com](https://www.mongodb.com/try/download/community) | `mongod --version` |

### Required API Keys

You will need to register for the following free services:

| Service | What For | How to Get |
|---------|----------|-----------|
| **WeatherAPI.com** | 7-day weather forecast | [weatherapi.com/signup](https://www.weatherapi.com/signup.aspx) — Free tier available |
| **Groq Cloud** | LLaMA-3.3-70b AI inference | [console.groq.com](https://console.groq.com) — Free API key |
| **Cloudinary** | Image CDN for disease detection | [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free) |
| **Gmail** | SMTP for OTP emails | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) — Enable 2FA first |
| **data.gov.in** | APMC mandi prices *(optional)* | [data.gov.in/user/register](https://data.gov.in) |

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/CodeTitans/KrishiMitra-AI.git
cd KrishiMitra-AI
```

Verify the structure:
```bash
ls
# Should show: backend/  frontend/  python-ai/  README.md  docs/
```

---

## Step 2 — Setup MongoDB

### Option A: Local MongoDB (Recommended for Development)

**Windows:**
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install as a Windows Service or run manually:
   ```powershell
   mongod --dbpath "C:\data\db"
   ```
3. Verify connection:
   ```bash
   mongosh mongodb://127.0.0.1:27017
   ```

**Linux/Mac:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Verify
mongosh --eval "db.adminCommand('ping')"
```

### Option B: MongoDB Atlas (Cloud)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write permissions
3. Get the connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/krishimitra`
4. Add your IP to the Atlas IP Access List

---

## Step 3 — Backend Setup

```bash
cd backend
```

### Install dependencies
```bash
npm install
```

### Create environment file
```bash
cp .env.example .env
```

### Configure `.env`

Open `backend/.env` and fill in all values:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/krishimitra

# JWT Secrets (use strong random strings)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters

# Gmail SMTP (for OTP emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_gmail@gmail.com
SMTP_PASSWORD=your_16_char_gmail_app_password
FROM_EMAIL=your_gmail@gmail.com

# Groq AI (LLaMA-3.3-70b)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# WeatherAPI.com
WEATHERAPI_KEY=your_weatherapi_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# data.gov.in APMC API (optional)
MANDI_API_KEY=your_data_gov_in_api_key
MANDI_API_BASE_URL=https://api.data.gov.in
MANDI_RESOURCE_ID=9ef84268-d588-465a-a308-a864a43d0070

# Python AI Service URL
PYTHON_AI_URL=http://localhost:8000
```

### Generate JWT Secrets

You can generate strong secrets using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Verify backend configuration

```bash
npm run dev
```

Expected output:
```
info: Database connected: 127.0.0.1
info: Super admin seeded (or already exists)
info: Server running in development mode on port 5000
info: Health check available at http://localhost:5000/
```

### Test health check

```bash
curl http://localhost:5000/
```

Expected:
```json
{
  "success": true,
  "project": "KrishiMitra AI Backend",
  "status": "Running",
  "version": "1.0.0"
}
```

---

## Step 4 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Expected output:
```
  VITE v5.4.2  ready in 732 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Step 5 — Python AI Microservice Setup

Open a **new terminal**:

```bash
cd python-ai
```

### Create a virtual environment (recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Install Python dependencies

```bash
pip install -r requirements.txt
```

This installs: FastAPI, Uvicorn, Pydantic, Ultralytics (YOLOv8), scikit-learn, OpenCV, NumPy, Pandas, Pillow, httpx.

> ⚠️ **Note:** The first install may take several minutes as it downloads TensorFlow, Ultralytics, and OpenCV packages.

### Verify the YOLOv8 model exists

```bash
ls yolov8n.pt
# Should show: yolov8n.pt (6.2 MB)
```

If missing, download it:
```bash
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### Start the AI microservice

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:
```
INFO:     Initializing KrishiMitra AI Python Service & Loading Machine Learning Models...
INFO:     Machine Learning Models loaded successfully
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Verify

```bash
curl http://localhost:8000/
```

Expected:
```json
{
  "service": "KrishiMitra AI - TensorFlow Leaf Vision Service",
  "status": "Online",
  "version": "1.0.0",
  "modelLoaded": true
}
```

View interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Step 6 — Seed Market Data (Optional)

If you have a data.gov.in API key configured, seed initial market data:

```bash
cd backend
npm run seed:market
```

---

## Step 7 — Run All Three Services Simultaneously

For production-like development, run all three services at once.

**Windows (PowerShell) — Open 3 separate terminals:**

Terminal 1 (Backend):
```powershell
cd backend; npm run dev
```

Terminal 2 (Python AI):
```powershell
cd python-ai; uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 3 (Frontend):
```powershell
cd frontend; npm run dev
```

---

## Step 8 — First-Time Usage Flow

1. Open [http://localhost:5173](http://localhost:5173)
2. Click **"Get Started"** on the landing page
3. Click **"Sign Up"** and create an account
4. Check your email for the OTP code
5. Enter the OTP to verify your email
6. You'll be redirected to **Farm Registration** (onboarding)
7. Allow location access for GPS coordinates
8. Fill in farm details and register your farm
9. You're now on the **Home Dashboard** 🎉

---

## Gmail App Password Setup

To use Gmail SMTP for OTP emails:

1. Enable 2-Factor Authentication on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select **App: Mail**, **Device: Windows/Mac/Linux**
4. Copy the 16-character app password
5. Use it as `SMTP_PASSWORD` in your `.env`

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|---------|
| `MongoDB connection refused` | Start MongoDB: `mongod --dbpath /data/db` |
| `GROQ_API_KEY missing` | Add your Groq key to `backend/.env` |
| `WeatherAPI error 401` | Check `WEATHERAPI_KEY` in `.env` |
| `Python AI unreachable` | Start: `uvicorn main:app --port 8000` |
| `Frontend 404 on /api/...` | Ensure backend is running on port 5000 |
| `OTP email not received` | Check SMTP config and Gmail App Password |
| `Cloudinary upload fails` | Verify all 3 Cloudinary env vars |

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

---

## Development Scripts Reference

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon hot-reload |
| `npm run start` | Start production server |
| `npm run seed:market` | Seed market price data |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint code quality check |

### Python AI

| Command | Description |
|---------|-------------|
| `uvicorn main:app --reload` | Start with hot-reload |
| `python test_inference.py` | Test disease detection pipeline |
| `python evaluate_models.py` | Evaluate model performance |
| `python train_crop_disease_models.py` | Train new models |

---

*KrishiMitra AI Setup Guide — Team CodeTitans*
