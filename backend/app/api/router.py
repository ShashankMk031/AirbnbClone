from fastapi import APIRouter
from app.api.endpoints import auth, listings, bookings, reviews, wishlists

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(listings.router, prefix="/listings", tags=["Listings"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(wishlists.router, prefix="/wishlists", tags=["Wishlists"])
