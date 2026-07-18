"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 text-sm font-bold rounded-xl transition ${
                isCurrent
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
