from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db

router = APIRouter()


@router.post("/")
def add_to_wishlist(db: Session = Depends(get_db)):
    """
    Placeholder endpoint to add a listing to user's wishlist.
    """
    return {"message": "Add to wishlist placeholder"}


@router.get("/")
def get_wishlist(db: Session = Depends(get_db)):
    """
    Placeholder endpoint to retrieve user's wishlist.
    """
    return {"wishlist": []}
