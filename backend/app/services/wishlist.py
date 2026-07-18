from typing import List, Optional
from sqlalchemy.orm import joinedload
from app.services.base import BaseService
from app.models.wishlist import Wishlist
from app.models.user import User
from app.models.listing import Listing
from app.schemas.wishlist import WishlistCreate


# --- Exceptions ---

class WishlistServiceException(Exception):
    pass


class WishlistUserNotFoundError(WishlistServiceException):
    def __init__(self, user_id: int):
        super().__init__(f"User with ID {user_id} not found.")


class WishlistListingNotFoundError(WishlistServiceException):
    def __init__(self, listing_id: int):
        super().__init__(f"Listing with ID {listing_id} not found.")


class WishlistDuplicateError(WishlistServiceException):
    def __init__(self, user_id: int, listing_id: int):
        super().__init__(f"Listing {listing_id} is already in User {user_id}'s wishlist.")


class WishlistNotFoundError(WishlistServiceException):
    def __init__(self, wishlist_id: int):
        super().__init__(f"Wishlist entry with ID {wishlist_id} not found.")


# --- Wishlist Service Implementation ---

class WishlistService(BaseService):
    def create_wishlist(self, wishlist_in: WishlistCreate) -> Wishlist:
        """
        Add a listing to a user's wishlist.
        Validates that both the user and listing exist, and prevents duplicates.
        """
        # 1. Validate user exists
        user_exists = self.db.query(User).filter(User.id == wishlist_in.user_id).first()
        if not user_exists:
            raise WishlistUserNotFoundError(wishlist_in.user_id)

        # 2. Validate listing exists
        listing_exists = self.db.query(Listing).filter(Listing.id == wishlist_in.listing_id).first()
        if not listing_exists:
            raise WishlistListingNotFoundError(wishlist_in.listing_id)

        # 3. Prevent duplicate wishlist entries
        duplicate = (
            self.db.query(Wishlist)
            .filter(
                Wishlist.user_id == wishlist_in.user_id,
                Wishlist.listing_id == wishlist_in.listing_id
            )
            .first()
        )
        if duplicate:
            raise WishlistDuplicateError(wishlist_in.user_id, wishlist_in.listing_id)

        # 4. Create and save wishlist entry
        db_wishlist = Wishlist(
            user_id=wishlist_in.user_id,
            listing_id=wishlist_in.listing_id
        )
        self.db.add(db_wishlist)
        self.db.commit()
        self.db.refresh(db_wishlist)
        return db_wishlist

    def delete_wishlist(self, wishlist_id: int) -> bool:
        """
        Remove a wishlist entry by ID.
        """
        db_wishlist = self.db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
        if not db_wishlist:
            raise WishlistNotFoundError(wishlist_id)

        self.db.delete(db_wishlist)
        self.db.commit()
        return True

    def get_user_wishlist(self, user_id: int) -> List[Listing]:
        """
        Get the list of listings in a user's wishlist, sorted newest first
        by the time they were added to the wishlist.
        """
        # 1. Validate user exists
        user_exists = self.db.query(User).filter(User.id == user_id).first()
        if not user_exists:
            raise WishlistUserNotFoundError(user_id)

        # 2. Query wishlists with listing preloaded in a single join query
        wishlist_entries = (
            self.db.query(Wishlist)
            .options(joinedload(Wishlist.listing))
            .filter(Wishlist.user_id == user_id)
            .order_by(Wishlist.created_at.desc())
            .all()
        )

        return [entry.listing for entry in wishlist_entries if entry.listing]
