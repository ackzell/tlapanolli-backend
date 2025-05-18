import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError } from 'stoker/middlewares';

export const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/error', () => {
  throw new Error('This is an error');
});

app.notFound(notFound);
app.onError(onError);
