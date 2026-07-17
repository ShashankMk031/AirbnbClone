import datetime
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.listing import Listing
    from app.models.user import User


class Wishlist(Base):
    __tablename__ = "wishlists"
    
    # Enforcing unique constraint on user_id and listing_id
    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="uq_user_listing"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Frequently queried foreign keys with indexes
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), index=True, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="wishlists")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="wishlists")

    def __repr__(self) -> str:
        return f"<Wishlist(id={self.id}, user_id={self.user_id}, listing_id={self.listing_id})>"
