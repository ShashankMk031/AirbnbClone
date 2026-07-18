"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRole } from "../context/RoleContext";
import RoleSwitcher from "./common/RoleSwitcher";
import ThemeToggle from "./common/ThemeToggle";

export default function Navbar() {
  const { role } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <ThemeToggle />
          <RoleSwitcher />
          
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden sm:flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-full p-2 hover:shadow-md cursor-pointer transition select-none"
            >
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

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <Link
                  href="/messages"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 hover:bg-zinc-55 dark:hover:bg-zinc-900 transition-colors uppercase tracking-wider text-[10px] text-[#FF385C]"
                >
                  Messages
                </Link>
                <Link
                  href="/verify-identity"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 hover:bg-zinc-55 dark:hover:bg-zinc-900 transition-colors border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-2 uppercase tracking-wider text-[10px]"
                >
                  Verify Identity
                </Link>
                
                <span className="block px-4 pb-1 text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest">
                  Navigation
                </span>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 hover:bg-zinc-55 dark:hover:bg-zinc-900 transition-colors"
                >
                  Explore
                </Link>
                {role === "guest" ? (
                  <>
                    <Link
                      href="/wishlist"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-zinc-55 dark:hover:bg-zinc-900 transition-colors"
                    >
                      Wishlists
                    </Link>
                    <Link
                      href="/trips"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-zinc-55 dark:hover:bg-zinc-900 transition-colors"
                    >
                      Trips
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/host/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 hover:bg-zinc-55 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
