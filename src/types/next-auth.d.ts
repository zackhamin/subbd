import { UserType } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    userType?: UserType | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userType?: UserType | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    userType?: UserType | null;
  }
}