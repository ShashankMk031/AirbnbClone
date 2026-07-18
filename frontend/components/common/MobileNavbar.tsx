"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "../../context/RoleContext";
import { Compass, Heart, Briefcase, LayoutDashboard } from "lucide-react";

export default function MobileNavbar() {
  const { role } = useRole();
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-45 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 shadow-xl px-4 py-2 flex items-center justify-around select-none backdrop-blur supports-[backdrop-filter]:bg-white/75 pb-safe-bottom">
      {/* Explore */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
          pathname === "/"
            ? "text-[#FF385C]"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Explore</span>
      </Link>

      {role === "guest" ? (
        <>
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              pathname === "/wishlist"
                ? "text-[#FF385C]"
                : "text-zinc-550 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
          </Link>

          {/* Trips */}
          <Link
            href="/trips"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
              pathname === "/trips"
                ? "text-[#FF385C]"
                : "text-zinc-550 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Trips</span>
          </Link>
        </>
      ) : (
        /* Host Dashboard */
        <Link
          href="/host/dashboard"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
            pathname === "/host/dashboard"
              ? "text-[#FF385C]"
              : "text-zinc-550 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </Link>
      )}
    </div>
  );
}
