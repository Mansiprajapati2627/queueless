from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.config.database import engine, Base
from app.utils.auth import get_db
from app.routes import auth_routes, user_routes, menu_routes, order_routes, payment_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QueueLess Backend")

# CORS – allow your frontend
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

# Include routers (all with redirect_slashes=False – we'll set in each router)
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(menu_routes.router, prefix="/menu", tags=["Menu"])
app.include_router(order_routes.router, prefix="/orders", tags=["Orders"])
app.include_router(payment_routes.router, prefix="/payments", tags=["Payments"])

@app.get("/")
def root():
    return {"message": "Welcome to QueueLess API"}