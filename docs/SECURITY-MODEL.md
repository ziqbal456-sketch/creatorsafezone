# Security model
Client code and assets are public. Selected media should remain in the browser. Test Worker forwarding, security headers and production/preview indexing behavior.
Known limitations: inline scripts and runtime Tailwind require permissive CSP; fonts and demo media make external requests. Reducing those dependencies is a separate release.
No secrets, visitor media, raw analytics or personal screenshots in Git. Exclude internal directories from Cloudflare assets and inspect the actual Wrangler upload list.
GitHub quality jobs require contents:read only and no deployment tokens. Production version history supports recovery. An instantaneous error-rate snapshot does not prove long-term reliability.
