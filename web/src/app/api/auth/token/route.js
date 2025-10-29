export async function GET(request) {
  return new Response(JSON.stringify({ token: 'dummy-token' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}