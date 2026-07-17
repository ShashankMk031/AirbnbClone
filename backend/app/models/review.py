import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime, func, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.listing import Listing
    from app.models.user import User


class Review(Base):
    __tablename__ = "reviews"
    
    # Check rating range and ensure a user can review a specific listing only once
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="chk_rating_range"),
        UniqueConstraint("author_id", "listing_id", name="uq_author_listing_review"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), index=True, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(String(1000), nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    listing: Mapped["Listing"] = relationship("Listing", back_populates="reviews")
    author: Mapped["User"] = relationship("User", back_populates="reviews")

    def __repr__(self) -> str:
        return f"<Review(id={self.id}, listing_id={self.listing_id}, author_id={self.author_id}, rating={self.rating})>"
