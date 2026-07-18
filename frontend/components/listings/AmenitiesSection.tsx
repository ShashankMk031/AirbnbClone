interface AmenitiesSectionProps {
  amenities: string[];
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">What this place offers</h3>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, i) => (
          <span
            key={i}
            className="px-4 py-2 bg-zinc-50 border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 text-xs font-bold rounded-full shadow-sm hover:bg-zinc-100 transition-colors duration-200"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}
