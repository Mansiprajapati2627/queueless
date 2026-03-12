from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    auth_routes,
    user_routes,
    table_routes,
    menu_routes,
    order_routes,
    payment_routes,
)
from app.config.database import engine, Base

# Create tables (development only)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="QueueLess Backend")

# CORS configuration – allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(table_routes.router, prefix="/tables", tags=["Tables"])
app.include_router(menu_routes.router, prefix="/menu", tags=["Menu"])
app.include_router(order_routes.router, prefix="/orders", tags=["Orders"])
app.include_router(payment_routes.router, prefix="/payments", tags=["Payments"])

@app.get("/")
def root():
    return {"message": "Welcome to QueueLess API"}