
"use client";

import Link from "next/link";
import { JSX, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth/AuthPopover";
import { useSession, signIn } from "next-auth/react";
import { UserDropdown } from "@/components/UserDropdown";
import { SignOutButton } from "@/components/auth/Signout";

const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu after click
  const closeMobileMenu = (): void => {
    setIsMenuOpen(false);
  };

  // Handlers for mobile auth
  const handleMobileSignIn = () => {
    closeMobileMenu();
    // We need to set a timeout to allow the mobile menu to close
    // before opening the auth dialog from the desktop version
    setTimeout(() => {
      const signInBtn = document.querySelector('[data-signin-trigger]') as HTMLButtonElement;
      if (signInBtn) signInBtn.click();
    }, 100);
  };

  const handleMobileSignUp = () => {
    closeMobileMenu();
    setTimeout(() => {
      const signUpBtn = document.querySelector('[data-signup-trigger]') as HTMLButtonElement;
      if (signUpBtn) signUpBtn.click();
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl md:text-2xl">
          Recruiter<span className="text-blue-600">Connect</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/jobs" className="font-medium hover:text-blue-600 transition-colors">
            Jobs
          </Link>
          <Link href="/recruiters" className="font-medium hover:text-blue-600 transition-colors">
            Recruiters
          </Link>
          <Link href="/about" className="font-medium hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/contact" className="font-medium hover:text-blue-600 transition-colors">
            Contact
          </Link>

          {/* Auth Buttons or User Profile */}
          {isLoading ? (
            // Loading state
            <div className="h-9 w-20 bg-gray-100 animate-pulse rounded"></div>
          ) : session ? (
            // Logged in - show user dropdown
            <UserDropdown />
          ) : (
            // Not logged in - show auth buttons
            <AuthButtons />
          )}
        </nav>
      </div>

      {/* Mobile Navigation - Controlled by state for toggle functionality */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white border-t`}>
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            href="/"
            className="font-medium py-2 hover:text-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className="font-medium py-2 hover:text-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            Jobs
          </Link>
          <Link
            href="/recruiters"
            className="font-medium py-2 hover:text-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            Recruiters
          </Link>
          <Link
            href="/about"
            className="font-medium py-2 hover:text-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="font-medium py-2 hover:text-blue-600 transition-colors"
            onClick={closeMobileMenu}
          >
            Contact
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col space-y-2 pt-2 border-t">
            {isLoading ? (
              // Loading state
              <div className="h-9 bg-gray-100 animate-pulse rounded"></div>
            ) : session ? (
              // Logged in user info
              <div className="space-y-2">
                <div className="px-2 py-1">
                  <p className="font-medium">{session.user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
                <SignOutButton className="w-full justify-start" variant="outline" />
              </div>
            ) : (
              // Auth buttons
              <>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={handleMobileSignIn}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={handleMobileSignUp}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;