import { serve } from '@hono/node-server';
import { app } from './app.js';

serve({
  fetch: app.fetch,
  port: 8888,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`);
});
