import 'dotenv/config';
import { validateEnv, type Env } from './env.js';

let env: Env | null = null;

export function getEnv(): Env {
  if (!env) {
    env = validateEnv();
  }
  return env;
}

export const config = {
  get env() {
    return getEnv();
  },

  get isDev() {
    return this.env.NODE_ENV === 'development';
  },

  get isProd() {
    return this.env.NODE_ENV === 'production';
  },

  get isTest() {
    return this.env.NODE_ENV === 'test';
  },

  server: {
    get port() {
      return getEnv().PORT;
    },
    get host() {
      return getEnv().HOST;
    },
    get apiPrefix() {
      return getEnv().API_PREFIX;
    },
  },

  database: {
    get url() {
      return getEnv().DATABASE_URL;
    },
  },

  redis: {
    get url() {
      return getEnv().REDIS_URL;
    },
  },

  jwt: {
    get secret() {
      return getEnv().JWT_SECRET;
    },
    get expiresIn() {
      return getEnv().JWT_EXPIRES_IN;
    },
    get refreshSecret() {
      return getEnv().REFRESH_TOKEN_SECRET;
    },
    get refreshExpiresIn() {
      return getEnv().REFRESH_TOKEN_EXPIRES_IN;
    },
  },

  security: {
    get saveSecretKey() {
      return getEnv().SAVE_SECRET_KEY;
    },
  },

  rateLimit: {
    get max() {
      return getEnv().RATE_LIMIT_MAX;
    },
    get windowMs() {
      return getEnv().RATE_LIMIT_WINDOW_MS;
    },
  },

  log: {
    get level() {
      return getEnv().LOG_LEVEL;
    },
  },

  admin: {
    get username() {
      return getEnv().ADMIN_USERNAME;
    },
    get email() {
      return getEnv().ADMIN_EMAIL;
    },
    get password() {
      return getEnv().ADMIN_PASSWORD;
    },
  },

  cors: {
    get origin() {
      return getEnv().CORS_ORIGIN;
    },
  },
};

export default config;
