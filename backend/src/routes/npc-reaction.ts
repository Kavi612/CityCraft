/**
 * NPC reactions — Express route (Groq or xAI Grok).
 */

import { Router } from 'express'
import { resolveLlmConfig } from '../lib/env.js'
import { chatCompletionWithRetry } from '../lib/llm.js'

const GROK_TIMEOUT_MS = 45_000

type SolutionPayload = {
  approach: string
  customer: string
  revenue: string
  pricing: string
  edge: string
}

type CityContext = {
  id: string
  name: string
}

type ProblemContext = {
  id: string
  name: string
  categoryName: string
  description: string
}

type NpcConsultContext = {
  id: string
  name: string
  profession: string
  sector: string
  personality: string
  influenceLevel: number
}

type NpcReaction = {
  npcId: string
  reactionText: string
  adoptionScore: number
}

type RequestBody = {
  solution: SolutionPayload
  city: CityContext
  problem: ProblemContext
  npcs: NpcConsultContext[]
}

function buildSystemPrompt(): string {
  return [
    'You are the narrative engine for City Craft, a startup simulation set in Tamil Nadu-inspired cities.',
    'Return ONLY a JSON array — no markdown, no code fences, no commentary before or after.',
    'Each array element MUST match this schema exactly:',
    '{ "npcId": string, "reactionText": string, "adoptionScore": number }',
    'Rules:',
    '- Include exactly one object per npcId listed in the user message (same ids, no extras, no omissions).',
    '- reactionText: 2-4 sentences, in-character, referencing the pitch specifics and the NPC sector/personality.',
    '- adoptionScore: integer 0-100 — how likely this NPC is to adopt, support, or champion the solution.',
    '- Do not wrap the array in an object. Do not add fields.',
  ].join('\n')
}

function buildUserPrompt(body: RequestBody): string {
  const npcLines = body.npcs
    .map(
      (npc) =>
        `- id: ${npc.id} | ${npc.name} (${npc.profession}, ${npc.sector}, influence ${npc.influenceLevel}/5) — ${npc.personality}`,
    )
    .join('\n')

  return [
    `City: ${body.city.name} (${body.city.id})`,
    `Problem category: ${body.problem.categoryName}`,
    `Problem: ${body.problem.name} — ${body.problem.description}`,
    '',
    'Startup pitch (player solution):',
    `Approach: ${body.solution.approach}`,
    `Target customer: ${body.solution.customer}`,
    `Revenue model: ${body.solution.revenue}`,
    `Pricing: ${body.solution.pricing}`,
    `Key differentiator: ${body.solution.edge}`,
    '',
    'NPCs to consult (react as each, separately):',
    npcLines,
    '',
    'Respond with the JSON array of NPCReaction objects now.',
  ].join('\n')
}

function extractJsonArray(raw: string): unknown {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed

  const start = candidate.indexOf('[')
  const end = candidate.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model output did not contain a JSON array')
  }

  return JSON.parse(candidate.slice(start, end + 1))
}

function validateNpcReactions(
  parsed: unknown,
  expectedNpcIds: string[],
): NpcReaction[] {
  if (!Array.isArray(parsed)) {
    throw new Error('Parsed value is not an array')
  }

  const reactions: NpcReaction[] = parsed.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Item ${index} is not an object`)
    }

    const record = item as Record<string, unknown>
    const npcId = record.npcId
    const reactionText = record.reactionText
    const adoptionScore = record.adoptionScore

    if (typeof npcId !== 'string' || !npcId.trim()) {
      throw new Error(`Item ${index} has invalid npcId`)
    }
    if (typeof reactionText !== 'string' || !reactionText.trim()) {
      throw new Error(`Item ${index} has invalid reactionText`)
    }
    if (typeof adoptionScore !== 'number' || Number.isNaN(adoptionScore)) {
      throw new Error(`Item ${index} has invalid adoptionScore`)
    }

    const score = Math.round(adoptionScore)
    if (score < 0 || score > 100) {
      throw new Error(`Item ${index} adoptionScore out of range`)
    }

    return {
      npcId: npcId.trim(),
      reactionText: reactionText.trim(),
      adoptionScore: score,
    }
  })

  const returnedIds = new Set(reactions.map((r) => r.npcId))
  for (const id of expectedNpcIds) {
    if (!returnedIds.has(id)) {
      throw new Error(`Missing reaction for npcId "${id}"`)
    }
  }

  if (returnedIds.size !== expectedNpcIds.length) {
    throw new Error('Unexpected extra npcId in response')
  }

  return reactions
}

async function callLlm(
  config: NonNullable<ReturnType<typeof resolveLlmConfig>>,
  body: RequestBody,
): Promise<NpcReaction[]> {
  const content = await chatCompletionWithRetry(
    config,
    [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(body) },
    ],
    { temperature: 0.4, timeoutMs: GROK_TIMEOUT_MS },
  )

  const parsed = extractJsonArray(content)
  const expectedIds = body.npcs.map((npc) => npc.id)
  return validateNpcReactions(parsed, expectedIds)
}

async function fetchWithRetry(
  config: NonNullable<ReturnType<typeof resolveLlmConfig>>,
  body: RequestBody,
): Promise<NpcReaction[]> {
  try {
    return await callLlm(config, body)
  } catch (firstError) {
    try {
      return await callLlm(config, body)
    } catch {
      throw firstError
    }
  }
}

function parseRequestBody(raw: unknown): RequestBody {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid request body')
  }

  const body = raw as Record<string, unknown>
  const solution = body.solution as SolutionPayload
  const city = body.city as CityContext
  const problem = body.problem as ProblemContext
  const npcs = body.npcs as NpcConsultContext[]

  if (
    !solution?.approach ||
    !solution?.customer ||
    !solution?.revenue ||
    !solution?.pricing ||
    !solution?.edge
  ) {
    throw new Error('Missing or incomplete solution object')
  }
  if (!city?.id || !city?.name) {
    throw new Error('Missing city context')
  }
  if (!problem?.id || !problem?.name || !problem?.categoryName) {
    throw new Error('Missing problem context')
  }
  if (!Array.isArray(npcs) || npcs.length === 0) {
    throw new Error('npcs array is required')
  }

  return { solution, city, problem, npcs }
}

const router = Router()

router.post('/', async (req, res) => {
  const llm = resolveLlmConfig()
  if (!llm) {
    return res.status(500).json({
      error:
        'No LLM API key configured. Add GROQ_API_KEY or GROK_API_KEY to backend/.env.local.',
    })
  }

  try {
    const body = parseRequestBody(req.body)
    const reactions = await fetchWithRetry(llm, body)
    return res.status(200).json({ reactions })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error'
    return res.status(502).json({ error: message })
  }
})

export default router
