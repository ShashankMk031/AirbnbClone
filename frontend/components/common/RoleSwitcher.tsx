"use client";

import { useRole } from "../../context/RoleContext";

export default function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-full flex items-center select-none border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setRole("guest")}
        className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer ${
          role === "guest"
            ? "bg-[#FF385C] text-white shadow-sm"
            : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250"
        }`}
      >
        Guest
      </button>
      <button
        type="button"
        onClick={() => setRole("host")}
        className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer ${
          role === "host"
            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm"
            : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250"
        }`}
      >
        Host
      </button>
    </div>
  );
}
