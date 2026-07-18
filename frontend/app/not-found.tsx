import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="text-7xl" role="img" aria-label="magnifying glass">🔍</div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We couldn&apos;t find the page you are looking for. It may have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-[#FF385C] hover:bg-[#E61E4D] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition duration-200 shadow-md inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
