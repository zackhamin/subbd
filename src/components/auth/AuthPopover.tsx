"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Mail, 
  Lock, 
  AlertCircle, 
  BriefcaseBusiness, 
  UserSearch,
  ArrowRight,
  Check
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserType } from "@prisma/client";
import { toast } from "sonner";

export function AuthButtons() {
  const { data: session } = useSession();
  
  // If user is authenticated, don't show these buttons
  if (session?.user) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <SignInPopover />
      <UserTypeDialog />
    </div>
  );
}

function SignInPopover() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Signed in successfully");
      setIsOpen(false);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" data-signin-trigger>
          Sign In
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <form onSubmit={handleSignIn} className="space-y-3 mt-3">
                  {error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="pl-10 h-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="pl-10 h-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Forgot password?
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading} size="sm">
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="google" className="mt-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  size="sm"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Sign in with Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

// First step in sign up - choosing user type
function UserTypeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleContinue = () => {
    if (!selectedType) return;
    setIsOpen(false);
    
    // Open the sign-up dialog with the selected user type
    setTimeout(() => {
      const signUpDialog = document.getElementById('signup-dialog-trigger') as HTMLButtonElement;
      if (signUpDialog) {
        signUpDialog.click();
      }
    }, 100);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" data-signup-trigger>Sign Up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose your account type</DialogTitle>
            <DialogDescription>
              Select the option that best describes how you'll use RecruiterConnect.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              disabled={!selectedType}
              className="flex items-center gap-1"
            >
              Continue
              <ArrowRight size={16} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden dialog trigger for the sign up form */}
      <Dialog>
        <DialogTrigger asChild>
          <button id="signup-dialog-trigger" className="hidden">Hidden Trigger</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <SignUpForm userType={selectedType || UserType.APPLICANT} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// Improved SignUpForm component with password strength indicator
function SignUpForm({ userType }: { userType: UserType }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Form validation
    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password with a mix of letters, numbers, and symbols");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType,
          name,
        }),
      });

      const data = await response.json();
      console.log(data, "=-=-=")
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      
      toast.success("Account created successfully");
      
      // Sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Store the user type in localStorage to use after Google auth
    localStorage.setItem("pendingUserType", userType);
    signIn("google");
  };

  const userTypeLabel = userType === UserType.APPLICANT ? 'Job Seeker' : 'Recruiter';
  const userTypeIcon = userType === UserType.APPLICANT ? (
    <UserSearch size={16} className="text-blue-600" />
  ) : (
    <BriefcaseBusiness size={16} className="text-blue-600" />
  );

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          {userTypeIcon}
          <span className="text-sm font-medium text-blue-600">{userTypeLabel}</span>
        </div>
        <DialogTitle>Create your account</DialogTitle>
        <DialogDescription>
          Enter your details to get started
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <form onSubmit={handleSignUp} className="space-y-3 mt-3">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="name"
                  placeholder="Full Name"
                  className="pl-10 h-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10 h-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="w-full h-1 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        passwordStrength < 2 ? 'bg-red-500' : 
                        passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {passwordStrength < 2 ? 'Weak password' : 
                     passwordStrength < 4 ? 'Medium password' : 'Strong password'}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 h-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="google" className="mt-3">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              You'll create a {userTypeLabel.toLowerCase()} account using your Google profile
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Sign up with Google
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );
}