# City Craft — Deployment (Render + Vercel)

Deploy the **backend on Render** and the **frontend on Vercel**.

| Part | Host | Folder |
|------|------|--------|
| **Backend** (API + AI keys) | [Render](https://render.com) | `backend/` |
| **Frontend** (React UI) | [Vercel](https://vercel.com) | `frontend/` |

Locally, Vite proxies `/api/*` to `http://localhost:3000`. In production, Vercel rewrites `/api/*` to your Render backend URL.

---

## Prerequisites

1. Code pushed to **GitHub** — never commit secrets (`backend/.env.local` is gitignored).
2. Local smoke test passes:
   ```powershell
   cd backend && npm run dev    # http://localhost:3000/health → llmConfigured: true
   cd frontend && npm run dev   # app loads on http://localhost:5173
   ```

---

## Step 1 — Deploy backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your **CityCraft** GitHub repo
3. Configure:

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

4. **Environment** tab — add:

| Variable | Value |
|----------|--------|
| `LLM_PROVIDER` | `groq` (or `xai`) |
| `GROQ_API_KEY` | your `gsk_...` key from [console.groq.com/keys](https://console.groq.com/keys) |

For xAI Grok instead: `LLM_PROVIDER=xai` and `GROK_API_KEY=xai-...`

Optional: `GROQ_MODEL` (default `llama-3.3-70b-versatile`) or `GROK_MODEL` (default `grok-2-latest`)

5. Click **Deploy**
6. When live, open: `https://YOUR-SERVICE.onrender.com/health`  
   Expected: `"llmConfigured": true`, `"llmProvider": "groq"`

Copy your Render URL (e.g. `https://citycraft-api.onrender.com`).

> **Note:** Render free tier sleeps after inactivity — the first request after idle may take ~30 seconds.

---

## Step 2 — Deploy frontend on Vercel

The frontend calls `/api/launch-product` with a relative URL. Vercel proxies those requests to Render.

1. Edit `frontend/vercel.json` — replace the placeholder with your Render URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-SERVICE.onrender.com/api/:path*"
    }
  ]
}
```

2. Commit and push the updated `vercel.json`
3. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
4. Configure:

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

5. Deploy — no environment variables needed on Vercel (API is proxied via `vercel.json`)
6. Open your Vercel URL and test **Launch Product**

---

## Architecture

```
User
  └── Vercel (frontend/)          →  React app
        └── /api/*  rewrite  →    Render (backend/)  →  Groq / Grok API
```

---

## Post-deploy checklist

- [ ] `https://YOUR-SERVICE.onrender.com/health` → `"llmConfigured": true`
- [ ] Vercel site loads (no blank page)
- [ ] **Launch Product** completes (not 500 / network error)
- [ ] API keys only in **Render** env vars, not in GitHub
- [ ] `backend/.env.local` not tracked by git

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|--------|-----|
| `500` — No LLM key | Env vars missing on Render | Add `GROQ_API_KEY` + `LLM_PROVIDER`; redeploy |
| `404` on `/api/*` | Missing or wrong `vercel.json` | Set destination to your Render URL; redeploy Vercel |
| Works locally, fails in prod | Backend URL wrong in rewrite | Update `frontend/vercel.json` destination |
| Slow first request | Render free tier cold start | Wait ~30s; loading UI already shown in modal |
| Push blocked by GitHub | API key committed to git | Remove from history; rotate key; use Render env vars |

---

## Custom domain (optional)

1. **Render:** Settings → Custom Domain → e.g. `api.yourdomain.com`
2. **Vercel:** Project → Domains → e.g. `yourdomain.com`
3. Update `frontend/vercel.json` rewrite destination to `https://api.yourdomain.com/api/:path*`

---

## Related docs

- Local setup: [README.md](./README.md)
- Backend env template: [backend/.env.example](./backend/.env.example)
