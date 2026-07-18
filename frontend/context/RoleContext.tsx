"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "guest" | "host";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("guest");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted role on client-side mount
    const savedRole = localStorage.getItem("mock_user_role") as Role;
    if (savedRole === "guest" || savedRole === "host") {
      setRoleState(savedRole);
    }
    setMounted(true);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("mock_user_role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
