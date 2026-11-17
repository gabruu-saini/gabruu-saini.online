/**
 * Cloudflare Worker for gabruu-saini.online
 * Serves static assets with security headers and SPA fallback
 */

export default {
  async fetch(request, env, ctx) {
    if (!env || !env.ASSETS) {
      return new Response('Assets binding not available', { status: 500 });
    }

    const response = await env.ASSETS.fetch(request);

    // Clone headers to attach security headers
    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Add aggressive caching for static immutable assets (fonts, icons, styles, scripts)
    const url = new URL(request.url);
    if (
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.woff2')
    ) {
      headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
