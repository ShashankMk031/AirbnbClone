from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_review_service
from app.services.review import (
    ReviewService,
    ReviewAuthorNotFoundError,
    ReviewListingNotFoundError,
    ReviewDuplicateError,
)
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter()


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    *,
    review_in: ReviewCreate,
    review_service: ReviewService = Depends(get_review_service)
):
    """
    Create a new review for a listing.
    Validates author and listing existence, and prevents duplicate reviews.
    Recomputes rating and review_count on the listing.
    """
    try:
        db_review = review_service.create_review(review_in)
        return db_review
    except (ReviewAuthorNotFoundError, ReviewListingNotFoundError) as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ReviewDuplicateError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
