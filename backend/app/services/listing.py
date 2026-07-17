import datetime
import math
from typing import Optional, List, Dict, Any
from sqlalchemy import exists
from sqlalchemy.orm import joinedload
from app.services.base import BaseService
from app.models.listing import Listing
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.listing import ListingSort, ListingCreate, ListingUpdate


# --- Exceptions ---

class ListingServiceException(Exception):
    pass


class HostNotFoundError(ListingServiceException):
    def __init__(self, host_id: int):
        super().__init__(f"Host with ID {host_id} not found.")


class ListingNotFoundError(ListingServiceException):
    def __init__(self, listing_id: int):
        super().__init__(f"Listing with ID {listing_id} not found.")


class NotOwnerError(ListingServiceException):
    def __init__(self):
        super().__init__("Only the listing owner may modify this listing.")


# --- Listing Service Implementation ---

class ListingService(BaseService):
    def get_listings(
        self,
        *,
        location: Optional[str] = None,
        check_in: Optional[datetime.date] = None,
        check_out: Optional[datetime.date] = None,
        guests: Optional[int] = None,
        property_type: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        page: int = 1,
        page_size: int = 10,
        sort_by: Optional[ListingSort] = None
    ) -> Dict[str, Any]:
        """
        Query listings with sorting, pagination, and multi-field filters.
        Prevents N+1 database queries via joinedload on host, and handles
        date range availability checking directly within SQL via NOT EXISTS subqueries.
        """
        query = self.db.query(Listing).options(joinedload(Listing.host))

        # 1. Partial case-insensitive location filter
        if location:
            query = query.filter(Listing.location.ilike(f"%{location}%"))

        # 2. Guest capacity filter
        if guests is not None:
            query = query.filter(Listing.max_guests >= guests)

        # 3. Property type exact match filter
        if property_type:
            query = query.filter(Listing.property_type == property_type)

        # 4. Price range filters
        if min_price is not None:
            query = query.filter(Listing.price_per_night >= min_price)
        if max_price is not None:
            query = query.filter(Listing.price_per_night <= max_price)

        # 5. Availability filter (database level subquery checking NOT EXISTS overlap)
        if check_in and check_out:
            overlap_subquery = exists().where(
                Booking.listing_id == Listing.id,
                Booking.status == BookingStatus.CONFIRMED,
                Booking.check_in < check_out,
                Booking.check_out > check_in
            )
            query = query.filter(~overlap_subquery)

        # 6. Sorting using type-safe Enum
        if sort_by == ListingSort.PRICE_ASC:
            query = query.order_by(Listing.price_per_night.asc())
        elif sort_by == ListingSort.PRICE_DESC:
            query = query.order_by(Listing.price_per_night.desc())
        elif sort_by == ListingSort.RATING:
            query = query.order_by(Listing.rating.desc())
        else:
            query = query.order_by(Listing.created_at.desc())

        # 7. Pagination math
        total = query.count()
        total_pages = math.ceil(total / page_size) if total > 0 else 0
        
        offset = (page - 1) * page_size
        items = query.limit(page_size).offset(offset).all()

        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages
        }

    def get_listing_by_id(
        self,
        listing_id: int,
        check_in: Optional[datetime.date] = None,
        check_out: Optional[datetime.date] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve a single listing by its primary key with host details loaded.
        Returns a dictionary container instead of mutating ORM instances.
        """
        listing = self.db.query(Listing).options(joinedload(Listing.host)).filter(Listing.id == listing_id).first()
        if not listing:
            return None

        # Check availability dynamically if requested
        is_available = None
        if check_in and check_out:
            has_overlap = self.db.query(exists().where(
                Booking.listing_id == listing_id,
                Booking.status == BookingStatus.CONFIRMED,
                Booking.check_in < check_out,
                Booking.check_out > check_in
            )).scalar()
            is_available = not has_overlap

        return {
            "listing": listing,
            "is_available": is_available
        }

    def create_listing(self, listing_in: ListingCreate) -> Listing:
        """
        Create a new Listing. Checks if the host_id exists.
        Returns the created Listing.
        """
        host = self.db.query(User).filter(User.id == listing_in.host_id).first()
        if not host:
            raise HostNotFoundError(listing_in.host_id)

        db_listing = Listing(
            host_id=listing_in.host_id,
            title=listing_in.title,
            description=listing_in.description,
            location=listing_in.location,
            latitude=listing_in.latitude,
            longitude=listing_in.longitude,
            price_per_night=listing_in.price_per_night,
            property_type=listing_in.property_type,
            max_guests=listing_in.max_guests,
            bedrooms=listing_in.bedrooms,
            bathrooms=listing_in.bathrooms,
            amenities=listing_in.amenities,
            photos=listing_in.photos
        )
        self.db.add(db_listing)
        self.db.commit()
        
        # Reload with host preloaded to fulfill ListingDetailResponse requirements
        return self.db.query(Listing).options(joinedload(Listing.host)).filter(Listing.id == db_listing.id).first()

    def update_listing(self, listing_id: int, host_id: int, listing_in: ListingUpdate) -> Listing:
        """
        Update a Listing. Verifies ownership of host_id.
        Supports partial updates.
        """
        listing = self.db.query(Listing).options(joinedload(Listing.host)).filter(Listing.id == listing_id).first()
        if not listing:
            raise ListingNotFoundError(listing_id)

        # Enforce host ownership validation check
        if listing.host_id != host_id:
            raise NotOwnerError()

        # Apply updates dynamically
        update_data = listing_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(listing, field, value)

        self.db.commit()
        self.db.refresh(listing)
        return listing

    def delete_listing(self, listing_id: int, host_id: int) -> bool:
        """
        Delete a Listing. Verifies ownership of host_id.
        Triggers cascade deletes to dependent tables (Bookings, Reviews, Wishlists).
        """
        listing = self.db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise ListingNotFoundError(listing_id)

        # Enforce host ownership validation check
        if listing.host_id != host_id:
            raise NotOwnerError()

        self.db.delete(listing)
        self.db.commit()
        return True
