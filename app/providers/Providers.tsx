// app/providers/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import RoleProvider from "./RoleProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RoleProvider>{children}</RoleProvider>
    </SessionProvider>
  );
}
