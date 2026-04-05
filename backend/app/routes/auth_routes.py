from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.utils.auth import authenticate_user, create_access_token, get_db, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.token_schema import Token
from datetime import timedelta

router = APIRouter(redirect_slashes=False)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    # FIX: actually use ACCESS_TOKEN_EXPIRE_MINUTES from env instead of ignoring it
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}