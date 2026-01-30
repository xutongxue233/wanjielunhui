import { buildApp } from './app.js';
import config from './config/index.js';
import logger from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { connectRedis, disconnectRedis } from './lib/redis.js';
import bcrypt from 'bcrypt';

async function bootstrapAdmin() {
  const { username, email, password } = config.admin;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    logger.info(`Admin user already exists: ${existing.username}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role: 'ADMIN',
    },
  });

  logger.info(`Admin user created: ${username} / ${email}`);
}

async function main() {
  try {
    logger.info('Starting server...');

    await prisma.$connect();
    logger.info('Database connected');

    await bootstrapAdmin();

    try {
      await connectRedis();
      logger.info('Redis connected');
    } catch (err) {
      logger.warn('Redis connection failed, continuing without cache');
    }

    const app = await buildApp();

    await app.listen({
      port: config.server.port,
      host: config.server.host,
    });

    logger.info(`Server listening on http://${config.server.host}:${config.server.port}`);
    logger.info(`API docs available at http://localhost:${config.server.port}/docs`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

async function shutdown() {
  logger.info('Shutting down...');

  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (err) {
    logger.error(err, 'Error disconnecting database');
  }

  try {
    await disconnectRedis();
    logger.info('Redis disconnected');
  } catch (err) {
    logger.error(err, 'Error disconnecting Redis');
  }

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main();
