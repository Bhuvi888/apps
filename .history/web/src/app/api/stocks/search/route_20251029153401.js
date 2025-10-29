
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  const { query } = c.req.query();
  // In a real application, you would search a database for stocks matching the query.
  const stocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
  ];

  const filteredStocks = stocks.filter(({ ticker, name }) => {
    const lowerCaseQuery = query?.toLowerCase() ?? '';
    return ticker.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery);
  });

  return c.json(filteredStocks);
});

export default app;
