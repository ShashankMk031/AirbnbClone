import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator
from app.models.booking import BookingStatus


class BookingBase(BaseModel):
    listing_id: int
    check_in: datetime.date
    check_out: datetime.date
    guest_count: int = Field(gt=0)

    @model_validator(mode="after")
    def validate_dates(self) -> "BookingBase":
        if self.check_out <= self.check_in:
            raise ValueError("check_out date must be after check_in date")
        return self


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    check_in: Optional[datetime.date] = None
    check_out: Optional[datetime.date] = None
    guest_count: Optional[int] = Field(None, gt=0)

    @model_validator(mode="after")
    def validate_dates(self) -> "BookingUpdate":
        if self.check_in is not None and self.check_out is not None:
            if self.check_out <= self.check_in:
                raise ValueError("check_out date must be after check_in date")
        return self


class BookingResponse(BookingBase):
    id: int
    guest_id: int
    total_price: float
    status: BookingStatus
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class Booking(BookingResponse):
    pass
