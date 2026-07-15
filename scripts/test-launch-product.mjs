/**
 * Phase A smoke test for POST /api/launch-product
 *
 * Usage (missing key — expect 500 MISSING_API_KEY):
 *   npx tsx scripts/test-launch-product.mjs
 *
 * Usage (live Grok call — expect 200 + JSON result):
 *   GROK_API_KEY=your_key npx tsx scripts/test-launch-product.mjs --live
 *
 * With Vercel dev running (npx vercel dev):
 *   curl -X POST http://localhost:3000/api/launch-product -H "Content-Type: application/json" -d @scripts/sample-launch-product.json
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const samplePath = join(__dirname, 'sample-launch-product.json')
const sampleBody = JSON.parse(readFileSync(samplePath, 'utf8'))

const live = process.argv.includes('--live')

function createMockRes() {
  const state = { statusCode: 200, body: null }
  const res = {
    setHeader() {
      return res
    },
    status(code) {
      state.statusCode = code
      return res
    },
    json(payload) {
      state.body = payload
      return res
    },
    get result() {
      return state
    },
  }
  return res
}

async function runHandlerTest() {
  const { default: handler } = await import('../api/launch-product.ts')
  const req = { method: 'POST', body: sampleBody }
  const res = createMockRes()

  const savedKey = process.env.GROK_API_KEY
  if (!live) {
    delete process.env.GROK_API_KEY
  }

  await handler(req, res)

  if (!live) {
    if (savedKey) process.env.GROK_API_KEY = savedKey
    else delete process.env.GROK_API_KEY
  }

  return res.result
}

console.log('=== Phase A: /api/launch-product ===')
console.log(`Mode: ${live ? 'LIVE Grok' : 'missing API key check'}`)
console.log('Sample payload:', samplePath)
console.log('')

const result = await runHandlerTest()
console.log('HTTP status:', result.statusCode)
console.log('Response body:')
console.log(JSON.stringify(result.body, null, 2))

if (!live && result.statusCode === 500 && result.body?.code === 'MISSING_API_KEY') {
  console.log('\nPASS — missing key returns structured error.')
} else if (live && result.statusCode === 200 && result.body?.estimatedInvestment != null) {
  console.log('\nPASS — live Grok returned structured launch result.')
} else if (!live) {
  console.log('\nUnexpected result for missing-key test.')
  process.exit(1)
}
