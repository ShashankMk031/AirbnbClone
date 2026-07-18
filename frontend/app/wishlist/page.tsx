import Link from "next/link";
import ListingGrid from "../../components/listings/ListingGrid";
import { getUserWishlist, getUserWishlistIds } from "../../services/wishlist";
import { WishlistListing } from "../../types/wishlist";
import RoleGuard from "../../components/common/RoleGuard";

export default async function WishlistPage() {
  let listings: WishlistListing[] = [];
  let errorMsg = null;
  let wishlistMap: Record<number, number> = {};

  try {
    // 1. Fetch user wishlists from API (mock user ID 4)
    listings = await getUserWishlist(4);

    // 2. Fetch the mapping from listing_id -> wishlist_id from API (mock user ID 4)
    try {
      wishlistMap = await getUserWishlistIds(4);
    } catch (err) {
      console.error("Failed to fetch wishlist ids mapping:", err);
    }
  } catch (err: any) {
    errorMsg = err.message || "Failed to load wishlist details.";
  }

  return (
    <RoleGuard allowedRole="guest">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Info */}
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-55 tracking-tight">
            Wishlists
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1.5">
            Your saved listings and future dream destination stays.
          </p>
        </div>

        {/* Fallback States handler */}
        {errorMsg ? (
          <div className="w-full text-center py-16 px-4 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <h3 className="text-lg font-bold">Failed to load wishlist</h3>
            <p className="text-sm mt-1 max-w-md mx-auto opacity-90">
              {errorMsg}. Make sure the FastAPI backend server is running and try again.
            </p>
          </div>
        ) : listings.length === 0 ? (
          <div className="w-full text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="text-6xl" role="img" aria-label="broken heart">💔</div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Your wishlist is empty</h3>
              <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-sm mx-auto">
                Save your favorite properties by clicking the heart icon on search listings.
              </p>
            </div>
            <Link
              href="/"
              className="bg-[#FF385C] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl hover:bg-[#E61E4D] transition inline-block shadow-sm"
            >
              Explore Stays
            </Link>
          </div>
        ) : (
          <ListingGrid listings={listings} wishlistMap={wishlistMap} />
        )}
      </div>
    </RoleGuard>
  );
}
