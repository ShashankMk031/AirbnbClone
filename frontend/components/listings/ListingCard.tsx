import Link from "next/link";
import { ListingSummary } from "../../types/listing";
import WishlistHeartButton from "./WishlistHeartButton";

interface ListingCardProps {
  listing: ListingSummary;
  wishlistId?: number | null;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";

export default function ListingCard({ listing, wishlistId }: ListingCardProps) {
  const displayImage = listing.photos && listing.photos.length > 0
    ? listing.photos[0]
    : PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group cursor-pointer block focus:outline-none"
    >
      <div className="flex flex-col gap-3">
        {/* Aspect ratio image container */}
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 relative shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <WishlistHeartButton listingId={listing.id} initialWishlistId={wishlistId ?? null} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={listing.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {/* Top rated tag if rating is high */}
          {listing.rating >= 4.8 && (
            <div className="absolute top-3 left-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm py-1 px-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm text-zinc-900 dark:text-zinc-100">
              Guest favorite
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-rose-500 transition-colors duration-200 line-clamp-1 flex-1 pr-2">
              {listing.location}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span className="text-rose-500">★</span>
              <span>{listing.rating > 0 ? listing.rating.toFixed(2) : "New"}</span>
              {listing.review_count > 0 && (
                <span className="text-zinc-400 font-normal">({listing.review_count})</span>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
            {listing.title}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {listing.property_type}
          </p>
          <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            ₹{listing.price_per_night.toLocaleString("en-IN")}{" "}
            <span className="font-normal text-zinc-500 text-xs">night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
