from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.routes import auth_routes, user_routes, menu_routes, order_routes, payment_routes
from app.config.database import engine, Base
from app.utils.auth import get_db, authenticate_user
from app.models.user_model import User   # <-- add this import

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QueueLess Backend")

# CORS – MUST be the first middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://queueless-frontend-84br.onrender.com",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(menu_routes.router, prefix="/menu", tags=["Menu"])
app.include_router(order_routes.router, prefix="/orders", tags=["Orders"])
app.include_router(payment_routes.router, prefix="/payments", tags=["Payments"])

@app.get("/debug-auth")
def debug_auth(db: Session = Depends(get_db)):
    try:
        users = db.query(User).limit(1).all()
        user = authenticate_user(db, "admin@queueless.com", "admin123")
        return {
            "db_connection": "ok",
            "users_count": len(users),
            "authenticate_user_result": user is not False,
            "user_email": user.email if user else None
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"message": "Welcome to QueueLess API"}