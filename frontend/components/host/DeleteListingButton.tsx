"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteListing } from "../../services/listings";

interface DeleteListingButtonProps {
  listingId: number;
}

export default function DeleteListingButton({ listingId }: DeleteListingButtonProps) {
  const router = useRouter();
  const [confirmMode, setConfirmMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      // Mock host ID = 4
      await deleteListing(listingId, 4);
      setLoading(false);
      setConfirmMode(false);
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setConfirmMode(false);
      setErrorMsg(err.message || "Failed to delete listing. Please try again.");
      // Auto clear error after 4 seconds
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  if (confirmMode) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmMode(false)}
            disabled={loading}
            className="flex-1 bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 font-bold text-xs uppercase tracking-wider py-2 px-3 rounded-xl transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        {errorMsg && (
          <span className="text-[10px] text-rose-500 font-semibold text-center mt-1">
            {errorMsg}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setConfirmMode(true)}
        className="w-full bg-zinc-100 hover:bg-rose-50 hover:text-rose-600 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-rose-950/20 dark:text-zinc-300 dark:hover:text-rose-400 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition duration-200 text-center"
      >
        Delete Property
      </button>
      {errorMsg && (
        <div className="text-[10px] text-rose-500 font-semibold text-center mt-1">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
