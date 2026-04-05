from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
import logging
 
logger = logging.getLogger(__name__)
 
# ============================================================
# CRITICAL: Import ALL models before anything else runs.
# SQLAlchemy resolves relationship("DiningTable") string refs
# by scanning the mapper registry at query time. If DiningTable
# isn't imported, every single request crashes with:
#   InvalidRequestError: 'DiningTable' failed to locate a name
# That 500 error has no CORS headers → browser shows fake "CORS error"
# ============================================================
from app.models.user_model import User                    # noqa: F401
from app.models.menu_model import Menu                    # noqa: F401
from app.models.table_model import DiningTable            # noqa: F401
from app.models.order_model import Order, OrderItem       # noqa: F401
from app.models.payment_model import Payment              # noqa: F401
 
# Routes — imported AFTER models so models are in registry first
from app.routes import auth_routes, user_routes, menu_routes, order_routes, payment_routes
 
 
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        # Server stays alive even if DB is unreachable on startup
    yield
 
 
app = FastAPI(
    title="QueueLess Backend",
    redirect_slashes=False,  # Prevents 307 redirects that lose CORS headers
    lifespan=lifespan
)
 
# CORS — must be registered before routers
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
    return {"status": "ok"}
 
@app.get("/cors-test")
def cors_test():
    return {"message": "CORS works"}
 
@app.get("/test-menu")
def test_menu():
    return {"message": "test menu works"}
