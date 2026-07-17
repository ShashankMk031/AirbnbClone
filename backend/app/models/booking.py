import datetime
import enum
from typing import TYPE_CHECKING
from sqlalchemy import Date, Float, Integer, ForeignKey, DateTime, func, Enum, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.listing import Listing
    from app.models.user import User


class BookingStatus(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"


class Booking(Base):
    __tablename__ = "bookings"
    
    # Database check constraint ensuring guest_count is strictly positive
    __table_args__ = (
        CheckConstraint("guest_count > 0", name="chk_guest_count_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), index=True, nullable=False)
    guest_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    
    check_in: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    check_out: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    guest_count: Mapped[int] = mapped_column(Integer, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus), default=BookingStatus.CONFIRMED, nullable=False
    )
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="bookings")
    guest: Mapped["User"] = relationship("User", back_populates="bookings")

    def __repr__(self) -> str:
        return f"<Booking(id={self.id}, listing_id={self.listing_id}, guest_id={self.guest_id}, check_in='{self.check_in}', check_out='{self.check_out}', status='{self.status}')>"
