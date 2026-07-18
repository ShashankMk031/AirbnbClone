export const dynamic = "force-dynamic";

import Link from "next/link";
import TripCard from "../../components/booking/TripCard";
import { getUserBookings } from "../../services/bookings";
import { BookingWithListing } from "../../types/booking";
import RoleGuard from "../../components/common/RoleGuard";

export default async function TripsPage() {
  let bookings: BookingWithListing[] = [];
  let errorMsg = null;

  try {
    // Mock user/guest Rohan Das (ID 4) for assessment testing
    bookings = await getUserBookings(4);
  } catch (err: any) {
    errorMsg = err.message || "Failed to load bookings from the server.";
  }

  return (
    <RoleGuard allowedRole="guest">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header section */}
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-55 tracking-tight">
            Trips & Bookings
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Manage your upcoming stays, check-in details, and cancellation policies.
          </p>
        </div>

        {/* States handler */}
        {errorMsg ? (
          <div className="w-full text-center py-16 px-4 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <h3 className="text-lg font-bold">Failed to load bookings</h3>
            <p className="text-sm mt-1 max-w-md mx-auto opacity-90">
              {errorMsg}. Make sure the FastAPI backend server is running and try again.
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="w-full text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto text-zinc-400 dark:text-zinc-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 21m0 0-.813-5.096L9 21Zm0 0 6.6a1 1 0 0 0 .79-.408L21.39 14.82a1 1 0 0 0-.154-1.285L17.5 10.155m-4.577.813L12 3m0 0-.813 7.968L12 3Zm0 0-6.6.408a1 1 0 0 0-.79.408L1.61 9.18a1 1 0 0 0 .154 1.285L5.5 13.845"
              />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No trips booked... yet!</h3>
              <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-sm mx-auto">
                Time to dust off your bags and start planning your next getaway stay.
              </p>
            </div>
            <Link
              href="/"
              className="bg-[#FF385C] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl hover:bg-[#E61E4D] transition inline-block shadow-sm"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <TripCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
