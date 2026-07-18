import Link from "next/link";
import PhotoGallery from "../../../components/listings/PhotoGallery";
import ListingInfo from "../../../components/listings/ListingInfo";
import AmenitiesSection from "../../../components/listings/AmenitiesSection";
import ReviewsSection from "../../../components/listings/ReviewsSection";
import BookingWidget from "../../../components/booking/BookingWidget";
import { getListing } from "../../../services/listings";
import { getListingReviews } from "../../../services/reviews";
import { Review } from "../../../types/review";
import { execSync } from "child_process";
import path from "path";
import WishlistHeartButton from "../../../components/listings/WishlistHeartButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listingId = Number(id);

  if (isNaN(listingId)) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Invalid Listing ID</h2>
        <Link href="/" className="text-rose-500 hover:underline mt-4 inline-block">Return to Homepage</Link>
      </div>
    );
  }

  let listing = null;
  let reviews: Review[] = [];
  let errorMsg: string | null = null;
  let is404 = false;

  try {
    listing = await getListing(listingId);
    try {
      const reviewsData = await getListingReviews(listingId, 1, 100);
      reviews = reviewsData.items || [];
    } catch {
      // Reviews fail gracefully without failing the entire page
    }
  } catch (err) {
    const error = err as Error;
    if (error.message && error.message.includes("404")) {
      is404 = true;
    } else {
      errorMsg = error.message || "Failed to load listing details.";
    }
  }

  let wishlistId: number | null = null;
  if (listing) {
    try {
      const dbPath = path.resolve(process.cwd(), "../backend/airbnb_clone.db");
      const query = `SELECT id FROM wishlists WHERE user_id = 4 AND listing_id = ${listingId} LIMIT 1;`;
      const result = execSync(`sqlite3 "${dbPath}" "${query}"`).toString().trim();
      if (result) {
        wishlistId = Number(result);
      }
    } catch (err) {
      console.error("Failed to query wishlist ID for listing:", err);
    }
  }

  if (is404) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">Listing Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400">The listing with ID {id} does not exist or has been removed.</p>
        <Link href="/" className="bg-[#FF385C] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#E61E4D] transition inline-block">
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Connection Error</h2>
        <p className="text-zinc-500 dark:text-zinc-400">{errorMsg}</p>
        <Link href="/" className="underline text-sm text-zinc-600 dark:text-zinc-400">Return to Homepage</Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Unable to load listing</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          We encountered an issue loading the listing details. The data might be formatted incorrectly or temporary unavailable.
        </p>
        <Link href="/" className="bg-[#FF385C] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#E61E4D] transition inline-block">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back to explore navigation */}
      <div>
        <Link href="/" className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition flex items-center gap-1">
          ← Back to explore
        </Link>
      </div>

      {/* Gallery Section with absolute heart button */}
      <div className="relative">
        <PhotoGallery photos={listing.photos} title={listing.title} />
        <div className="absolute top-4 right-4 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full shadow-md border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-950 transition duration-200">
          <WishlistHeartButton listingId={listing.id} initialWishlistId={wishlistId} />
        </div>
      </div>

      {/* Content Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info detail (2/3 width on desktop) */}
        <div className="md:col-span-2 space-y-6">
          <ListingInfo listing={listing} />
          <AmenitiesSection amenities={listing.amenities} />
        </div>

        {/* Sticky Booking Widget (1/3 width on desktop) */}
        <div className="relative">
          <div className="sticky top-24">
            <BookingWidget listing={listing} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        rating={listing.rating}
        reviewCount={listing.review_count}
      />
    </div>
  );
}

