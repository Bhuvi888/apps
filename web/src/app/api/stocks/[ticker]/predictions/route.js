export async function GET(request, { params }) {
  const { ticker } = params;
  return new Response(JSON.stringify({
    ticker,
    predictions: [
      { date: '2025-10-30', price: 150.0 },
      { date: '2025-10-31', price: 152.5 },
      { date: '2025-11-01', price: 151.0 },
    ],
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}