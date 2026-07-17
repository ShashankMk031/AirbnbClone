from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db

router = APIRouter()


@router.post("/register")
def register(db: Session = Depends(get_db)):
    """
    Placeholder endpoint for user registration.
    """
    return {"message": "Registration placeholder"}


@router.post("/login")
def login(db: Session = Depends(get_db)):
    """
    Placeholder endpoint for user login.
    """
    return {"message": "Login placeholder"}
