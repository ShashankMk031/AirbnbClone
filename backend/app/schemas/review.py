import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):
    listing_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1, max_length=1000)


class ReviewCreate(ReviewBase):
    pass


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
