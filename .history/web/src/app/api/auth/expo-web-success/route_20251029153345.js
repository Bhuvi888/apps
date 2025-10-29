
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ success: true, message: 'Expo web authentication successful.' });
});

export default app;
