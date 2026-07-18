from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.api.deps import get_wishlist_service
from app.services.wishlist import (
    WishlistService,
    WishlistUserNotFoundError,
    WishlistListingNotFoundError,
    WishlistDuplicateError,
    WishlistNotFoundError,
)
from app.schemas.wishlist import WishlistCreate, WishlistResponse

router = APIRouter()


@router.post("/", response_model=WishlistResponse, status_code=status.HTTP_201_CREATED)
def create_wishlist(
    *,
    wishlist_in: WishlistCreate,
    wishlist_service: WishlistService = Depends(get_wishlist_service)
):
    """
    Add a listing to user's wishlist.
    Validates existence of user and listing, and prevents duplicates.
    """
    try:
        db_wishlist = wishlist_service.create_wishlist(wishlist_in)
        return db_wishlist
    except (WishlistUserNotFoundError, WishlistListingNotFoundError) as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except WishlistDuplicateError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wishlist(
    id: int,
    wishlist_service: WishlistService = Depends(get_wishlist_service)
):
    """
    Remove a wishlist entry.
    """
    try:
        wishlist_service.delete_wishlist(id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except WishlistNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
