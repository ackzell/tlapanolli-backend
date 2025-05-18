import { pinoLogger } from 'hono-pino';
import { pino } from 'pino';
import pretty from 'pino-pretty';

import { appEnv } from '../env';

export function appLogger() {
  return pinoLogger({
    pino: pino({
      level: appEnv.LOG_LEVEL || 'trace',
    }, appEnv.NODE_ENV === 'production' ? undefined : pretty()),
  });
}
