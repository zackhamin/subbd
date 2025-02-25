// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Add connection options to help with Supabase connections
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Add connection timeout and pool settings
    // to help with Supabase connection issues
    __internal: {
      engine: {
        connectionTimeout: 10000, // 10 seconds
        retry: {
          count: 3,
          maxTimeout: 5000,
        },
      },
    },
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;