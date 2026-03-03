# Clerk: "failed to load clerk.browser.js" (clerk.nailuna.app)

## Error

```
Error: Clerk: Failed to load Clerk, failed to load script: https://clerk.nailuna.app/npm/@clerk/clerk-js@5/dist/clerk.browser.js
(code="failed_to_load_clerk_js")
```

Clerk is trying to load its script from your custom domain `clerk.nailuna.app`. That only works if that domain is correctly proxied to Clerk’s servers.

## Fix (choose one)

### Option A: Localhost only – load script from CDN

For **local development** (`http://localhost:3000`), you can force Clerk to load its script from a CDN instead of your custom domain.

1. In **`.env.local`** add:
   ```bash
   NEXT_PUBLIC_CLERK_JS_URL=https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js
   ```
   (jsDelivr is usually faster than unpkg; the app also preloads this script.)
2. Restart the dev server (`npm run dev`).

The app already passes this URL to `<ClerkProvider>` when set. Auth may still call your custom domain for the Frontend API; if those calls fail, use Option B or C.

### Option B: Remove custom domain (recommended for production)

**Step-by-step (Turkish):** see [CLERK_KUSTOM_DOMAIN_KALDIRMA.md](./CLERK_KUSTOM_DOMAIN_KALDIRMA.md).

1. Open [Clerk Dashboard](https://dashboard.clerk.com) → your application.
2. Go to **Configure** → **Domains** (or **Paths** / **Settings** depending on UI).
3. Remove or disable the custom domain **clerk.nailuna.app** so the app uses Clerk’s default domain (`*.clerk.accounts.dev`).
4. Redeploy your app (or do a hard refresh). The same publishable/secret keys keep working; only the script/origin switches to Clerk’s CDN.

### Option C: Keep custom domain and set up proxy

If you want to keep `clerk.nailuna.app`:

1. In Clerk Dashboard, when you add the custom domain, Clerk shows the **proxy target** (e.g. a CNAME or backend URL).
2. Point **clerk.nailuna.app** to that target:
   - **Vercel:** Add domain `clerk.nailuna.app` and use Clerk’s “Deploy behind proxy” instructions (rewrites/proxy to Clerk’s URL).
   - **DNS:** Add the CNAME record Clerk gives you for the Frontend API host.
3. Ensure SSL is valid for `clerk.nailuna.app`.

Until the proxy is correct, the browser will keep trying to load the script from `clerk.nailuna.app` and get 404 or network errors.

## References

- [Clerk: Script loading](https://clerk.com/docs/troubleshooting/script-loading)
- [Clerk: Deploy behind a proxy](https://clerk.com/docs/guides/development/deployment/behind-a-proxy)
- [Clerk environment variables](https://clerk.com/docs/deployments/clerk-environment-variables)
