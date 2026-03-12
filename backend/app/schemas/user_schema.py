from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    password: str | None = None

class UserResponse(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True