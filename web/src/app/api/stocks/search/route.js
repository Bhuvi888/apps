export async function GET(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');
  const stocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
  ];

  const filteredStocks = stocks.filter(({ ticker, name }) => {
    const lowerCaseQuery = query?.toLowerCase() ?? '';
    return ticker.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery);
  });

  return new Response(JSON.stringify(filteredStocks), {
    headers: { 'Content-Type': 'application/json' },
  });
}