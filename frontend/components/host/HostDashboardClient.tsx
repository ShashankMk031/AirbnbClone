"use client";

import { useState } from "react";
import Link from "next/link";
import CreateListingModal from "./CreateListingModal";
import DeleteListingButton from "./DeleteListingButton";

interface ListingItem {
  id: number;
  title: string;
  location: string;
  price_per_night: number;
  property_type: string;
  rating: number;
  review_count: number;
  photos: string[];
  created_at: string;
}

interface HostDashboardClientProps {
  listings: ListingItem[];
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";

export default function HostDashboardClient({ listings }: HostDashboardClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header section with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Host Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your properties, pricing details, and review listings status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-2xl transition duration-200 shadow-md inline-flex items-center gap-2 justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Listing
        </button>
      </div>

      {/* Grid of Listings or Empty State */}
      {listings.length === 0 ? (
        <div className="w-full text-center py-20 px-4 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 space-y-5">
          <div className="text-6xl" role="img" aria-label="house with building sign">🏠</div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              You haven&apos;t listed any properties yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Start earning by listing your unique Portuguese heritage villas, beach houses, or cozy cabins today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition inline-block shadow-sm"
          >
            Create your first listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-250 flex flex-col h-full"
            >
              {/* Aspect ratio image */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.photos && listing.photos.length > 0 ? listing.photos[0] : PLACEHOLDER_IMAGE}
                  alt={listing.title}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3 bg-emerald-500 text-white py-1 px-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm select-none">
                  Listed
                </div>
              </div>
              
              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-55 line-clamp-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                      <span className="text-rose-500">★</span>
                      <span>{listing.rating > 0 ? listing.rating.toFixed(2) : "New"}</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{listing.location}</p>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                    ₹{listing.price_per_night.toLocaleString("en-IN")}{" "}
                    <span className="font-normal text-zinc-500 text-xs">night</span>
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="block w-full text-center bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition"
                  >
                    View Listing
                  </Link>
                  <DeleteListingButton listingId={listing.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal Form */}
      <CreateListingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
