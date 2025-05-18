import { serve } from '@hono/node-server';

import { app } from './app';
import { appEnv } from './env';

serve({
  fetch: app.fetch,
  port: appEnv.PORT,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`);
});
