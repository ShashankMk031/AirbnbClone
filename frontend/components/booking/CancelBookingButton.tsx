"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "../../services/bookings";

interface CancelBookingButtonProps {
  bookingId: number;
  status: "CONFIRMED" | "CANCELLED" | string;
}

export default function CancelBookingButton({ bookingId, status }: CancelBookingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (status !== "CONFIRMED") {
    return (
      <span className="inline-block px-4 py-2 text-xs font-extrabold uppercase tracking-wider bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 rounded-xl cursor-not-allowed">
        Cancelled
      </span>
    );
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Mock guest Rohan Das (ID 4) as the guest context
      await cancelBooking(bookingId, 4);
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      const message = err.message || "";
      if (message.includes("403")) {
        setErrorMsg("You are not authorized to cancel this booking.");
      } else if (message.includes("409")) {
        setErrorMsg("This booking cannot be cancelled in its current state.");
      } else {
        setErrorMsg("Failed to cancel. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        className="w-full sm:w-auto bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Cancelling...</span>
          </>
        ) : (
          <span>Cancel Booking</span>
        )}
      </button>
      {errorMsg && (
        <span className="text-[10px] font-bold text-rose-500 block mt-1 leading-tight">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
