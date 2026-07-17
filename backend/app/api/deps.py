from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.availability import AvailabilityService
from app.services.listing import ListingService


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
