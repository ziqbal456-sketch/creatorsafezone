const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "media-src 'self' blob: https://assets.mixkit.co",
    "connect-src 'self' https://assets.mixkit.co",
    "worker-src 'self' blob:",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join("; "),
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

export default {
  async fetch(request, env) {
    const assetResponse = await env.ASSETS.fetch(request);
    const headers = new Headers(assetResponse.headers);

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    // Only the URL-enabled checker can request user-selected HTTPS video hosts.
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    if (path === '/check-all-platforms' || path === '/check-all-platforms.html') {
      headers.set('Content-Security-Policy', SECURITY_HEADERS['Content-Security-Policy'].replace("media-src 'self' blob: https://assets.mixkit.co", "media-src 'self' blob: https:"));
      headers.set('Referrer-Policy', 'no-referrer');
    }

    // Prevent the workers.dev preview hostname from competing with the custom domain.
    const hostname = new URL(request.url).hostname;
    if (hostname.endsWith(".workers.dev")) {
      headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers
    });
  }
};
