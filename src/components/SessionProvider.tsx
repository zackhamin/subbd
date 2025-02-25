"use client";

import { SessionProvider } from "next-auth/react";
import { AuthStateManager } from "./auth/AuthStateManager";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthStateManager>
        {children}
      </AuthStateManager>
    </SessionProvider>
  );
}