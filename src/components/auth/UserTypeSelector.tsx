"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserSearch, BriefcaseBusiness, Check, ArrowRight, AlertCircle } from "lucide-react";
import { UserType } from "@prisma/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserTypeSelector() {
  const { data: session, status, update } = useSession();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if we have a pending user type
  useEffect(() => {
    const pendingUserType = localStorage.getItem("pendingUserType");
    if (pendingUserType) {
      try {
        // Validate that it's a valid UserType
        if (Object.values(UserType).includes(pendingUserType as UserType)) {
          setSelectedType(pendingUserType as UserType);
        }
        localStorage.removeItem("pendingUserType");
      } catch (e) {
        console.error("Invalid user type in localStorage", e);
        localStorage.removeItem("pendingUserType");
      }
    }
  }, []);

  // Skip this component if user is not logged in
  if (status !== "authenticated") {
    return null;
  }

  // Check if user already has a type
  if (session?.user?.userType) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call the API to update the user type
      const response = await fetch('/api/user/type', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType: selectedType }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user type');
      }
      
      // Update the session with the new user type
      await update({ userType: selectedType });
      
      toast.success("Account type set successfully!");
      
      // Refresh the page to apply new user type
      router.refresh();
    } catch (error) {
      console.error("Error updating user type:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-2">Complete your registration</h2>
        <p className="text-gray-600 mb-6">
          Please select how you'll use RecruiterConnect to complete your account setup.
        </p>
        
        <div className="space-y-4 mb-6">
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
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedType || isSubmitting}
            className="flex items-center gap-1"
          >
            {isSubmitting ? "Setting up your account..." : "Continue"}
            {!isSubmitting && <ArrowRight size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}