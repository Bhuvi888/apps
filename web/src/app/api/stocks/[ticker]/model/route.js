export async function GET(request, { params }) {
  const { ticker } = params;
  return new Response(JSON.stringify({
    ticker,
    model: {
      name: 'Dummy Model',
      version: '1.0.0',
      parameters: {
        param1: 'value1',
        param2: 'value2',
      },
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}