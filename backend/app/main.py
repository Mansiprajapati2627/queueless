from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
  
from app.routes import auth_routes, user_routes, menu_routes, order_routes, payment_routes
from app.config.database import engine, Base

from app.models import user_model, menu_model, order_model, payment_model
from app.models import table_model

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="QueueLess Backend", redirect_slashes=False)

# ------------------ CORS ------------------

origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://queueless-frontend-84br.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://queueless-frontend-84br.onrender.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import menu_routes
app.include_router(menu_routes.router, prefix="/menu", tags=["Menu"])
# ------------------ ROUTES ------------------

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(menu_routes.router, prefix="/menu", tags=["Menu"])
app.include_router(order_routes.router, prefix="/orders", tags=["Orders"])
app.include_router(payment_routes.router, prefix="/payments", tags=["Payments"])

# ------------------ ROOT ------------------

@app.get("/")
def root():
    return {"message": "Welcome to QueueLess API"}