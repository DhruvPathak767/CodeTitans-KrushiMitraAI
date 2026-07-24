from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.config.settings import settings
from app.routers.predict import router as predict_router
from app.services.model_loader import model_loader_singleton

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load TensorFlow CNN Model Singleton ONCE during FastAPI startup
    logger.info("Initializing KrishiMitra AI Python Service & Loading TensorFlow Model...")
    model_loader_singleton.load_model()
    yield
    logger.info("Shutting down Python AI Inference Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Node.js API Gateway & React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(predict_router)

@app.get("/")
async def root():
    return {
        "service": "KrishiMitra AI - TensorFlow Leaf Vision Service",
        "status": "Online",
        "version": settings.VERSION,
        "modelLoaded": model_loader_singleton.is_loaded
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
