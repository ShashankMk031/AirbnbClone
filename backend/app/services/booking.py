from typing import Optional, List
from sqlalchemy.orm import joinedload
from app.services.base import BaseService
from app.models.booking import Booking, BookingStatus


# --- Exceptions ---

class BookingServiceException(Exception):
    pass


class BookingNotFoundError(BookingServiceException):
    def __init__(self, booking_id: int):
        super().__init__(f"Booking with ID {booking_id} not found.")


class BookingNotOwnerError(BookingServiceException):
    def __init__(self):
        super().__init__("Only the booking owner may cancel this booking.")


class BookingStatusError(BookingServiceException):
    def __init__(self, message: str):
        super().__init__(message)


# --- Booking Service Implementation ---

class BookingService(BaseService):
    def get_booking_by_id(self, booking_id: int) -> Optional[Booking]:
        """
        Retrieve a single booking by ID with its listing preloaded.
        """
        return (
            self.db.query(Booking)
            .options(joinedload(Booking.listing))
            .filter(Booking.id == booking_id)
            .first()
        )

    def get_user_bookings(self, user_id: int) -> List[Booking]:
        """
        Retrieve booking history for a specific guest, sorted newest first,
        with listing summaries preloaded to prevent N+1 queries.
        """
        return (
            self.db.query(Booking)
            .options(joinedload(Booking.listing))
            .filter(Booking.guest_id == user_id)
            .order_by(Booking.created_at.desc())
            .all()
        )

    def cancel_booking(self, booking_id: int, guest_id: int) -> Booking:
        """
        Cancel a booking. Verifies ownership of guest_id and checks
        if the booking is currently CONFIRMED.
        """
        booking = self.db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise BookingNotFoundError(booking_id)

        # Enforce guest ownership check
        if booking.guest_id != guest_id:
            raise BookingNotOwnerError()

        # Enforce that only CONFIRMED bookings may be cancelled
        if booking.status != BookingStatus.CONFIRMED:
            raise BookingStatusError(
                f"Cannot cancel booking with status {booking.status}. Only CONFIRMED bookings can be cancelled."
            )

        booking.status = BookingStatus.CANCELLED
        self.db.commit()
        self.db.refresh(booking)
        return booking
