"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { UserSearch, BriefcaseBusiness, Check } from "lucide-react";
import { toast } from "sonner";

export default function UserTypeSelector() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for pending user type from localStorage (for OAuth flow)
    const pendingUserType = localStorage.getItem("pendingUserType") as UserType | null;
    if (pendingUserType && Object.values(UserType).includes(pendingUserType as UserType)) {
      setSelectedType(pendingUserType as UserType);
      // Don't immediately update in useEffect to avoid side effects
      localStorage.removeItem("pendingUserType");
    }
  }, []);

  const updateUserType = async (userType: UserType) => {
    if (!session?.user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/type", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user type");
      }

      // Update the session to include the new user type
      await update({ userType });
      
      toast.success("Profile type set successfully!");
      
      // Redirect to profile setup
      setTimeout(() => {
        router.push(`/profile/setup?type=${userType.toLowerCase()}`);
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (selectedType) {
      updateUserType(selectedType);
    }
  };

  // Only display if the user is authenticated but doesn't have a user type
  if (!session?.user || session.user.userType) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-2">Complete your registration</h2>
        <p className="text-gray-500 mb-6">
          Please select how you'll use RecruiterConnect.
        </p>

        <div className="grid gap-4 mb-6">
          <div 
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedType === UserType.APPLICANT 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedType(UserType.APPLICANT)}
          >
            <div className={`rounded-full p-2 mr-4 ${
              selectedType === UserType.APPLICANT ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
            }`}>
              <UserSearch size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">I'm looking for a job</h3>
              <p className="text-sm text-gray-500">
                Find opportunities, follow recruiters, and apply to positions that match your skills.
              </p>
            </div>
            {selectedType === UserType.APPLICANT && (
              <div className="ml-2 text-blue-600">
                <Check size={20} />
              </div>
            )}
          </div>
          
          <div 
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedType === UserType.RECRUITER 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedType(UserType.RECRUITER)}
          >
            <div className={`rounded-full p-2 mr-4 ${
              selectedType === UserType.RECRUITER ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
            }`}>
              <BriefcaseBusiness size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">I'm hiring talent</h3>
              <p className="text-sm text-gray-500">
                Post jobs, build your network, and connect with qualified candidates for your openings.
              </p>
            </div>
            {selectedType === UserType.RECRUITER && (
              <div className="ml-2 text-blue-600">
                <Check size={20} />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleContinue} 
            disabled={!selectedType || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Saving..." : "Continue"}
            {!isSubmitting && <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>}
          </Button>
        </div>
      </div>
    </div>
  );
}