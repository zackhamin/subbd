"use client";

import { useSession } from "next-auth/react";
import UserTypeSelector from "./UserTypeSelector";

interface AuthStateManagerProps {
  children: React.ReactNode;
}

// This component manages auth state transitions and shows the appropriate UI
export function AuthStateManager({ children }: AuthStateManagerProps) {
  const { data: session, status } = useSession();

  // If the user is authenticated but doesn't have a user type yet,
  // show the user type selector
  const needsUserType = status === "authenticated" && 
    session?.user && 
    !session.user.userType;

  return (
    <>
      {children}
      {needsUserType && <UserTypeSelector />}
    </>
  );
}