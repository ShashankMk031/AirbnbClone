import datetime
import math
from typing import Optional, List, Dict, Any
# pyrefly: ignore [missing-import]
from sqlalchemy import exists
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import joinedload
from app.services.base import BaseService
from app.models.listing import Listing
from app.models.booking import Booking, BookingStatus
from app.schemas.listing import ListingSort


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
