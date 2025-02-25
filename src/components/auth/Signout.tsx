"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function SignOutButton({ 
  className = "",
  variant = "ghost"
}: SignOutButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut size={16} />
      Sign Out
    </Button>
  );
}