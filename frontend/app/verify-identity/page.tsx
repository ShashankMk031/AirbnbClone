import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function VerifyIdentityPlaceholderPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-[#FF385C]/10 text-[#FF385C] rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Identity Verification Coming Soon
          </h2>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Secure identity verification checkups will be available in a future version. We are currently implementing Government ID scans and facial recognition models to protect safety across our community.
          </p>
        </div>

        <Link
          href="/"
          className="w-full bg-[#FF385C] hover:bg-[#E61E4D] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-200 shadow-md block text-center cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
