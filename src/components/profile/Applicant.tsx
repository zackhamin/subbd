// components/profile/ApplicantProfileSetup.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { X, FileUp, Paperclip } from "lucide-react";
import { useSession } from "next-auth/react";

// Enhanced validation schema
const profileSchema = z.object({
  headline: z.string()
    .min(3, "Headline must be at least 3 characters")
    .max(100, "Headline cannot exceed 100 characters")
    .trim(),
  bio: z.string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .transform(val => val?.trim() || undefined),
  yearsOfExperience: z.coerce.number().min(0).max(50),
  jobTitle: z.string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title cannot exceed 100 characters")
    .trim(),
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters")
    .trim(),
  skills: z.array(z.string())
    .optional()
    .transform(skills => skills?.filter(skill => skill.trim() !== '')),
  education: z.array(
    z.object({
      institution: z.string().min(2, "Institution name is required").trim(),
      degree: z.string().min(2, "Degree is required").trim(),
      fieldOfStudy: z.string().min(2, "Field of study is required").trim(),
      from: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
      to: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number").optional(),
      current: z.boolean().default(false),
    }).refine(
      (data) => !data.current || !data.to, 
      { message: "Remove 'To' year if currently studying" }
    )
  ).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to?: string;
  current: boolean;
}

interface ApplicantProfileSetupProps {
  userId?: string;
  onProfileSaved?: (profileData: ProfileFormValues) => void;
  initialMode?: 'create' | 'edit';
}

export default function ApplicantProfileSetup({ 
  userId, 
  onProfileSaved, 
  initialMode = 'create' 
}: ApplicantProfileSetupProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentEducation, setCurrentEducation] = useState<EducationEntry>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: false,
  });

  // Determine the current user ID
  const currentUserId = userId || session?.user?.id;

  // Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      headline: "",
      bio: "",
      yearsOfExperience: 0,
      jobTitle: "",
      location: "",
      skills: [],
      education: [],
    },
  });

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/profile/applicant/${currentUserId}`);
        
        if (response.ok) {
          // Profile exists
          const profileData = await response.json();
          
          // Populate the form with existing data
          form.reset({
            headline: profileData.headline || "",
            bio: profileData.bio || "",
            yearsOfExperience: profileData.yearsOfExperience || 0,
            jobTitle: profileData.jobTitle || "",
            location: profileData.location || "",
            skills: profileData.skills || [],
            education: profileData.education || [],
          });
          
          setSkills(profileData.skills || []);
          setEducation(profileData.education || []);
          setHasProfile(true);
        } else if (response.status === 404) {
          // No profile found
          setHasProfile(false);
        } else {
          // Other error
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUserId, form]);

  // Save profile data
  const onSubmit = async (values: ProfileFormValues) => {
    if (!currentUserId) {
      toast.error("User ID is required");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare form data
      const formData = new FormData();
      
      // Add profile data
      const profileData = {
        ...values,
        skills,
        education,
      };
      formData.append('profileData', JSON.stringify(profileData));
      
      // Add resume file if exists
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      
      const response = await fetch(`/api/profile/applicant/${currentUserId}`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      
      const result = await response.json();
      
      toast.success("Profile saved successfully");
      
      // Call onProfileSaved if provided, otherwise use default navigation
      if (onProfileSaved) {
        onProfileSaved(profileData);
      } 
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Skills management
  const addSkill = () => {
    const skillToAdd = newSkill.trim();
    if (skillToAdd && !skills.includes(skillToAdd)) {
      setSkills([...skills, skillToAdd]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Education management
  const addEducation = () => {
    const educationToAdd = { ...currentEducation };
    
    // Validate education entry
    const isValid = 
      educationToAdd.institution.trim() &&
      educationToAdd.degree.trim() &&
      educationToAdd.fieldOfStudy.trim() &&
      educationToAdd.from;
    
    if (isValid) {
      setEducation([...education, educationToAdd]);
      setCurrentEducation({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        from: "",
        to: "",
        current: false,
      });
      setShowEducationForm(false);
    } else {
      toast.error("Please fill in all required education fields");
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Resume file handling
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PDF or Word document.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      setResumeFile(file);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no profile exists, show create profile button
  if (!hasProfile) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <CardDescription>
            Let's build your professional profile to help recruiters find you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <p className="text-center text-gray-600">
            You haven't created a profile yet. Click below to get started.
          </p>
          <Button 
            onClick={() => setHasProfile(true)} 
            className="w-full"
          >
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Full profile form
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {initialMode === 'create' ? 'Create Profile' : 'Edit Profile'}
          </CardTitle>
          <CardDescription>
            {initialMode === 'create' 
              ? 'Tell us about yourself to help recruiters find you.' 
              : 'Update your professional profile.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief headline describing your professional identity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself, your experience, and your career goals"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select years of experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 years</SelectItem>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="2">2 years</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="4">4 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="6">6-7 years</SelectItem>
                        <SelectItem value="8">8-10 years</SelectItem>
                        <SelectItem value="11">11-15 years</SelectItem>
                        <SelectItem value="16">16-20 years</SelectItem>
                        <SelectItem value="21">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Skills</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary"
                    className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <FormLabel>Education</FormLabel>
                <div className="space-y-3 mb-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50 relative">
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <X size={16} />
                      </button>
                      <h4 className="font-medium">{edu.institution}</h4>
                      <p>{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-sm text-gray-500">
                        {edu.from} - {edu.current ? 'Present' : edu.to}
                      </p>
                    </div>
                  ))}
                </div>

                {showEducationForm ? (
                  <div className="border rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-3">Add Education</h4>
                    <div className="space-y-3">
                      <div>
                        <FormLabel className="text-sm">Institution</FormLabel>
                        <Input
                          placeholder="University or School Name"
                          value={currentEducation.institution}
                          onChange={(e) => setCurrentEducation({
                            ...currentEducation,
                            institution: e.target.value
                          })}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FormLabel className="text-sm">Degree</FormLabel>
                          <Input
                            placeholder="e.g. Bachelor's"
                            value={currentEducation.degree}
                            onChange={(e) => setCurrentEducation({
                              ...currentEducation,
                              degree: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <FormLabel className="text-sm">Field of Study</FormLabel>
                          <Input
                            placeholder="e.g. Computer Science"
                            value={currentEducation.fieldOfStudy}
                            onChange={(e) => setCurrentEducation({
                              ...currentEducation,
                              fieldOfStudy: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <FormLabel className="text-sm">From Year</FormLabel>
                          <Input
                            type="number"
                            placeholder="e.g. 2018"
                            value={currentEducation.from}
                            onChange={(e) => setCurrentEducation({
                              ...currentEducation,
                              from: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <FormLabel className="text-sm">To Year</FormLabel>
                          <Input
                            type="number"
                            placeholder="e.g. 2022"
                            value={currentEducation.to}
                            onChange={(e) => setCurrentEducation({
                              ...currentEducation,
                              to: e.target.value
                            })}
                            disabled={currentEducation.current}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="current-education"
                          checked={currentEducation.current}
                          onChange={(e) => setCurrentEducation({
                            ...currentEducation,
                            current: e.target.checked,
                            to: e.target.checked ? "" : currentEducation.to
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="current-education" className="text-sm">
                          I am currently studying here
                        </label>
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowEducationForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={addEducation}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowEducationForm(true)}
                  >
                    + Add Education
                  </Button>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" className="mr-2" /> : null}
                  {isSaving 
                    ? "Saving..." 
                    : (initialMode === 'create' ? 'Create Profile' : 'Update Profile')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume/CV Upload</CardTitle>
          <CardDescription>
            Upload your resume to be shared with recruiters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
          />
          <label 
            htmlFor="resume-upload" 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition block"
          >
            {resumeFile ? (
              <div className="flex items-center justify-center gap-2">
                <Paperclip size={24} />
                <span>{resumeFile.name}</span>
              </div>
            ) : (
              <>
                <FileUp size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-500 mb-2">
                  Drag and drop your resume file here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: PDF, DOCX, DOC (Max 5MB)
                </p>
              </>
            )}
          </label>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {resumeFile && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setResumeFile(null)}
            >
              Remove Resume
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            {resumeFile ? 'Replace Resume' : 'Upload Resume'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}