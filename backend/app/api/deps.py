from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.availability import AvailabilityService
from app.services.listing import ListingService
from app.services.booking import BookingService
from app.services.wishlist import WishlistService
from app.services.review import ReviewService


def get_availability_service(db: Session = Depends(get_db)) -> AvailabilityService:
    """
    Dependency injector for AvailabilityService.
    """
    return AvailabilityService(db)


def get_listing_service(db: Session = Depends(get_db)) -> ListingService:
    """
    Dependency injector for ListingService.
    """
    return ListingService(db)


def get_booking_service(db: Session = Depends(get_db)) -> BookingService:
    """
    Dependency injector for BookingService.
    """
    return BookingService(db)


def get_wishlist_service(db: Session = Depends(get_db)) -> WishlistService:
    """
    Dependency injector for WishlistService.
    """
    return WishlistService(db)


def get_review_service(db: Session = Depends(get_db)) -> ReviewService:
    """
    Dependency injector for ReviewService.
    """
    return ReviewService(db)
