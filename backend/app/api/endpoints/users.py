from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.api.deps import get_booking_service, get_wishlist_service, get_db
from sqlalchemy.orm import Session
from app.services.booking import BookingService
from app.services.wishlist import WishlistService, WishlistUserNotFoundError
from app.schemas.booking import BookingResponseWithListing
from app.schemas.listing import ListingSummaryResponse

router = APIRouter()


@router.get("/{id}/bookings", response_model=List[BookingResponseWithListing])
def get_user_bookings(
    id: int,
    booking_service: BookingService = Depends(get_booking_service)
):
    """
    Retrieve booking history for a specific user (guest), sorted newest first.
    Preloads listing summaries to prevent N+1 queries.
    """
    return booking_service.get_user_bookings(user_id=id)


@router.get("/{id}/wishlist", response_model=List[ListingSummaryResponse])
def get_user_wishlist(
    id: int,
    wishlist_service: WishlistService = Depends(get_wishlist_service)
):
    """
    Get user's wishlisted listings, sorted newest first.
    """
    try:
        listings = wishlist_service.get_user_wishlist(user_id=id)
        return [ListingSummaryResponse.model_validate(l) for l in listings]
    except WishlistUserNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/{id}/wishlist-ids", response_model=dict[int, int])
def get_user_wishlist_ids(
    id: int,
    db: Session = Depends(get_db)
):
    """
    Get mapping from listing_id -> wishlist_id for a user.
    """
    from app.models.wishlist import Wishlist
    wishlists = db.query(Wishlist).filter(Wishlist.user_id == id).all()
    return {w.listing_id: w.id for w in wishlists}
