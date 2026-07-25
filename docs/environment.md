# Environment

## Environment Variables

### Frontend (Vite)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

### Backend
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `WEATHER_API_KEY` | WeatherAPI.com key |
| `GROQ_API_KEY` | Groq LLM API key |
| `PYTHON_AI_URL` | Python AI service URL (default: `http://localhost:8000`) |

### Python AI
| Variable | Description |
|---|---|
| `HOST` | FastAPI host (default: 0.0.0.0) |
| `PORT` | FastAPI port (default: 8000) |

## Development Setup

```bash
# 1. Clone
git clone <repo-url>
cd CodeTitans-KrushiMitraAI

# 2. Backend
cd backend
npm install
cp .env.example .env  # Fill in your keys
npm run dev

# 3. Frontend
cd ../frontend
npm install
npm run dev

# 4. Python AI
cd ../python-ai
pip install -r requirements.txt
python main.py
```

## Production

```bash
cd frontend && npm run build    # Outputs to dist/
cd backend && npm start         # Production server
```
