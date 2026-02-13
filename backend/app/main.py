from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.config import get_settings
from app.database import connect_db, close_db
from app.routes.auth import router as auth_router
from app.routes.blog import router as blog_router
from app.routes.careers import router as careers_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield
    await close_db()


app = FastAPI(
    title="Bedir Group API",
    description="Backend API for Bedir Group — Interior Design & Construction",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://localhost:3000",
]
# Allow any Vercel preview URLs
if settings.FRONTEND_URL and ".vercel.app" in settings.FRONTEND_URL:
    origins.append("https://*.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (uploaded images) — only mount if directory exists (skipped in serverless)
try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
except Exception:
    pass  # In serverless environments, static file mount may not be available

# Routes
app.include_router(auth_router)
app.include_router(blog_router)
app.include_router(careers_router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Bedir Group API"}


# Ensure DB connection on first request (for serverless where lifespan may not fire)
@app.middleware("http")
async def ensure_db_connection(request, call_next):
    from app.database import db as _db, connect_db as _connect
    if _db is None:
        await _connect()
    return await call_next(request)
