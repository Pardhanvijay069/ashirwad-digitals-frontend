# Deployment Guide — Ashirwad Digitals Frontend

The frontend is a static Vite SPA; it can be hosted anywhere that serves static files, with the Express backend deployed separately.

## 1. Build

```bash
cd frontend
npm install
npm run build        # outputs dist/
```

Environment variables are baked in at build time:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API origin, e.g. `https://api.ashirwaddigitals.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (must whitelist the production domain in Google Cloud Console) |

## 2. SPA routing

The app uses `BrowserRouter` — every unknown path must fall back to `index.html`.

**Netlify** — `frontend/public/_redirects`:
```
/*  /index.html  200
```

**Vercel** — `vercel.json` in `frontend/`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Nginx**:
```nginx
location / {
  root /var/www/ashirwad/dist;
  try_files $uri $uri/ /index.html;
}
```

## 3. Recommended: Vercel / Netlify

1. Import the repo, set **Root Directory** to `frontend/`.
2. Build command `npm run build`, output directory `dist`.
3. Add the two environment variables.
4. Add the production domain to the Google OAuth **Authorized JavaScript origins**.

## 4. Backend CORS & assets

- Allow the frontend origin in the backend's CORS config.
- Product images are served from Cloudinary — already absolute URLs, no extra config.
- WebSocket (socket.io) is used by the **admin** dashboard; ensure the host allows WebSocket upgrade if you proxy the backend.

## 5. Post-deploy checklist

- [ ] `/` loads with warm-ivory theme, fonts render (Cormorant Garamond / Inter / Montserrat)
- [ ] Deep link `https://<domain>/products?deity=mahadev` works after refresh (SPA fallback)
- [ ] Google sign-in completes on the production domain
- [ ] Placing a test order returns an `ASH-…` order number and the tracking page resolves
- [ ] Scroll animations active (real `gsap` installed — check the browser console for a placeholder warning; there should be none)
- [ ] Lighthouse: performance ≥ 90, a11y ≥ 95 on Home / Gallery / PDP
