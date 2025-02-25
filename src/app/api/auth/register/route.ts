// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    console.log("Registration request received");
    
    const body = await request.json();
    const { email, password, userType, name } = body;
    
    console.log("Registration data:", { email, userType, name, hasPassword: !!password });

    // Validate input
    if (!email || !password || !userType) {
      console.log("Missing required fields:", { email: !!email, password: !!password, userType: !!userType });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if userType is valid
    if (!Object.values(UserType).includes(userType as UserType)) {
      console.log("Invalid user type:", userType);
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create the user
    console.log("Creating user with data:", { email, userType, name: name || null });
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: userType as UserType,
        name: name || null,
      },
    });

    console.log("User created successfully:", user.id);

    // Create the appropriate profile based on user type
    try {
      if (userType === UserType.RECRUITER) {
        // Only include required fields
        await prisma.recruiter.create({
          data: {
            userId: user.id,
            companyName: 'My Company', // Required field
          },
        });
        console.log("Recruiter profile created");
      } else if (userType === UserType.APPLICANT) {
        // Only include the userId with no optional fields
        await prisma.applicant.create({
          data: {
            userId: user.id,
          },
        });
        console.log("Applicant profile created");
      }
    } catch (profileError) {
      console.error("Error creating profile:", profileError);
      
      // Clean up the user if profile creation fails
      await prisma.user.delete({ where: { id: user.id } });
      
      return NextResponse.json(
        { error: "Error creating user profile. Please try again." },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "User created successfully",
      userId: user.id,
      userType: user.userType,
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error details:", error);
    
    let errorMessage = "Error creating user";
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error(`Registration error: ${error.message}`);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}