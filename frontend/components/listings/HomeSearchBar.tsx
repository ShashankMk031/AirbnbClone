"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function HomeSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("check_in") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("check_out") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (location) params.set("location", location);
    else params.delete("location");

    if (checkIn) params.set("check_in", checkIn);
    else params.delete("check_in");

    if (checkOut) params.set("check_out", checkOut);
    else params.delete("check_out");

    if (guests) params.set("guests", guests);
    else params.delete("guests");

    // Reset page to 1 when a new search is conducted
    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    setLocation("");
    setCheckIn("");
    setCheckOut("");
    setGuests("");
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 p-2 pl-6 flex flex-col md:flex-row items-center gap-2 md:gap-0"
      >
        {/* Location */}
        <div className="flex-1 w-full text-left py-2 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full transition-colors duration-200">
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Where
          </label>
          <input
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none mt-0.5"
          />
        </div>

        <div className="hidden md:block h-8 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Check-in */}
        <div className="flex-1 w-full text-left py-2 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full transition-colors duration-200">
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Check in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none mt-0.5 cursor-pointer"
          />
        </div>

        <div className="hidden md:block h-8 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Check-out */}
        <div className="flex-1 w-full text-left py-2 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full transition-colors duration-200">
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Check out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none mt-0.5 cursor-pointer"
          />
        </div>

        <div className="hidden md:block h-8 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Guests */}
        <div className="w-full md:w-44 text-left py-2 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full transition-colors duration-200 flex justify-between items-center pr-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Who
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none mt-0.5 cursor-pointer appearance-none"
            >
              <option value="" className="dark:bg-zinc-950">Add guests</option>
              <option value="1" className="dark:bg-zinc-950">1 guest</option>
              <option value="2" className="dark:bg-zinc-950">2 guests</option>
              <option value="3" className="dark:bg-zinc-950">3 guests</option>
              <option value="4" className="dark:bg-zinc-950">4 guests</option>
              <option value="5" className="dark:bg-zinc-950">5 guests</option>
              <option value="6" className="dark:bg-zinc-950">6+ guests</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            {(location || checkIn || checkOut || guests) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full transition-colors duration-200 mr-1"
                title="Clear Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="p-3 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-full transition-colors duration-300 shadow-md flex items-center justify-center shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
