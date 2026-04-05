from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, user_routes, menu_routes, order_routes, payment_routes
from app.config.database import engine, Base
 
Base.metadata.create_all(bind=engine)
 
# FIX: redirect_slashes=False at app level prevents 307 redirects
# that break CORS (browser blocks cross-origin redirects that lack CORS headers)
app = FastAPI(title="QueueLess Backend", redirect_slashes=False)
 
# CORS – allow your specific frontend URL
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
 
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(menu_routes.router, prefix="/menu", tags=["Menu"])
app.include_router(order_routes.router, prefix="/orders", tags=["Orders"])
app.include_router(payment_routes.router, prefix="/payments", tags=["Payments"])
 
@app.get("/")
def root():
    return {"message": "Welcome to QueueLess API"}
 
@app.get("/cors-test")
def cors_test():
    return {"message": "CORS works"}
 
@app.get("/test-menu")
def test_menu():
    return {"message": "test menu works"}