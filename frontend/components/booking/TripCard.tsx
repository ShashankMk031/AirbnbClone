import Image from "next/image";
import Link from "next/link";
import { BookingWithListing } from "../../types/booking";
import CancelBookingButton from "./CancelBookingButton";

interface TripCardProps {
  booking: BookingWithListing;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";

export default function TripCard({ booking }: TripCardProps) {
  const listing = booking.listing;
  const displayImage = listing && listing.photos && listing.photos.length > 0
    ? listing.photos[0]
    : PLACEHOLDER_IMAGE;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-shadow duration-300">
      {/* Listing Thumbnail */}
      <Link href={`/listings/${listing.id}`} className="relative aspect-[4/3] w-full sm:w-44 h-32 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-900 group">
        <Image
          src={displayImage}
          alt={listing.title}
          fill
          sizes="(max-w-7xl) 176px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-350"
        />
      </Link>

      {/* Information detail & Cancel Actions */}
      <div className="flex-1 flex flex-col justify-between py-1 space-y-3 sm:space-y-0">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/listings/${listing.id}`} className="hover:text-rose-500 transition-colors duration-200">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 line-clamp-1">
                {listing.title}
              </h3>
            </Link>
            <span
              className={`px-2 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                booking.status === "CONFIRMED"
                  ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
              }`}
            >
              {booking.status}
            </span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {listing.location}
          </p>
        </div>

        {/* Stay Details info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Check-in:</span> {formatDate(booking.check_in)}
          </div>
          <div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Check-out:</span> {formatDate(booking.check_out)}
          </div>
          <div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Guests:</span> {booking.guest_count} {booking.guest_count === 1 ? "guest" : "guests"}
          </div>
          <div>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Total Paid:</span> ₹{booking.total_price.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Cancellation client control */}
        <div className="pt-2 sm:pt-0 self-end sm:self-auto">
          <CancelBookingButton bookingId={booking.id} status={booking.status} />
        </div>
      </div>
    </div>
  );
}
