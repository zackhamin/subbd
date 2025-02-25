// app/api/profile/applicant/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Utility function to log detailed error information
function logAuthError(message: string, session: any, userId: string | undefined) {
  console.error({
    message,
    sessionUserId: session?.user?.id,
    requestedUserId: userId,
    sessionUser: session?.user,
  });
}

// GET: Fetch applicant profile
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    
    // Log session and params for debugging
    console.log('Session:', session);
    console.log('Request Params:', params);

    // Check if user is authenticated
    if (!session || !session.user) {
      logAuthError("No authenticated session", session, params?.userId);
      return NextResponse.json(
        { error: "You must be logged in to access this resource" },
        { status: 401 }
      );
    }

    // Validate userId from params
    const userId = params?.userId || session.user.id;
    if (!userId) {
      logAuthError("No user ID provided", session, userId);
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Fetch the user to verify user type and existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        userType: true,
        name: true,
        email: true,
      }
    });

    // Additional checks
    if (!user) {
      logAuthError("User not found", session, userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check authorization - users can only see their own profiles 
    // or if they have specific roles (admin, recruiter)
    const isAuthorized = 
      session.user.id === userId || 
      session.user.userType === 'RECRUITER';

    if (!isAuthorized) {
      logAuthError("Unauthorized profile access", session, userId);
      return NextResponse.json(
        { error: "You are not authorized to access this profile" },
        { status: 403 }
      );
    }
    
    // Fetch the applicant profile
    const applicantProfile = await prisma.applicant.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        skills: true,
        education: true,
      },
    });
    
    if (!applicantProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }
    
    // Format the response to include flattened user data and properly format arrays
    const profileData = {
      ...applicantProfile,
      name: applicantProfile.user.name,
      email: applicantProfile.user.email,
      image: applicantProfile.user.image,
      skills: applicantProfile.skills?.map(skill => skill.name) || [],
      education: applicantProfile.education || [],
    };
    
    return NextResponse.json(profileData);
    
  } catch (error) {
    console.error("Error fetching applicant profile:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the profile" },
      { status: 500 }
    );
  }
}

// POST: Update or create applicant profile
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to perform this action" },
        { status: 401 }
      );
    }
    
    // Validate userId
    const userId = params?.userId || session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }
    
    // Check authorization - users can only update their own profiles
    // or if they have specific roles
    const isAuthorized = 
      session.user.id === userId 

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "You are not authorized to update this profile" },
        { status: 403 }
      );
    }
    
    // Parse the request body (you might need to adjust this based on your form data)
    const formData = await request.formData();
    const profileDataString = formData.get('profileData') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!profileDataString) {
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      );
    }

    const {
      headline,
      bio,
      yearsOfExperience,
      jobTitle,
      location,
      skills = [],
      education = [],
    } = JSON.parse(profileDataString);
    
    // Begin a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update or create the applicant profile
      const profile = await tx.applicant.upsert({
        where: { userId: userId },
        update: {
          headline,
          bio,
          yearsOfExperience,
          jobTitle,
          location,
        },
        create: {
          userId: userId,
          headline,
          bio,
          yearsOfExperience,
          jobTitle,
          location,
        },
      });
      
      // Handle skills - first remove existing skills
      await tx.skill.deleteMany({
        where: { applicantId: profile.id },
      });
      
      // Then add new skills
      if (skills && skills.length > 0) {
        await Promise.all(
          skills.map((skillName: string) =>
            tx.skill.create({
              data: {
                name: skillName,
                applicantId: profile.id,
              },
            })
          )
        );
      }
      
      // Handle education - first remove existing education
      await tx.education.deleteMany({
        where: { applicantId: profile.id },
      });
      
      // Then add new education
      if (education && education.length > 0) {
        await Promise.all(
          education.map((edu: any) =>
            tx.education.create({
              data: {
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                from: edu.from,
                to: edu.to || null,
                current: edu.current || false,
                applicantId: profile.id,
              },
            })
          )
        );
      }
      
      // Placeholder for resume upload
      // You'll need to implement actual file upload logic
      if (resumeFile) {
        // Implement resume file upload
        console.log('Resume file received:', resumeFile.name);
      }
      
      return profile;
    });
    
    return NextResponse.json({
      message: "Profile updated successfully",
      profile: result,
    });
    
  } catch (error) {
    console.error("Error updating applicant profile:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the profile" },
      { status: 500 }
    );
  }
}