import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from app.api.deps import get_listing_service, get_review_service
from app.services.listing import (
    ListingService,
    ListingNotFoundError,
    HostNotFoundError,
    NotOwnerError,
)
from app.services.review import ReviewService, ReviewListingNotFoundError
from app.schemas.review import PaginatedReviewResponse
from app.schemas.listing import (
    PaginatedListingResponse,
    ListingDetailResponse,
    ListingSummaryResponse,
    HostSummaryResponse,
    ListingSort,
    ListingCreate,
    ListingUpdate,
)

router = APIRouter()


def _map_to_detail_response(listing, is_available: Optional[bool] = None) -> ListingDetailResponse:
    """
    Helper function to explicitly construct and map ListingDetailResponse
    without dynamically mutating the ORM model objects.
    """
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
    host_id: Optional[int] = Query(None, description="Filter listings by host ID"),
    listing_service: ListingService = Depends(get_listing_service)
):
    """
    Explore listings with filtering (location, dates, guests, property type, price)
    and custom sorting (price_asc, price_desc, rating, default newest).
    Explicitly maps database models to ListingSummaryResponse objects.
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

    result = listing_service.get_listings(
        location=location,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        property_type=property_type,
        min_price=min_price,
        max_price=max_price,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        host_id=host_id
    )

    # Explicitly map items into ListingSummaryResponse
    items_mapped = [
        ListingSummaryResponse.model_validate(item) for item in result["items"]
    ]

    return PaginatedListingResponse(
        items=items_mapped,
        page=result["page"],
        page_size=result["page_size"],
        total=result["total"],
        total_pages=result["total_pages"]
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

    return _map_to_detail_response(res["listing"], res["is_available"])


@router.post("/", response_model=ListingDetailResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    *,
    listing_in: ListingCreate,
    listing_service: ListingService = Depends(get_listing_service)
):
    """
    Create a new listing. Verifies that the host_id exists.
    """
    try:
        db_listing = listing_service.create_listing(listing_in)
        return _map_to_detail_response(db_listing)
    except HostNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.put("/{id}", response_model=ListingDetailResponse)
def update_listing(
    id: int,
    *,
    host_id: int = Query(..., description="The ID of the host trying to modify the listing"),
    listing_in: ListingUpdate,
    listing_service: ListingService = Depends(get_listing_service)
):
    """
    Update a listing. Supports partial updates and restricts access to owners only.
    """
    try:
        updated_listing = listing_service.update_listing(
            listing_id=id,
            host_id=host_id,
            listing_in=listing_in
        )
        return _map_to_detail_response(updated_listing)
    except ListingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except NotOwnerError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    id: int,
    *,
    host_id: int = Query(..., description="The ID of the host trying to delete the listing"),
    listing_service: ListingService = Depends(get_listing_service)
):
    """
    Delete a listing. Cascades deletes cleanly to dependent tables.
    Restricts access to owners only.
    """
    try:
        listing_service.delete_listing(listing_id=id, host_id=host_id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except ListingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except NotOwnerError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )


@router.get("/{id}/reviews", response_model=PaginatedReviewResponse)
def get_listing_reviews(
    id: int,
    *,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    review_service: ReviewService = Depends(get_review_service)
):
    """
    Retrieve reviews for a listing sorted newest first, with pagination.
    """
    try:
        return review_service.get_listing_reviews(
            listing_id=id,
            page=page,
            page_size=page_size
        )
    except ReviewListingNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
