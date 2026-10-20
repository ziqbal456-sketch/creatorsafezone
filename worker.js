import { guideResponse } from './scheduled-guides.js';
// Normalize only known page aliases. Unknown paths must retain their 404 status.
const PAGE_ROUTES = new Set(['/', '/check-all-platforms', '/tiktok-safe-zone', '/instagram-reels-safe-zone', '/youtube-shorts-safe-zone', '/instagram-story-safe-zone', '/instagram-grid-crop-previewer', '/capcut-safe-zone-template', '/vertical-video-ad-specs', '/methodology', '/about', '/privacy-policy', '/editorial-policy']);
function canonicalRedirect(request) {
  const url = new URL(request.url);
  const target = new URL(url);
  if (['creatorsafezone.com', 'www.creatorsafezone.com'].includes(url.hostname)) {
    target.protocol = 'https:';
    target.hostname = 'creatorsafezone.com';
    target.port = '';
  }
  let path = url.pathname.replace(/\/$/, '').replace(/\.html$/, '');
  if (path === '' || path === '/index') path = '/';
  if (PAGE_ROUTES.has(path)) target.pathname = path;
  if (target.href === url.href) return null;
  return new Response(null, {status:308, headers:{Location:target.href, 'Cache-Control':'public, max-age=3600'}});
}
const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
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
    const assetResponse = canonicalRedirect(request) || await guideResponse(request, env) || await env.ASSETS.fetch(request);
    const headers = new Headers(assetResponse.headers);

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    // Only the URL-enabled tool pages can request user-selected HTTPS video hosts.
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    if (['','/index','/check-all-platforms','/tiktok-safe-zone','/instagram-reels-safe-zone','/youtube-shorts-safe-zone','/instagram-story-safe-zone','/instagram-grid-crop-previewer','/capcut-safe-zone-template','/vertical-video-ad-specs'].includes(path.replace(/\.html$/, ''))) {
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
