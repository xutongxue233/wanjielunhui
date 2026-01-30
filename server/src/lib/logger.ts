import pino, { type Logger } from 'pino';
import config from '../config/index.js';

const devConfig = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

const prodConfig = {
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger: Logger = pino({
  level: config.log.level,
  ...(config.isDev ? devConfig : prodConfig),
});

export default logger;
