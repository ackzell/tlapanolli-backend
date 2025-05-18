import type { PinoLogger } from 'hono-pino';

import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';

import { appLogger } from './middlewares/app-logger.js';

interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export const app = new OpenAPIHono<AppBindings>();
app.use(requestId())
  .use(appLogger());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/error', (c) => {
  c.var.logger.info('lol');
  throw new Error('This is an error');
});

// app.notFound(notFound);
// app.onError(onError);
