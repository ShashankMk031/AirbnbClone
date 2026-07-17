import datetime
from typing import Optional
from app.services.base import BaseService
from app.models.booking import Booking, BookingStatus


class AvailabilityService(BaseService):
    def check_date_range_overlap(
        self,
        listing_id: int,
        check_in: datetime.date,
        check_out: datetime.date,
        exclude_booking_id: Optional[int] = None,
    ) -> bool:
        """
        Query all bookings for the given listing_id with status == CONFIRMED,
        excluding exclude_booking_id if provided.
        Uses overlap condition: existing.check_in < check_out AND existing.check_out > check_in
        Treats same-day checkout/check-in as non-overlapping (back-to-back bookings allowed).
        Returns True if any conflicting booking exists, else False.
        """
        query = self.db.query(Booking).filter(
            Booking.listing_id == listing_id,
            Booking.status == BookingStatus.CONFIRMED
        )

        if exclude_booking_id is not None:
            query = query.filter(Booking.id != exclude_booking_id)

        # Overlap check
        conflict = query.filter(
            Booking.check_in < check_out,
            Booking.check_out > check_in
        ).first()

        return conflict is not None
