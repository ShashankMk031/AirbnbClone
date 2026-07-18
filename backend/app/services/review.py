import math
from typing import Dict, Any
from app.services.base import BaseService
from app.models.review import Review
from app.models.user import User
from app.models.listing import Listing
from app.schemas.review import ReviewCreate


# --- Exceptions ---

class ReviewServiceException(Exception):
    pass


class ReviewAuthorNotFoundError(ReviewServiceException):
    def __init__(self, author_id: int):
        super().__init__(f"Author with ID {author_id} not found.")


class ReviewListingNotFoundError(ReviewServiceException):
    def __init__(self, listing_id: int):
        super().__init__(f"Listing with ID {listing_id} not found.")


class ReviewDuplicateError(ReviewServiceException):
    def __init__(self, author_id: int, listing_id: int):
        super().__init__(f"Author {author_id} has already reviewed listing {listing_id}.")


# --- Review Service Implementation ---

class ReviewService(BaseService):
    def create_review(self, review_in: ReviewCreate) -> Review:
        """
        Create a new review for a listing.
        Validates author and listing, prevents duplicates, and updates listing aggregates.
        """
        # 1. Validate author exists
        author = self.db.query(User).filter(User.id == review_in.author_id).first()
        if not author:
            raise ReviewAuthorNotFoundError(review_in.author_id)

        # 2. Validate listing exists
        listing = self.db.query(Listing).filter(Listing.id == review_in.listing_id).first()
        if not listing:
            raise ReviewListingNotFoundError(review_in.listing_id)

        # 3. Prevent duplicate reviews (UniqueConstraint check)
        duplicate = (
            self.db.query(Review)
            .filter(
                Review.author_id == review_in.author_id,
                Review.listing_id == review_in.listing_id
            )
            .first()
        )
        if duplicate:
            raise ReviewDuplicateError(review_in.author_id, review_in.listing_id)

        # 4. Create and save review
        db_review = Review(
            listing_id=review_in.listing_id,
            author_id=review_in.author_id,
            rating=review_in.rating,
            comment=review_in.comment
        )
        self.db.add(db_review)
        self.db.flush()

        # 5. Automatically recompute listing.review_count and listing.rating
        reviews = self.db.query(Review).filter(Review.listing_id == review_in.listing_id).all()
        review_count = len(reviews)
        total_rating = sum(r.rating for r in reviews)
        average_rating = round(total_rating / review_count, 2) if review_count > 0 else 0.0

        listing.review_count = review_count
        listing.rating = average_rating

        self.db.commit()
        self.db.refresh(db_review)
        return db_review

    def get_listing_reviews(
        self,
        listing_id: int,
        page: int = 1,
        page_size: int = 10
    ) -> Dict[str, Any]:
        """
        Retrieve reviews for a listing sorted newest first, with pagination.
        """
        # Validate listing exists
        listing = self.db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            raise ReviewListingNotFoundError(listing_id)

        query = (
            self.db.query(Review)
            .filter(Review.listing_id == listing_id)
            .order_by(Review.created_at.desc())
        )

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
