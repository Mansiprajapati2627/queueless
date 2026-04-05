from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, user_routes, menu_routes, order_routes, payment_routes
from app.config.database import engine, Base
import logging

logger = logging.getLogger(__name__)

# FIX: Move DB init into lifespan so a DB connection failure at startup
# does NOT crash the process before CORS middleware is registered.
# Previously: Base.metadata.create_all() ran at module import time —
# if Clever Cloud DB was sleeping, it threw an exception and killed the app,
# so every subsequent request got ERR_FAILED with no CORS headers at all.
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        # App continues running — CORS and routes still work.
        # Individual DB requests will fail with 500 errors
        # instead of the entire server being dead with no CORS headers.
    yield

app = FastAPI(
    title="QueueLess Backend",
    redirect_slashes=False,  # Prevents 307 redirects that CORS blocks
    lifespan=lifespan
)

# CORS middleware — registered before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://queueless-frontend-84br.onrender.com",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router,    prefix="/auth",     tags=["Authentication"])
app.include_router(user_routes.router,    prefix="/users",    tags=["Users"])
app.include_router(menu_routes.router,    prefix="/menu",     tags=["Menu"])
app.include_router(order_routes.router,   prefix="/orders",   tags=["Orders"])
app.include_router(payment_routes.router, prefix="/payments", tags=["Payments"])

@app.get("/")
def root():
    return {"message": "Welcome to QueueLess API"}

@app.get("/health")
def health():
    """Health check — useful for Render keep-alive pings to prevent cold starts"""
    return {"status": "ok"}

@app.get("/cors-test")
def cors_test():
    return {"message": "CORS works"}

@app.get("/test-menu")
def test_menu():
    return {"message": "test menu works"}