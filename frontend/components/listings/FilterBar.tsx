"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Property types to match database seed property_types
const PROPERTY_TYPES = [
  { label: "All Properties", value: "" },
  { label: "Apartment", value: "Apartment" },
  { label: "Villa", value: "Villa" },
  { label: "Cabin", value: "Cabin" },
  { label: "Farm Stay", value: "Farm Stay" },
  { label: "Beach House", value: "Beach House" },
  { label: "Treehouse", value: "Treehouse" },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedType = searchParams.get("property_type") || "";
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const selectedSort = searchParams.get("sort_by") || "";

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset page to 1 on filter update
    router.push(`/?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set("min_price", minPrice);
    else params.delete("min_price");

    if (maxPrice) params.set("max_price", maxPrice);
    else params.delete("max_price");

    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8 flex flex-col gap-6">
      {/* Category Pills & Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          {PROPERTY_TYPES.map((pt) => {
            const isActive = selectedType === pt.value;
            return (
              <button
                key={pt.label}
                type="button"
                onClick={() => updateUrlParam("property_type", pt.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-md"
                    : "bg-white text-zinc-600 border-zinc-200 dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {pt.label}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
            Sort By
          </label>
          <select
            value={selectedSort}
            onChange={(e) => updateUrlParam("sort_by", e.target.value)}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-800 dark:text-zinc-200 py-2 px-3 rounded-xl focus:outline-none hover:border-zinc-400 dark:hover:border-zinc-600 transition cursor-pointer"
          >
            <option value="">Default (Newest)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Price Range Filter Form */}
      <form
        onSubmit={handlePriceApply}
        className="flex flex-wrap items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 max-w-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Price</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm py-1.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
            min={0}
          />
          <span className="text-zinc-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm py-1.5 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
            min={0}
          />
        </div>
        <button
          type="submit"
          className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-xl transition shadow-sm ml-auto"
        >
          Apply Price
        </button>
      </form>
    </div>
  );
}
