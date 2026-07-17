from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db

router = APIRouter()


@router.post("/")
def create_review(db: Session = Depends(get_db)):
    """
    Placeholder endpoint to create a review.
    """
    return {"message": "Create review placeholder"}


@router.get("/")
def get_reviews(db: Session = Depends(get_db)):
    """
    Placeholder endpoint to retrieve reviews.
    """
    return {"reviews": []}
