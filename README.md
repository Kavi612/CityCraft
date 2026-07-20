# City Craft

Startup simulation game set in Tamil Nadu-inspired cities. Complete the blueprint quiz, launch your product with AI verification, and manage your startup dashboard.

## Prerequisites

- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **npm** (comes with Node)
- An **AI API key** (pick one):
  - **Groq** (recommended for local dev) — free at [console.groq.com/keys](https://console.groq.com/keys), key starts with `gsk_`
  - **xAI Grok** — [console.x.ai](https://console.x.ai/), key starts with `xai-`

> **Groq ≠ Grok** — different companies, different keys, different APIs. Don't mix them up.

## Folder structure

```
CityCraft/
├── backend/          ← Express API (port 3000)
│   ├── src/
│   │   ├── server.ts
│   │   ├── lib/          (env, llm client)
│   │   └── routes/
│   │       ├── launch-product.ts
│   │       └── npc-reaction.ts
│   ├── .env.example
│   ├── .env.local        ← you create this (gitignored)
│   └── package.json
├── frontend/         ← React + Vite (port 5173)
│   ├── src/
│   ├── public/
│   └── package.json
└── package.json      ← shortcuts from repo root
```

---

## Run from scratch

### Step 1 — Clone / open the project

```powershell
cd "path\to\CityCraft"
```

### Step 2 — Install dependencies

**Option A — install both at once (from repo root):**

```powershell
npm run install:all
```
c
**Option B — install separately:**

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### Step 3 — Configure the backend API key

```powershell
cd backend
copy .env.example .env.local
```

Open `backend/.env.local` in your editor and paste your key.

**Using Groq (recommended):**

```env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_actual_key_here
```

**Using xAI Grok:**

```env
LLM_PROVIDER=xai
GROK_API_KEY=xai-your_actual_key_here
```

Save the file (`Ctrl+S`).

### Step 4 — Start the backend

Open **Terminal 1**:

```powershell
cd backend
npm run dev
```

You should see:

```
City Craft backend listening on http://localhost:3000
[city-craft-api] LLM ready — provider: groq, model: llama-3.3-70b-versatile
```

If you see **"No LLM key found"**, your `.env.local` is missing, unsaved, or still has the placeholder value.

**Verify:** open http://localhost:3000/health — expect `"llmConfigured": true`.

### Step 5 — Start the frontend

Open **Terminal 2**:

```powershell
cd frontend
npm run dev
```

You should see:

```
➜  Local:   http://localhost:5173/
```

Or from repo root: `npm run dev:frontend`

### Step 6 — Play the game

1. Open **http://localhost:5173/**
2. **Landing** → Choose Founder → Choose City → City Map
3. Pick a **category** → pick a **problem** → complete the **Blueprint quiz** (5 sections)
4. On **Company Setup**, the **Launch Product** modal opens (Grok/Groq verification)
5. Review investment + NPC reactions → **Confirm Launch**
6. Enter founder/startup name → **Launch Startup** → **Dashboard**

---

## Quick reference

| Service  | URL                      | Command (in folder) |
|----------|--------------------------|---------------------|
| Backend  | http://localhost:3000    | `npm run dev`       |
| Frontend | http://localhost:5173    | `npm run dev`       |
| Health   | http://localhost:3000/health | —               |

**Root shortcuts:**

```powershell
npm run dev:backend    # start API
npm run dev:frontend   # start UI
npm run build          # production build (frontend)
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check + LLM provider status |
| POST | `/api/launch-product` | AI launch verification (investment + NPC reactions) |
| POST | `/api/npc-reaction` | AI NPC pitch reactions |

---

## Troubleshooting

### `500` on `/api/launch-product` — "No LLM API key configured"

- Edit `backend/.env.local` with a real key (not `your_groq_api_key_here`)
- Save the file, then **restart the backend** (`Ctrl+C` → `npm run dev`)

### `ECONNREFUSED` / "Launch API is not reachable"

- The **backend is not running**. Start Terminal 1 with `cd backend && npm run dev` before using the frontend.

### `EADDRINUSE: port 3000`

- An old backend process is still running. In PowerShell:

```powershell
netstat -ano | findstr :3000
taskkill /PID <pid_from_last_column> /F
```

Then start the backend again.

### Groq key in `GROK_API_KEY` (or vice versa)

- Groq keys (`gsk_...`) → `GROQ_API_KEY` with `LLM_PROVIDER=groq`
- xAI keys (`xai-...`) → `GROK_API_KEY` with `LLM_PROVIDER=xai`

### Frontend shows old errors after fixes

- Hard refresh the browser (`Ctrl+Shift+R`)
- Confirm http://localhost:3000/health shows `"llmConfigured": true` before retrying Launch Product

---

## Production deployment

Deploy **backend → Render**, **frontend → Vercel**. See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

```powershell
cd frontend
npm run build
```

Output goes to `frontend/dist/` (Vercel builds this automatically on deploy).