import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):
    listing_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1, max_length=1000)


class ReviewCreate(ReviewBase):
    author_id: int


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = Field(None, min_length=1, max_length=1000)


class ReviewResponse(ReviewBase):
    id: int
    author_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class Review(ReviewResponse):
    pass


class PaginatedReviewResponse(BaseModel):
    items: List[ReviewResponse]
    page: int
    page_size: int
    total: int
    total_pages: int
