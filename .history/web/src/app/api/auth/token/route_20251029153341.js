
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ token: 'dummy-token' });
});

export default app;
