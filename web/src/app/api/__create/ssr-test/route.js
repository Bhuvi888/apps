export async function GET(request) {
  return new Response('<h1>SSR Test</h1>', {
    headers: { 'Content-Type': 'text/html' },
  });
}