import { z } from 'zod';

const optionalString = (defaultValue: string) =>
  z.preprocess((val) => (val === '' || val === undefined ? defaultValue : val), z.string());

const optionalEmail = (defaultValue: string) =>
  z.preprocess((val) => (val === '' || val === undefined ? defaultValue : val), z.string().email());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().default('/api/v1'),

  DATABASE_URL: z.string().min(1),

  REDIS_URL: z.string().default(''),

  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(16),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  SAVE_SECRET_KEY: z.string().min(16),

  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  ADMIN_USERNAME: optionalString('admin'),
  ADMIN_EMAIL: optionalEmail('admin@wanjie.com'),
  ADMIN_PASSWORD: optionalString('admin123'),

  CORS_ORIGIN: z.string().default('*'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    const errors = Object.entries(formatted)
      .filter(([key]) => key !== '_errors')
      .map(([key, value]) => {
        const messages = (value as { _errors?: string[] })._errors ?? [];
        return `  ${key}: ${messages.join(', ')}`;
      })
      .join('\n');

    throw new Error(`Environment validation failed:\n${errors}`);
  }

  return result.data;
}
