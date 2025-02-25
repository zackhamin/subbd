"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserType } from "@prisma/client";
import ApplicantProfileSetup from "@/components/profile/Applicant";
import RecruiterProfileSetup from "@/components/profile/Recruiter";
import { Spinner } from "@/components/ui/spinner";

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    // Wait for session to load
    if (status === "loading") {
      return;
    }

    // Redirect if user doesn't have a user type yet
    if (session?.user && !session.user.userType) {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-8">Complete Your Profile</h1>

      {session?.user?.userType === UserType.APPLICANT ? (
        <ApplicantProfileSetup userId={session.user.id} />
      ) : session?.user?.userType === UserType.RECRUITER ? (
        <RecruiterProfileSetup userId={session.user.id} />
      ) : (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            User type not recognized. Please contact support.
          </p>
        </div>
      )}
    </div>
  );
}