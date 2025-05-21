"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Create RoleContext
const RoleContext = createContext({
  role: "user",
  id: null,
  setRole: () => {},
  setId: () => {},
});

// Custom hook
export const useRole = () => useContext(RoleContext);

// Provider
export default function RoleProvider({ children }) {
  const { data: session, status } = useSession();
  const [role, setRole] = useState("user");
  const [id, setId] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      const user = session?.user;
      setRole(user?.role || "user");
      setId(user?.id || null);

      console.log("RoleProvider State:", {
        role: user?.role || "user",
        id: user?.id || null,
      });
    }
  }, [session, status]);

  return (
    <RoleContext.Provider value={{ role, id, setRole, setId }}>
      {children}
    </RoleContext.Provider>
  );
}
