"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
          ⚠
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            An unexpected error occurred in the application. We have logged this issue and are working to resolve it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition duration-200 shadow-sm"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition duration-200 shadow-sm flex items-center justify-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
