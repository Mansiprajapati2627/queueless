from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: str
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    password: str | None = None

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    phone: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True