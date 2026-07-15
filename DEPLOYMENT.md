# City Craft — Deployment Guide

This project has two deployable parts:

| Part | Folder | Runtime |
|------|--------|---------|
| **Frontend** | `frontend/` | Static site (Vite → `dist/`) |
| **Backend** | `backend/` | Node.js Express (port `PORT`) |

Locally, Vite proxies `/api/*` to `http://localhost:3000`. In production you either deploy **both separately** (recommended) or **one combined server**.

---

## Prerequisites

1. Code pushed to **GitHub** (do not commit secrets).
2. Confirm `.gitignore` excludes `*.local` (covers `backend/.env.local`).
3. Local smoke test passes:
   ```powershell
   cd backend && npm run dev    # /health → llmConfigured: true
   cd frontend && npm run dev   # app loads on :5173
   ```

---

## Secrets (never commit)

Set these on your **hosting dashboard** for the backend — not in git.

| Variable | Example | When |
|----------|---------|------|
| `LLM_PROVIDER` | `groq` or `xai` | Always |
| `GROQ_API_KEY` | `gsk_...` | Groq ([console.groq.com](https://console.groq.com/keys)) |
| `GROK_API_KEY` | `xai-...` | xAI Grok ([console.x.ai](https://console.x.ai/)) |
| `PORT` | — | Usually set automatically by the host |

Optional:

| Variable | Default |
|----------|---------|
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `GROK_MODEL` | `grok-2-latest` |

> **Groq ≠ Grok** — different companies, different keys and APIs.

---

## Option A — Split deploy (recommended)

**Backend → Render or Railway**  
**Frontend → Vercel or Netlify**

Best for resume portfolios: free tiers, custom domains, clear separation.

### A1. Deploy backend (Render)

1. [render.com](https://render.com) → **New → Web Service**
2. Connect GitHub repo
3. Configure:

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |

4. **Environment** → add `LLM_PROVIDER` and `GROQ_API_KEY` (or `GROK_API_KEY`)
5. Deploy
6. Verify: `https://YOUR-SERVICE.onrender.com/health`  
   Expected: `"llmConfigured": true`, `"llmProvider": "groq"`

**Railway:** New Project → Deploy from GitHub → root `backend`, start `npm start`, same env vars.

**Note:** Render free tier sleeps after inactivity; first request may take ~30 seconds.

---

### A2. Deploy frontend (Vercel)

The frontend calls `/api/launch-product` with a **relative URL**. On Vercel, proxy API requests to your backend with a rewrite.

1. Create `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-BACKEND.onrender.com/api/:path*"
    }
  ]
}
```

Replace `YOUR-BACKEND.onrender.com` with your actual backend URL.

2. [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Configure:

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Deploy → open the Vercel URL and test Launch Product.

**Netlify:** Same idea — add to `frontend/netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://YOUR-BACKEND.onrender.com/api/:path"
  status = 200
  force = true
```

Set base directory `frontend`, build `npm run build`, publish `dist`.

---

## Option B — Single server (one URL)

Serve the built React app from Express so `/api` and the UI share one domain. No proxy/rewrite needed.

### Steps

1. Build frontend:
   ```powershell
   cd frontend
   npm run build
   ```

2. Copy build output into backend:
   ```powershell
   cd ..
   Remove-Item -Recurse -Force backend\public -ErrorAction SilentlyContinue
   Copy-Item -Recurse frontend\dist backend\public
   ```

3. Extend `backend/src/server.ts` to serve static files in production (after API routes):

```ts
if (process.env.NODE_ENV === 'production') {
  const publicDir = path.join(backendRoot, 'public')
  app.use(express.static(publicDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}
```

4. Deploy **one** Web Service (Render/Railway):
   - Root: `backend`
   - Build: `npm install && cd ../frontend && npm install && npm run build && cp -r dist ../backend/public`  
     (On Render use a small build script; on Windows locally use `Copy-Item` as above.)
   - Start: `NODE_ENV=production npm start`
   - Env: `GROQ_API_KEY`, `LLM_PROVIDER`

5. Single URL serves both UI and API.

---

## Build commands reference

```powershell
# Install everything
npm run install:all

# Frontend production build
cd frontend
npm run build
# Output: frontend/dist/

# Backend (TypeScript check only; runtime uses tsx)
cd backend
npm run build
npm start
```

---

## Post-deploy checklist

- [ ] `GET /health` returns `"llmConfigured": true`
- [ ] Frontend loads (no blank page / 404 on refresh for client routes)
- [ ] Launch Product modal completes (not 500 / ECONNREFUSED)
- [ ] API keys only in host env vars, not in GitHub
- [ ] `.env.local` not tracked by git (`git status` clean for secrets)

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|--------|-----|
| `500` — No LLM key | Env vars missing on host | Add `GROQ_API_KEY` + `LLM_PROVIDER`; redeploy |
| `404` on `/api/*` from frontend | No proxy/rewrite | Add `vercel.json` or `netlify.toml` (Option A) |
| CORS error | Frontend on different domain calling API directly | Use rewrites (same-origin `/api`) or enable CORS for your frontend URL |
| Works locally, fails in prod | Backend URL wrong in rewrite | Update `vercel.json` destination URL |
| Slow first request | Render free tier cold start | Upgrade or wait ~30s; show loading UI |
| `EADDRINUSE` locally | Old Node process on :3000 | Kill Node in Task Manager; restart backend |

---

## Suggested free-tier stack

```
GitHub
  ├── Render Web Service     →  backend/   (API + secrets)
  └── Vercel                 →  frontend/  (UI + /api rewrite)
```

---

## Custom domain (optional)

1. **Backend:** Render → Settings → Custom Domain → `api.yourdomain.com`
2. **Frontend:** Vercel → Domains → `yourdomain.com`
3. Update `frontend/vercel.json` rewrite destination to `https://api.yourdomain.com/api/:path*`

---

## Related docs

- Local setup: [README.md](./README.md)
- Backend env template: [backend/.env.example](./backend/.env.example)
