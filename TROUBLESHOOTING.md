# KrishiMitra AI — Troubleshooting Guide

## Quick Diagnostic Checklist

Before diving into specific issues, verify all three services are running:

```bash
# Backend health
curl http://localhost:5000/

# Python AI health  
curl http://localhost:8000/

# MongoDB (in mongosh)
mongosh --eval "db.adminCommand('ping')"
```

---

## 🔴 Backend Issues

### Issue: `Error: Cannot connect to MongoDB`

**Symptoms:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Start MongoDB locally:**
   ```bash
   # Windows
   net start MongoDB
   # OR
   mongod --dbpath "C:\data\db"
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

2. **Check MongoDB Atlas connection string:**
   - Ensure your IP is in the Atlas IP Access List
   - Verify `MONGO_URI` includes credentials and `krishimitra` database name
   - Test: `mongosh "mongodb+srv://user:pass@cluster.mongodb.net/krishimitra"`

3. **Check .env file location:**
   ```bash
   ls backend/.env
   # File must exist in backend/ directory
   ```

---

### Issue: `JWT_SECRET is not defined`

**Symptoms:**
```
JsonWebTokenError: secretOrPrivateKey must have a value
```

**Solution:**
- Ensure `backend/.env` contains `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Values must be non-empty strings (minimum 32 characters recommended)
- Restart backend after editing `.env`

---

### Issue: `GROQ_API_KEY missing`

**Symptoms:**
- Advisory endpoint returns: `"Groq SDK uninitialized"`
- Chat endpoint returns error

**Solutions:**
1. Get free API key at [console.groq.com](https://console.groq.com)
2. Add to `backend/.env`: `GROQ_API_KEY=gsk_xxxxx`
3. Restart backend

> **Fallback behavior**: The sell/store recommendation module has a built-in rule-based fallback. Advisory and chat will return errors without a valid Groq key.

---

### Issue: `WeatherAPI error 401 / 403`

**Symptoms:**
```json
{ "error": { "code": 1002, "message": "API key is invalid." } }
```

**Solutions:**
1. Get free key at [weatherapi.com/signup](https://www.weatherapi.com/signup.aspx)
2. Add to `.env`: `WEATHERAPI_KEY=your_key_here`
3. Note: New keys may take 5–10 minutes to activate
4. Test directly: `curl "https://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=London"`

---

### Issue: `WeatherAPI 503 — No active farm coordinates`

**Symptoms:**
```json
{ "message": "No active farm found in database. Please register a farm first." }
```

**Solution:**
- This is expected behavior before farm registration
- Complete the farm registration wizard at `/onboarding/farm`
- Ensure the farm has valid GPS coordinates (latitude/longitude)

---

### Issue: `Cloudinary upload failed`

**Symptoms:**
```
CloudinaryError: Must supply api_key
```

**Solutions:**
1. Verify all three Cloudinary env vars are set:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
   ```
2. Find these in your Cloudinary dashboard under Settings → Access Keys

---

### Issue: `OTP email not received`

**Symptoms:**
- Signup completes but no OTP email arrives

**Solutions:**
1. Check Gmail App Password setup:
   - Must have 2FA enabled on Google account
   - Generate at: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Use the 16-character code (no spaces) as `SMTP_PASSWORD`

2. Check spam/junk folder

3. Verify SMTP config:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_actual_email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char app password
   FROM_EMAIL=your_actual_email@gmail.com
   ```

4. Test SMTP connection in Node.js:
   ```javascript
   import nodemailer from 'nodemailer';
   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com', port: 587, secure: false,
     auth: { user: 'your@gmail.com', pass: 'app_password' }
   });
   await transporter.verify(); // Should not throw
   ```

---

### Issue: `MANDI_API_KEY not configured`

**Symptoms:**
```json
{ "message": "MANDI_API_KEY is not configured. Set it in .env" }
```

**Solution:**
- This is optional for core functionality
- Register at [data.gov.in](https://data.gov.in) for a free API key
- Without this key, market prices will show empty results
- You can seed sample data with: `npm run seed:market`

---

## 🟡 Python AI Issues

### Issue: `Python AI microservice unreachable`

**Symptoms:**
```json
{
  "message": "AI Inference Microservice is unreachable on port 8000. Please ensure Python FastAPI service is running."
}
```

**Solutions:**
1. Start the Python service:
   ```bash
   cd python-ai
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. Verify it's running:
   ```bash
   curl http://localhost:8000/
   ```

3. Check `PYTHON_AI_URL` in `backend/.env`:
   ```env
   PYTHON_AI_URL=http://localhost:8000
   ```

---

### Issue: `pip install requirements.txt fails`

**Symptoms:**
- `ERROR: Failed building wheel for opencv-python-headless`
- `ERROR: Could not find a version that satisfies ultralytics`

**Solutions:**

1. **Upgrade pip first:**
   ```bash
   pip install --upgrade pip setuptools wheel
   ```

2. **For OpenCV on Windows:**
   ```bash
   pip install opencv-python-headless --no-cache-dir
   ```

3. **For Python version mismatch:**
   - Ensure Python 3.10+ is active: `python --version`
   - On systems with Python 2 and 3: use `python3` and `pip3`

4. **Use virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

---

### Issue: `yolov8n.pt not found`

**Symptoms:**
```
FileNotFoundError: yolov8n.pt not found
```

**Solution:**
```bash
cd python-ai
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
# This downloads yolov8n.pt automatically (~6 MB)
```

---

### Issue: `OOD rejection — valid plant image rejected`

**Symptoms:**
- Disease detection returns: `"Image does not appear to contain a plant leaf"`
- But you uploaded a valid crop image

**Solutions:**
1. Ensure the leaf occupies > 30% of the image frame
2. Use a well-lit, clear close-up of the leaf
3. Avoid blurry or heavily shadowed images
4. Try a different crop type in the request body

---

### Issue: Python AI `modelLoaded: false`

**Symptoms:**
- `/` returns `{"modelLoaded": false}`
- Disease prediction returns 500 error

**Solution:**
```bash
# Check startup logs
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

If TensorFlow model is missing, run the training script:
```bash
cd python-ai
python train_crop_disease_models.py
```

---

## 🔵 Frontend Issues

### Issue: `Frontend shows blank page`

**Solutions:**
1. Check browser console for errors (F12 → Console)
2. Verify backend is running: `curl http://localhost:5000/`
3. Hard-refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`
4. Clear localStorage: Browser DevTools → Application → LocalStorage → Clear all

---

### Issue: `TypeScript compilation errors`

**Symptoms:**
```
error TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'
```

**Solutions:**
```bash
cd frontend
npm run typecheck
# Review and fix reported errors
```

---

### Issue: `Weather page shows "No active farm"`

**Solution:**
- Go to `/app/farm` and register or select an active farm
- Click the **"Set as Active"** button on an existing farm
- Return to `/app/weather`

---

### Issue: `Maps not loading (blank Leaflet map)`

**Solution:**
- This is usually a CSS import issue
- Verify Leaflet CSS is loaded in the map component
- Check browser Network tab for 404 errors on map tile requests

---

### Issue: `Language not persisting after refresh`

**Solution:**
- Language is stored in `localStorage` under key `km_lang`
- Check: Browser DevTools → Application → Local Storage → `km_lang`
- If missing, the default `en` is used
- Re-select language in the Controls dropdown

---

## 🟢 General Issues

### Issue: `CORS error in browser`

**Symptoms:**
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
- The backend has CORS enabled by default
- If still failing, check that `cors()` middleware is applied in `backend/src/app.js`
- For production, update the CORS `origin` to your frontend domain

---

### Issue: `Port already in use`

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find and kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

---

### Issue: `node_modules missing or outdated`

**Solution:**
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install
```

---

## Getting Help

If your issue is not listed here:

1. Check the `backend/logs/` directory for Winston error logs
2. Check browser DevTools Console and Network tabs
3. Check Python terminal output for FastAPI error messages
4. Open a GitHub Issue with:
   - Your OS and Node/Python versions
   - The exact error message
   - Relevant log output

---

*KrishiMitra AI Troubleshooting Guide — Team CodeTitans*
