import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveLlmConfig } from './lib/env.js'
import launchProductRouter from './routes/launch-product.js'
import npcReactionRouter from './routes/npc-reaction.js'

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)

dotenv.config({ path: path.join(backendRoot, '.env.local') })
dotenv.config({ path: path.join(backendRoot, '.env') })

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  const llm = resolveLlmConfig()
  res.json({
    ok: true,
    service: 'city-craft-api',
    llmConfigured: Boolean(llm),
    llmProvider: llm?.provider ?? null,
    llmModel: llm?.model ?? null,
  })
})

app.use('/api/launch-product', launchProductRouter)
app.use('/api/npc-reaction', npcReactionRouter)

const server = app.listen(port, () => {
  const llm = resolveLlmConfig()
  console.log(`City Craft backend listening on http://localhost:${port}`)
  if (!llm) {
    console.warn('[city-craft-api] No LLM key found.')
    console.warn(
      '[city-craft-api] Add GROQ_API_KEY (gsk_...) or GROK_API_KEY (xai-...) to env vars (Render dashboard or backend/.env.local locally).',
    )
  } else {
    console.log(
      `[city-craft-api] LLM ready — provider: ${llm.provider}, model: ${llm.model}`,
    )
  }
})

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `\n[city-craft-api] Port ${port} is already in use.`,
    )
    console.error(
      '[city-craft-api] Another backend is probably still running.',
    )
    console.error(
      `[city-craft-api] Check http://localhost:${port}/health — if it works, you don't need to start again.`,
    )
    console.error(
      '[city-craft-api] To free the port: Task Manager → end the Node.js process, or run:',
    )
    console.error(
      '  Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }',
    )
    process.exit(1)
  }
  throw error
})
