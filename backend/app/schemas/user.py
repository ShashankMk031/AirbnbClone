import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.GUEST
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class User(UserResponse):
    pass
