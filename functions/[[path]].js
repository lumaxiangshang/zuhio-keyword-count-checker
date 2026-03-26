// Cloudflare Pages Functions
// This file enables server-side rendering for Next.js on Cloudflare Pages

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle static assets
  try {
    const response = await env.ASSETS.fetch(request);
    return response;
  } catch (error) {
    // Fallback to index.html for SPA routing
    return env.ASSETS.fetch(new URL('/index.html', request.url));
  }
}
