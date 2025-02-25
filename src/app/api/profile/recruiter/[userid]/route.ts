// app/api/profile/recruiter/[userId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch recruiter profile
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to access this resource" },
        { status: 401 }
      );
    }
    
    // Check authorization - users can only see their own profiles
    // unless they are admins (could add this check later)
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { error: "You are not authorized to access this profile" },
        { status: 403 }
      );
    }
    
    // Fetch the recruiter profile
    const recruiterProfile = await prisma.recruiter.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        specializations: true,
      },
    });
    
    if (!recruiterProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }
    
    // Format the response to include flattened user data and properly format arrays
    const profileData = {
      ...recruiterProfile,
      name: recruiterProfile.user.name,
      email: recruiterProfile.user.email,
      image: recruiterProfile.user.image,
      specializations: recruiterProfile.specializations?.map(spec => spec.name) || [],
    };
    
    return NextResponse.json(profileData);
    
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the profile" },
      { status: 500 }
    );
  }
}

// POST: Update or create recruiter profile
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
    
    // Check authorization - users can only update their own profiles
    if (session.user.id !== params.userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this profile" },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const {
      companyName,
      position,
      industry,
      companySize,
      companyDescription,
      companyWebsite,
      companyLocation,
      phoneNumber,
      specializations = [],
    } = body;
    
    // Begin a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update or create the recruiter profile
      const profile = await tx.recruiter.upsert({
        where: { userId: params.userId },
        update: {
          companyName,
          position,
          industry,
          companySize,
          companyDescription,
          companyWebsite,
          companyLocation,
          phoneNumber,
        },
        create: {
          userId: params.userId,
          companyName,
          position,
          industry,
          companySize,
          companyDescription,
          companyWebsite,
          companyLocation,
          phoneNumber,
        },
      });
      
      // Handle specializations - first remove existing specializations
      await tx.specialization.deleteMany({
        where: { recruiterId: profile.id },
      });
      
      // Then add new specializations
      if (specializations && specializations.length > 0) {
        await Promise.all(
          specializations.map((specName: string) =>
            tx.specialization.create({
              data: {
                name: specName,
                recruiterId: profile.id,
              },
            })
          )
        );
      }
      
      return profile;
    });
    
    return NextResponse.json({
      message: "Profile updated successfully",
      profile: result,
    });
    
  } catch (error) {
    console.error("Error updating recruiter profile:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the profile" },
      { status: 500 }
    );
  }
}