import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.api.deps import get_listing_service
from app.services.listing import ListingService
from app.schemas.listing import (
    PaginatedListingResponse,
    ListingDetailResponse,
    HostSummaryResponse,
    ListingSort,
)

router = APIRouter()


@router.get("/", response_model=PaginatedListingResponse)
def get_listings(
    *,
    location: Optional[str] = None,
    check_in: Optional[datetime.date] = None,
    check_out: Optional[datetime.date] = None,
    guests: Optional[int] = Query(None, ge=1),
    property_type: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: Optional[ListingSort] = None,
    listing_service: ListingService = Depends(get_listing_service)
):
    """
    Explore listings with filtering (location, dates, guests, property type, price)
    and custom sorting (price_asc, price_desc, rating, default newest).
    """
    # 1. Validate date ranges if provided
    if (check_in is not None) != (check_out is not None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both check_in and check_out dates must be specified together."
        )
    if check_in and check_out:
        if check_out <= check_in:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="check_out date must be strictly after check_in date."
            )

    # 2. Validate price range constraints
    if min_price is not None and max_price is not None:
        if min_price > max_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="min_price cannot be greater than max_price."
            )

    return listing_service.get_listings(
        location=location,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        property_type=property_type,
        min_price=min_price,
        max_price=max_price,
        page=page,
        page_size=page_size,
        sort_by=sort_by
    )


@router.get("/{id}", response_model=ListingDetailResponse)
def get_listing_by_id(
    id: int,
    check_in: Optional[datetime.date] = None,
    check_out: Optional[datetime.date] = None,
    listing_service: ListingService = Depends(get_listing_service)
):
    """
    Get full details of a listing, including the host information.
    Optionally returns availability if check_in/check_out are supplied.
    """
    # 1. Validate date ranges if provided
    if (check_in is not None) != (check_out is not None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both check_in and check_out dates must be specified together."
        )
    if check_in and check_out:
        if check_out <= check_in:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="check_out date must be strictly after check_in date."
            )

    res = listing_service.get_listing_by_id(
        listing_id=id,
        check_in=check_in,
        check_out=check_out
    )
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Listing with ID {id} not found."
        )

    listing = res["listing"]
    is_available = res["is_available"]

    # Explicit mapping to ListingDetailResponse to guarantee type-safety
    # and restrict host fields from exposing credentials/roles
    return ListingDetailResponse(
        id=listing.id,
        host_id=listing.host_id,
        host=HostSummaryResponse.model_validate(listing.host) if listing.host else None,
        title=listing.title,
        description=listing.description,
        location=listing.location,
        latitude=listing.latitude,
        longitude=listing.longitude,
        price_per_night=listing.price_per_night,
        property_type=listing.property_type,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        bathrooms=listing.bathrooms,
        amenities=listing.amenities,
        photos=listing.photos,
        rating=listing.rating,
        review_count=listing.review_count,
        created_at=listing.created_at,
        is_available=is_available
    )
