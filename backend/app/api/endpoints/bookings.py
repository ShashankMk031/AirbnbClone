from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_availability_service
from app.services.availability import AvailabilityService
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.booking import Booking, BookingStatus
from app.models.listing import Listing

router = APIRouter()


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    *,
    db: Session = Depends(get_db),
    booking_in: BookingCreate,
    guest_id: int = 4,  # Fallback/mock guest ID for staging/assessment testing
    availability_service: AvailabilityService = Depends(get_availability_service)
):
    """
    Create a new booking.
    Performs listing existence validation, capacity checks, and utilizes
    AvailabilityService to prevent date range overlaps.
    """
    # 1. Verify listing exists
    listing = db.query(Listing).filter(Listing.id == booking_in.listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Listing with ID {booking_in.listing_id} not found."
        )

    # 2. Check guest capacity
    if booking_in.guest_count > listing.max_guests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guest count ({booking_in.guest_count}) exceeds listing max capacity ({listing.max_guests})."
        )

    # 3. Check for date overlaps using the AvailabilityService
    if availability_service.check_date_range_overlap(
        listing_id=booking_in.listing_id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The requested dates overlap with an existing confirmed booking for this listing."
        )

    # 4. Compute total price dynamically based on nights stayed
    nights = (booking_in.check_out - booking_in.check_in).days
    total_price = listing.price_per_night * nights

    # 5. Create booking record
    db_booking = Booking(
        listing_id=booking_in.listing_id,
        guest_id=guest_id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out,
        guest_count=booking_in.guest_count,
        total_price=total_price,
        status=BookingStatus.CONFIRMED
    )

    try:
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save booking. Please try again."
        )

    return db_booking


@router.get("/")
def get_bookings(db: Session = Depends(get_db)):
    """
    Retrieve all bookings.
    """
    bookings = db.query(Booking).all()
    return bookings
