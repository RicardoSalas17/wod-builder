import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const databaseUrl =
  process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? 'file:./dev.db';

const globalForPrisma = globalThis as { prisma?: PrismaClient };
const adapter = new PrismaLibSql({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
