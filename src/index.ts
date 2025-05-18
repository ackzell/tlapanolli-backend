import { serve } from '@hono/node-server';
import fs from 'node:fs';
import { createServer } from 'node:https';

import { app } from './app';
import { appEnv } from './env';

serve({
  createServer,
  serverOptions: {
    cert: fs.readFileSync('127.0.0.1.pem'),
    key: fs.readFileSync('127.0.0.1-key.pem'),
  },
  hostname: '127.0.0.1',
  fetch: app.fetch,
  port: appEnv.PORT,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${JSON.stringify(info, null, 2)}`);
});
