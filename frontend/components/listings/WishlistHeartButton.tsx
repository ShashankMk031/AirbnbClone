"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { addWishlist, removeWishlist } from "../../services/wishlist";

interface WishlistHeartButtonProps {
  listingId: number;
  initialWishlistId: number | null;
}

export default function WishlistHeartButton({
  listingId,
  initialWishlistId,
}: WishlistHeartButtonProps) {
  const router = useRouter();
  const [wishlistId, setWishlistId] = useState<number | null>(initialWishlistId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if initial value changes externally
  useEffect(() => {
    setWishlistId(initialWishlistId);
  }, [initialWishlistId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      if (wishlistId !== null) {
        // Remove from wishlist
        await removeWishlist(wishlistId);
        setWishlistId(null);
      } else {
        // Add to wishlist (mock user ID 4)
        const res = await addWishlist(4, listingId);
        setWishlistId(res.id);
      }
      router.refresh();
    } catch (err: any) {
      const message = err.message || "";
      if (message.includes("400") || message.toLowerCase().includes("already")) {
        setError("Already wishlisted.");
      } else {
        setError("Network error.");
      }
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isWishlisted = wishlistId !== null;

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="p-2 bg-transparent rounded-full focus:outline-none transition duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 select-none cursor-pointer"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-6 h-6 transition-all duration-300 ${
            isWishlisted
              ? "fill-[#FF385C] text-[#FF385C] drop-shadow-md scale-105"
              : "text-white stroke-[2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          }`}
        />
      </button>
      {error && (
        <span className="bg-zinc-950/80 text-white text-[9px] font-extrabold px-2 py-1 rounded-md shadow-sm pointer-events-none transition-opacity duration-300 select-none">
          {error}
        </span>
      )}
    </div>
  );
}
