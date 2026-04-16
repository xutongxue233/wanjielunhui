import prismaClientPkg from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import config from '../config/index.js';

const { PrismaClient } = prismaClientPkg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function createPrismaClient(): PrismaClientType {
  const adapter = new PrismaLibSql({
    url: config.database.url,
  });

  return new PrismaClient({
    adapter,
    log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (config.isDev) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
