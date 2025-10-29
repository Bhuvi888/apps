
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  const ticker = c.req.param('ticker');
  // In a real application, you would fetch prediction data for the given ticker.
  return c.json({
    ticker,
    predictions: [
      { date: '2025-10-30', price: 150.0 },
      { date: '2025-10-31', price: 152.5 },
      { date: '2025-11-01', price: 151.0 },
    ],
  });
});

export default app;
