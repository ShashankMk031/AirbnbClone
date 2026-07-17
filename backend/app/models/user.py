import datetime
import enum
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.listing import Listing
    from app.models.booking import Booking
    from app.models.review import Review
    from app.models.wishlist import Wishlist


class UserRole(str, enum.Enum):
    HOST = "HOST"
    GUEST = "GUEST"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.GUEST, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    listings: Mapped[List["Listing"]] = relationship(
        "Listing", back_populates="host", cascade="all, delete-orphan"
    )
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking", back_populates="guest", cascade="all, delete-orphan"
    )
    reviews: Mapped[List["Review"]] = relationship(
        "Review", back_populates="author", cascade="all, delete-orphan"
    )
    wishlists: Mapped[List["Wishlist"]] = relationship(
        "Wishlist", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
