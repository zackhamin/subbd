// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserType } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // userType will be set later after OAuth flow
        };
      },
    }),
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // If user doesn't exist or password doesn't match
        if (!user || !user.password || !(await compare(credentials.password, user.password))) {
          return null;
        }

        // If userType is being set during sign up, update it
        if (credentials.userType && (!user.userType || user.userType === null)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              userType: credentials.userType as UserType,
            },
          });
          
          // If the user is a recruiter, create a recruiter profile
          if (credentials.userType === "RECRUITER") {
            // Check if a recruiter profile already exists
            const existingRecruiter = await prisma.recruiter.findUnique({
              where: { userId: user.id },
            });
            
            if (!existingRecruiter) {
              await prisma.recruiter.create({
                data: {
                  userId: user.id,
                },
              });
            }
          }
          
          // If the user is an applicant, create an applicant profile
          if (credentials.userType === "APPLICANT") {
            // Check if an applicant profile already exists
            const existingApplicant = await prisma.applicant.findUnique({
              where: { userId: user.id },
            });
            
            if (!existingApplicant) {
              await prisma.applicant.create({
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }

        // Return the user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          userType: user.userType,
        };
      },
    }),
  ],

  callbacks: {
    // Add custom claims to the JWT token
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.userId = user.id;
        token.userType = user.userType;
      }
      
      // Update token if user type has changed
      if (token.userId) {
        const userData = await prisma.user.findUnique({
          where: { id: token.userId as string },
          select: { userType: true },
        });
        
        if (userData && userData.userType) {
          token.userType = userData.userType;
        }
      }
      
      return token;
    },
    
    // Add data to the session from the token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.userType = token.userType as UserType | null;
      }
      
      return session;
    },
  },

  // For popover-based auth, no need for dedicated pages
  pages: {
    signIn: "/auth/signin", // Fallback only
  },

  // Session configuration
  session: { strategy: "jwt" },
  
  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
});