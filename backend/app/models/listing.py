import datetime
from typing import TYPE_CHECKING, List, Any, Optional
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime, func, JSON, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.booking import Booking
    from app.models.review import Review
    from app.models.wishlist import Wishlist


class Listing(Base):
    __tablename__ = "listings"
    
    # Database check constraint ensuring price_per_night is strictly positive
    __table_args__ = (
        CheckConstraint("price_per_night > 0", name="chk_price_per_night_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    host_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(2000), nullable=False)
    
    # Frequently queried fields with indexes
    location: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    price_per_night: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    property_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    
    # Capacity attributes
    max_guests: Mapped[int] = mapped_column(Integer, nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False)
    bathrooms: Mapped[float] = mapped_column(Float, nullable=False)
    
    # JSON attributes for flexibility
    amenities: Mapped[Any] = mapped_column(JSON, default=list, nullable=False)
    photos: Mapped[Any] = mapped_column(JSON, default=list, nullable=False)
    
    # Derived fields - Maintained automatically from reviews; must never be edited directly by clients.
    rating: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    host: Mapped["User"] = relationship("User", back_populates="listings")
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking", back_populates="listing", cascade="all, delete-orphan"
    )
    reviews: Mapped[List["Review"]] = relationship(
        "Review", back_populates="listing", cascade="all, delete-orphan"
    )
    wishlists: Mapped[List["Wishlist"]] = relationship(
        "Wishlist", back_populates="listing", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Listing(id={self.id}, title='{self.title[:30]}', host_id={self.host_id}, price_per_night={self.price_per_night})>"
