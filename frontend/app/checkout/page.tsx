"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getListing } from "../../services/listings";
import { createBooking } from "../../services/bookings";
import { ListingDetail } from "../../types/listing";
import { CLEANING_FEE, SERVICE_FEE, MOCK_GUEST_ID } from "../../constants/pricing";
import RoleGuard from "../../components/common/RoleGuard";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const listingIdRaw = searchParams.get("listing_id");
  const checkIn = searchParams.get("check_in") || "";
  const checkOut = searchParams.get("check_out") || "";
  const guestCountRaw = searchParams.get("guest_count") || "1";

  const listingId = listingIdRaw ? Number(listingIdRaw) : NaN;
  const guestCount = Number(guestCountRaw);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  // Form Fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState(""); // Stores raw formatted: "1234 5678 1234 5678"
  const [isCardFocused, setIsCardFocused] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 1. Missing parameter validation and automatic redirect
  useEffect(() => {
    if (!listingIdRaw || !checkIn || !checkOut) {
      setListingError("Required booking parameters are missing. Redirecting to homepage...");
      setLoadingListing(false);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Past date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setListingError("Invalid booking dates provided. Redirecting to homepage...");
      setLoadingListing(false);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    const startCompare = new Date(checkIn);
    startCompare.setHours(0, 0, 0, 0);

    const endCompare = new Date(checkOut);
    endCompare.setHours(0, 0, 0, 0);

    if (startCompare < today) {
      setListingError("Check-in date cannot be in the past. Redirecting to homepage...");
      setLoadingListing(false);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (endCompare < today) {
      setListingError("Check-out date cannot be in the past. Redirecting to homepage...");
      setLoadingListing(false);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (endCompare <= startCompare) {
      setListingError("Check-out date must be after check-in date. Redirecting to homepage...");
      setLoadingListing(false);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [listingIdRaw, checkIn, checkOut, router]);

  // 2. Fetch listing details on load
  useEffect(() => {
    if (!listingIdRaw || !checkIn || !checkOut || isNaN(listingId)) {
      return;
    }

    getListing(listingId)
      .then((data) => {
        setListing(data);
        setLoadingListing(false);
      })
      .catch((err) => {
        setListingError(err.message || "Failed to load property details.");
        setLoadingListing(false);
      });
  }, [listingId, listingIdRaw, checkIn, checkOut]);

  // Calculate duration
  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Masking display logic
  const getMaskedCardNumber = (val: string) => {
    return val.replace(/\d/g, (char, index) => {
      // Spaces sit at indices 4, 9, 14. Bullet mask everything before the last block
      return index < 14 ? "•" : char;
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setErrorMsg(null);

    // Demo-only validation — only requires non-empty fields
    const errors: Record<string, string> = {};

    if (!cardName.trim()) {
      errors.cardName = "Demo Cardholder Name is required.";
    }
    if (!cardNumber.trim()) {
      errors.cardNumber = "Demo Card Number is required.";
    }
    if (!expiry.trim()) {
      errors.expiry = "Demo Expiry is required.";
    }
    if (!cvv.trim()) {
      errors.cvv = "Demo CVV is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setPaymentLoading(true);

    // Wait 2 seconds for payment animation/spinner
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await createBooking(
        {
          listing_id: listingId,
          check_in: checkIn,
          check_out: checkOut,
          guest_count: guestCount,
        },
        MOCK_GUEST_ID
      );

      setSuccess(true);
      setPaymentLoading(false);

      // Wait 1.5 seconds on success screen then redirect to trips
      setTimeout(() => {
        router.replace("/trips");
      }, 1500);
    } catch (err: any) {
      setPaymentLoading(false);
      const message = err.message || "";
      if (message.includes("409") || message.toLowerCase().includes("overlap")) {
        setErrorMsg("These dates are no longer available.");
      } else if (
        message.toLowerCase().includes("connect") ||
        message.toLowerCase().includes("fetch") ||
        message.toLowerCase().includes("http error 50") ||
        message.toLowerCase().includes("network")
      ) {
        setErrorMsg("Unable to connect to the server. Please try again.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  if (loadingListing) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#FF385C]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-zinc-500">Loading checkout info...</span>
        </div>
      </div>
    );
  }

  if (listingError || !listing) {
    return (
      <div className="max-w-md mx-auto my-12 text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl space-y-4">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-rose-500">Checkout Error</h2>
        <p className="text-sm text-zinc-550 dark:text-zinc-400">
          {listingError || "Unable to display reservation details."}
        </p>
        <Link href="/" className="inline-block bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition shadow-md">
          Return to Explore
        </Link>
      </div>
    );
  }

  const subtotal = nights * listing.price_per_night;
  const total = subtotal + CLEANING_FEE + SERVICE_FEE;

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
            ✓
          </div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Demo Booking Confirmed!</h3>
          <p className="text-sm text-zinc-555 dark:text-zinc-400 leading-relaxed">
            Your demo booking has been recorded. No real payment was processed. Redirecting to your trips...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Demo Disclaimer Banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-4">
        <span className="text-blue-500 text-xl mt-0.5" aria-hidden="true">ℹ️</span>
        <div className="space-y-1">
          <p className="text-sm font-extrabold text-blue-800 dark:text-blue-300">Demo Checkout — No Real Payment</p>
          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
            This is an educational project. Payments are completely simulated and no real transaction is processed.
            <strong> Do NOT enter real credit or debit card information.</strong> Any demo values may be used.
          </p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
        Demo Checkout
      </h1>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Trip Overview */}
        <div className="space-y-6">
          {/* Property Short Summary Card */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm flex items-start gap-4">
            <div className="w-24 h-20 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.photos && listing.photos.length > 0 ? listing.photos[0] : ""}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                {listing.property_type}
              </span>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 line-clamp-1">
                {listing.title}
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400">{listing.location}</p>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                ★ {listing.rating > 0 ? listing.rating.toFixed(2) : "New"}{" "}
                <span className="text-zinc-400 font-normal">({listing.review_count} reviews)</span>
              </div>
            </div>
          </div>

          {/* Trip details card */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-55 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              Your trip details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50 block">Dates</span>
                  <span className="text-zinc-550 dark:text-zinc-400 text-xs">
                    {checkIn} to {checkOut} ({nights} nights)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50 block">Guests</span>
                  <span className="text-zinc-555 dark:text-zinc-400 text-xs">
                    {guestCount} {guestCount === 1 ? "guest" : "guests"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Payment fields */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-55 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              Demo Payment Details
            </h2>
            <form onSubmit={handlePay} className="space-y-4 text-xs">
              {/* Demo Holder Name */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Demo Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Demo User"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-950 border py-2.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                    validationErrors.cardName ? "border-rose-500" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                  disabled={paymentLoading}
                  required
                />
                {validationErrors.cardName && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {validationErrors.cardName}
                  </span>
                )}
              </div>

              {/* Demo Card Number */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Demo Card Number
                </label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="1111 2222 3333 4444"
                  value={isCardFocused ? cardNumber : getMaskedCardNumber(cardNumber)}
                  onFocus={() => setIsCardFocused(true)}
                  onBlur={() => setIsCardFocused(false)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const matches = val.match(/\d{4,16}/g);
                    const match = (matches && matches[0]) || "";
                    const parts = [];
                    for (let i = 0, len = match.length; i < len; i += 4) {
                      parts.push(match.substring(i, i + 4));
                    }
                    if (parts.length > 0) {
                      setCardNumber(parts.join(" "));
                    } else {
                      setCardNumber(val);
                    }
                  }}
                  className={`w-full bg-white dark:bg-zinc-950 border py-2.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                    validationErrors.cardNumber ? "border-rose-500" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                  disabled={paymentLoading}
                  required
                />
                {validationErrors.cardNumber && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {validationErrors.cardNumber}
                  </span>
                )}
              </div>

              {/* Demo Expiry & Demo CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Demo Expiry
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/30"
                    value={expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) {
                        val = val.substring(0, 2) + "/" + val.substring(2, 4);
                      }
                      setExpiry(val);
                    }}
                    className={`w-full bg-white dark:bg-zinc-950 border py-2.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                      validationErrors.expiry ? "border-rose-500" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                    disabled={paymentLoading}
                    required
                  />
                  {validationErrors.expiry && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {validationErrors.expiry}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Demo CVV
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    className={`w-full bg-white dark:bg-zinc-950 border py-2.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                      validationErrors.cvv ? "border-rose-500" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                    disabled={paymentLoading}
                    required
                  />
                  {validationErrors.cvv && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {validationErrors.cvv}
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Error Response banner */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
                  {errorMsg}
                </div>
              )}

              {/* Demo Submit Button */}
              <button
                type="submit"
                disabled={paymentLoading || nights <= 0}
                className="w-full bg-[#FF385C] hover:bg-[#E61E4D] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-extrabold text-sm uppercase tracking-wider py-3.5 rounded-2xl transition duration-300 shadow-md flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Simulating Booking...</span>
                  </div>
                ) : (
                  <span>Complete Demo Booking</span>
                )}
              </button>

              {/* Disclaimer note */}
              <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                No payment is processed. This page exists only to demonstrate the booking workflow.
                No card information is stored.
              </p>
            </form>
          </div>
        </div>

        {/* Right Column: Pricing Summary Card */}
        <div className="relative">
          <div className="sticky top-24 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-lg bg-white dark:bg-zinc-950 space-y-6">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-55 border-b border-zinc-150 dark:border-zinc-900 pb-3">
              Price details
            </h2>

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
              <div className="flex justify-between">
                <span>
                  ₹{listing.price_per_night.toLocaleString("en-IN")} x {nights} {nights === 1 ? "night" : "nights"}
                </span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>₹{CLEANING_FEE.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>₹{SERVICE_FEE.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between font-extrabold text-zinc-900 dark:text-zinc-150 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-base">
                <span>Total before taxes</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RoleGuard allowedRole="guest">
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-[#FF385C]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-semibold text-zinc-550">Loading checkout info...</span>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </RoleGuard>
  );
}
