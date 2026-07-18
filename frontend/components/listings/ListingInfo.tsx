import { Users, Bed, Bath } from "lucide-react";
import { ListingDetail } from "../../types/listing";

interface ListingInfoProps {
  listing: ListingDetail;
}

export default function ListingInfo({ listing }: ListingInfoProps) {
  const hostInitials = listing.host?.full_name
    ? listing.host.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "H";

  return (
    <div className="space-y-6">
      {/* Title, Property Type, Host info header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 flex justify-between items-start">
        <div className="space-y-2">
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-rose-500">
            {listing.property_type}
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            {listing.title}
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {listing.location}
          </p>
        </div>

        {/* Host Avatar Block */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-extrabold text-base shadow-sm">
            {hostInitials}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-bold uppercase tracking-wider">
            Hosted by {listing.host?.full_name.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Property Summary Icons row */}
      <div className="flex items-center gap-6 text-zinc-600 dark:text-zinc-300 py-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-zinc-400" />
          <span className="text-sm font-bold">{listing.max_guests} <span className="font-normal text-zinc-500 text-xs">guests</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-zinc-400" />
          <span className="text-sm font-bold">{listing.bedrooms} <span className="font-normal text-zinc-500 text-xs">bedrooms</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-zinc-400" />
          <span className="text-sm font-bold">{listing.bathrooms} <span className="font-normal text-zinc-500 text-xs">bathrooms</span></span>
        </div>
      </div>

      {/* About this space (Description) */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">About this space</h3>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>
    </div>
  );
}
