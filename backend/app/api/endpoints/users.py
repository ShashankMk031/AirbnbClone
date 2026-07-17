from fastapi import APIRouter, Depends
from typing import List
from app.api.deps import get_booking_service
from app.services.booking import BookingService
from app.schemas.booking import BookingResponseWithListing

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
