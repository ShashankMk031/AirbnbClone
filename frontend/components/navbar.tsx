"use client";

import Link from "next/link";
import { useRole } from "../context/RoleContext";
import RoleSwitcher from "./common/RoleSwitcher";

export default function Navbar() {
  const { role } = useRole();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-[#FF385C] font-bold text-2xl tracking-tight select-none">
          <span>airbnb</span>
          <span className="text-xs bg-[#FF385C]/10 px-2 py-0.5 rounded-full uppercase font-semibold">clone</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
            Explore
          </Link>
          {role === "guest" ? (
            <>
              <Link href="/wishlist" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
                Wishlist
              </Link>
              <Link href="/trips" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
                Trips
              </Link>
            </>
          ) : (
            <Link href="/host/dashboard" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <RoleSwitcher />
          
          <div className="hidden sm:flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-full p-2 hover:shadow-md cursor-pointer transition select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-zinc-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className="w-8 h-8 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white text-xs font-semibold uppercase">
              {role[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
