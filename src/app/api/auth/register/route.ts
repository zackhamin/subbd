import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;

    // Validate input
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if userType is valid
    if (!Object.values(UserType).includes(userType as UserType)) {
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
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: userType as UserType,
      },
    });

    // Create the appropriate profile based on user type
    if (userType === "RECRUITER") {
      await prisma.recruiter.create({
        data: {
          userId: user.id,
        },
      });
    } else if (userType === "APPLICANT") {
      await prisma.applicant.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Return success response without exposing sensitive information
    return NextResponse.json({
      message: "User created successfully",
      userId: user.id,
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}