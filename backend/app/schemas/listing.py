import datetime
import enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ListingSort(str, enum.Enum):
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"
    RATING = "rating"


class HostSummaryResponse(BaseModel):
    id: int
    full_name: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ListingBase(BaseModel):
    title: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: float = Field(gt=0)
    property_type: str
    max_guests: int = Field(gt=0)
    bedrooms: int = Field(ge=0)
    bathrooms: float = Field(ge=0)
    amenities: List[str] = Field(default_factory=list)
    photos: List[str] = Field(default_factory=list)


class ListingCreate(ListingBase):
    pass


class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: Optional[float] = Field(None, gt=0)
    property_type: Optional[str] = None
    max_guests: Optional[int] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[float] = Field(None, ge=0)
    amenities: Optional[List[str]] = None
    photos: Optional[List[str]] = None


class ListingResponse(ListingBase):
    id: int
    host_id: int
    rating: float
    review_count: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class Listing(ListingResponse):
    pass


class ListingSummaryResponse(BaseModel):
    id: int
    title: str
    location: str
    price_per_night: float
    property_type: str
    rating: float
    review_count: int
    photos: List[str]
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class ListingDetailResponse(BaseModel):
    id: int
    host_id: int
    host: HostSummaryResponse
    title: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: float
    property_type: str
    max_guests: int
    bedrooms: int
    bathrooms: float
    amenities: List[str]
    photos: List[str]
    rating: float
    review_count: int
    created_at: datetime.datetime
    is_available: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


class PaginatedListingResponse(BaseModel):
    items: List[ListingSummaryResponse]
    page: int
    page_size: int
    total: int
    total_pages: int
