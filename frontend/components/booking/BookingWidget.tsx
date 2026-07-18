import { ListingDetail } from "../../types/listing";

interface BookingWidgetProps {
  listing: ListingDetail;
}

export default function BookingWidget({ listing }: BookingWidgetProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl bg-white dark:bg-zinc-950 space-y-6">
      {/* Price / reviews header */}
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            ₹{listing.price_per_night.toLocaleString("en-IN")}
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 text-xs"> night</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
          <span>★ {listing.rating > 0 ? listing.rating.toFixed(2) : "New"}</span>
          {listing.review_count > 0 && (
            <>
              <span className="text-zinc-400">•</span>
              <span className="underline font-normal text-zinc-500">
                {listing.review_count} {listing.review_count === 1 ? "review" : "reviews"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Placeholder form inputs */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="p-3">
            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">
              Check-in
            </span>
            <input
              type="date"
              className="w-full text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-transparent pt-1 cursor-not-allowed focus:outline-none"
              disabled
              defaultValue="2026-07-20"
            />
          </div>
          <div className="p-3">
            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">
              Checkout
            </span>
            <input
              type="date"
              className="w-full text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-transparent pt-1 cursor-not-allowed focus:outline-none"
              disabled
              defaultValue="2026-07-25"
            />
          </div>
        </div>
        <div className="p-3">
          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">
            Guests
          </span>
          <select
            className="w-full text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-transparent pt-1 cursor-not-allowed focus:outline-none appearance-none"
            disabled
          >
            <option>2 guests</option>
          </select>
        </div>
      </div>

      {/* Coming soon reserve button */}
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="w-full bg-[#FF385C] disabled:bg-zinc-400 text-white font-extrabold text-sm uppercase tracking-wider py-3.5 rounded-2xl transition duration-300 shadow-md flex flex-col items-center justify-center cursor-not-allowed"
        >
          <span>Reserve Stay</span>
          <span className="text-[9px] opacity-75 mt-0.5 lowercase">coming soon</span>
        </button>
        <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
          Booking submission is disabled in placeholder
        </p>
      </div>

      {/* Summary calculation display */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
        <div className="flex justify-between">
          <span className="underline">₹{listing.price_per_night.toLocaleString("en-IN")} x 5 nights</span>
          <span>₹{(listing.price_per_night * 5).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Cleaning fee</span>
          <span>₹1,500</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Service fee</span>
          <span>₹1,200</span>
        </div>
        <div className="flex justify-between font-extrabold text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <span>Total before taxes</span>
          <span>₹{(listing.price_per_night * 5 + 1500 + 1200).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
