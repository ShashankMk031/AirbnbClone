"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ListingDetail } from "../../types/listing";
import { createBooking } from "../../services/bookings";
import { CLEANING_FEE, SERVICE_FEE, MOCK_GUEST_ID } from "../../constants/pricing";

interface BookingWidgetProps {
  listing: ListingDetail;
}

const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

const getDayAfterTomorrowString = () => {
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  return dayAfter.toISOString().split("T")[0];
};

export default function BookingWidget({ listing }: BookingWidgetProps) {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(getTomorrowString());
  const [checkOut, setCheckOut] = useState(getDayAfterTomorrowString());
  const [guests, setGuests] = useState(1);
  
  const [nights, setNights] = useState(1);
  const [subtotal, setSubtotal] = useState(listing.price_per_night);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Recalculate nights and subtotal when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (calculatedNights > 0) {
        setNights(calculatedNights);
        setSubtotal(calculatedNights * listing.price_per_night);
        setErrorMsg(null);
      } else {
        setNights(0);
        setSubtotal(0);
        setErrorMsg("Check-out date must be after check-in date.");
      }
    }
  }, [checkIn, checkOut, listing.price_per_night]);

  const handleGuestsChange = (amount: number) => {
    setGuests(prev => {
      const next = prev + amount;
      if (next < 1) return 1;
      if (next > listing.max_guests) return listing.max_guests;
      return next;
    });
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side Validations before calling API
    if (!checkIn) {
      setErrorMsg("Check-in date is required.");
      return;
    }
    if (!checkOut) {
      setErrorMsg("Check-out date is required.");
      return;
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      setErrorMsg("Please select valid dates.");
      return;
    }
    if (checkOutDate <= checkInDate) {
      setErrorMsg("Check-out date must be after check-in date.");
      return;
    }
    if (nights <= 0) {
      setErrorMsg("Please select a valid duration of at least 1 night.");
      return;
    }
    if (guests < 1) {
      setErrorMsg("Guest count must be at least 1.");
      return;
    }
    if (guests > listing.max_guests) {
      setErrorMsg(`Guest count cannot exceed listing capacity of ${listing.max_guests} guests.`);
      return;
    }    const query = new URLSearchParams({
      listing_id: String(listing.id),
      check_in: checkIn,
      check_out: checkOut,
      guest_count: String(guests),
    });
    router.push(`/checkout?${query.toString()}`);
  };

  if (success) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl bg-white dark:bg-zinc-950 text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
          ✓
        </div>
        <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">Booking Confirmed!</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your reservation is successfully created. Redirecting to your trips...
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl bg-white dark:bg-zinc-950 space-y-6">
      {/* Pricing Header */}
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

      {/* Booking Form inputs */}
      <form onSubmit={handleReserve} className="space-y-4">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
          {/* Check-in / Checkout calendar inputs */}
          <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="p-3">
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-transparent pt-1 focus:outline-none cursor-pointer"
                required
              />
            </div>
            <div className="p-3">
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">
                Checkout
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
                className="w-full text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-transparent pt-1 focus:outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Guest Count Stepper */}
          <div className="p-3 flex justify-between items-center">
            <div>
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-zinc-500">
                Guests
              </span>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 inline-block">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleGuestsChange(-1)}
                disabled={guests <= 1}
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                —
              </button>
              <button
                type="button"
                onClick={() => handleGuestsChange(1)}
                disabled={guests >= listing.max_guests}
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Error message displays */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading || nights <= 0}
          className="w-full bg-[#FF385C] hover:bg-[#E61E4D] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-extrabold text-sm uppercase tracking-wider py-3.5 rounded-2xl transition duration-300 shadow-md flex items-center justify-center disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Reserving...</span>
            </div>
          ) : (
            <span>Reserve Stay</span>
          )}
        </button>
      </form>

      {/* Subtotal Calculation breakdowns */}
      {nights > 0 && (
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
          <div className="flex justify-between">
            <span className="underline">
              ₹{listing.price_per_night.toLocaleString("en-IN")} x {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>₹{CLEANING_FEE.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Service fee</span>
            <span>₹{SERVICE_FEE.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between font-extrabold text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <span>Total before taxes</span>
            <span>₹{(subtotal + CLEANING_FEE + SERVICE_FEE).toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
