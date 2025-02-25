// app/api/user/type/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserType } from "@prisma/client";

export async function PATCH(request: Request) {
  try {
    // Get the current session using the new auth() function
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to perform this action" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { userType } = body;
    
    // Validate user type
    if (!userType || !Object.values(UserType).includes(userType as UserType)) {
      return NextResponse.json(
        { error: "Invalid user type provided" },
        { status: 400 }
      );
    }
    
    // Update the user type in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { userType: userType as UserType },
    });
    
    // Create the appropriate profile based on user type
    if (userType === UserType.RECRUITER) {
      // Check if a recruiter profile already exists
      const existingRecruiter = await prisma.recruiter.findUnique({
        where: { userId: session.user.id },
      });
      
      if (!existingRecruiter) {
        await prisma.recruiter.create({
          data: {
            userId: session.user.id,
          },
        });
      }
    } else if (userType === UserType.APPLICANT) {
      // Check if an applicant profile already exists
      const existingApplicant = await prisma.applicant.findUnique({
        where: { userId: session.user.id },
      });
      
      if (!existingApplicant) {
        await prisma.applicant.create({
          //@ts-ignore
          data: {
            userId: session.user.id,
          },
        });
      }
    }
    
    return NextResponse.json(
      { message: "User type updated successfully", userType },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user type:", error);
    return NextResponse.json(
      { error: "An error occurred while updating user type" },
      { status: 500 }
    );
  }
}