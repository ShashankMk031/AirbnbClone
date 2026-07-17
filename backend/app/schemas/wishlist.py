import datetime
from pydantic import BaseModel, ConfigDict


class WishlistBase(BaseModel):
    listing_id: int


class WishlistCreate(WishlistBase):
    pass


class WishlistResponse(WishlistBase):
    id: int
    user_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class Wishlist(WishlistResponse):
    pass
