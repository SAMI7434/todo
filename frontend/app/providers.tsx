"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "../context/authContent";
import { SocketProvider } from "../context/socketContent";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>{children}</SocketProvider>
    </AuthProvider>
  );
}
