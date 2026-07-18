"use client";

import { ReactNode } from "react";
import { useRole } from "../../context/RoleContext";

interface RoleGuardProps {
  allowedRole: "guest" | "host";
  children: ReactNode;
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const { role, setRole } = useRole();

  if (role !== allowedRole) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#FF385C]/10 text-[#FF385C] rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
            🛟
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {allowedRole === "host"
                ? "This page is available only in Host mode."
                : "This feature is available in Guest mode."}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {allowedRole === "host"
                ? "Switch to Host mode using the button below or the header switcher to manage your listed properties and edit dashboard settings."
                : "Switch to Guest mode below or via the role selector to explore stays, view your wishlist, or check booking trip details."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRole(allowedRole)}
            className="w-full bg-[#FF385C] hover:bg-[#E61E4D] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-200 shadow-md cursor-pointer block text-center"
          >
            {allowedRole === "host" ? "Switch to Host" : "Switch to Guest"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
