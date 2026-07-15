/**
 * Launch Product with AI Verification — Express route (Phase A).
 *
 * Env: GROQ_API_KEY or GROK_API_KEY in backend/.env.local
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

type ProblemPayload = {
  name: string
  description: string
}

type NpcPayload = {
  id: string
  name: string
  profession: string
  personality: string
  preferredCategories: string[]
  influenceLevel: number
}

type RequestBody = {
  problem: ProblemPayload
  solution: SolutionPayload
  cityName: string
  npcs: NpcPayload[]
}

export type LaunchProductNpcReaction = {
  npcId: string
  reactionText: string
  willAdopt: boolean
  adoptionStrength: number
}

export type LaunchProductResult = {
  estimatedInvestment: number
  npcReactions: LaunchProductNpcReaction[]
  marketNote: string
}

type ErrorResponse = {
  error: string
  code:
    | 'METHOD_NOT_ALLOWED'
    | 'MISSING_API_KEY'
    | 'INVALID_REQUEST'
    | 'GROK_TIMEOUT'
    | 'GROK_API_ERROR'
    | 'GROK_PARSE_ERROR'
    | 'GROK_VALIDATION_ERROR'
}

function buildSystemPrompt(): string {
  return [
    'You are the launch verification engine for City Craft, a civic startup simulation in Tamil Nadu-inspired cities.',
    'Return ONLY a single JSON object — no markdown, no code fences, no commentary before or after.',
    'The object MUST match this schema exactly:',
    '{',
    '  "estimatedInvestment": number,',
    '  "npcReactions": [',
    '    {',
    '      "npcId": string,',
    '      "reactionText": string,',
    '      "willAdopt": boolean,',
    '      "adoptionStrength": number',
    '    }',
    '  ],',
    '  "marketNote": string',
    '}',
    'Rules:',
    '- estimatedInvestment: whole-number rupees (INR) to realistically build and launch THIS specific solution from its approach, scope, and complexity — not a generic constant.',
    '- npcReactions: exactly one entry per NPC id provided in the user message (same ids, no extras, no omissions).',
    '- reactionText: 1-2 sentences, in-character, referencing the player\'s actual quiz answers — adopt or reject with a concrete reason.',
    '- willAdopt: true only if this NPC would realistically adopt, buy, champion, or fund the solution now.',
    '- adoptionStrength: integer 0-100 — strength of adoption/support (0 = firm reject, 100 = enthusiastic adopt).',
    '- marketNote: one short realistic sentence of market commentary on this specific solution in the given city.',
    '- Do not wrap the object in an array. Do not add extra fields.',
  ].join('\n')
}

function buildUserPrompt(body: RequestBody): string {
  const npcLines = body.npcs
    .map(
      (npc) =>
        [
          `- id: ${npc.id}`,
          `  name: ${npc.name}`,
          `  profession: ${npc.profession}`,
          `  personality: ${npc.personality}`,
          `  preferredCategories: ${npc.preferredCategories.join(', ')}`,
          `  influenceLevel: ${npc.influenceLevel}/5`,
        ].join('\n'),
    )
    .join('\n')

  return [
    `City: ${body.cityName}`,
    `Problem: ${body.problem.name}`,
    `Problem description: ${body.problem.description}`,
    '',
    'Player solution (from 5-question quiz):',
    `Approach: ${body.solution.approach}`,
    `Target customer: ${body.solution.customer}`,
    `Revenue model: ${body.solution.revenue}`,
    `Pricing tier: ${body.solution.pricing}`,
    `Differentiator: ${body.solution.edge}`,
    '',
    'NPCs to evaluate (one reaction each):',
    npcLines,
    '',
    'Respond with the JSON object now.',
  ].join('\n')
}

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed

  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model output did not contain a JSON object')
  }

  return JSON.parse(candidate.slice(start, end + 1))
}

function validateLaunchProductResult(
  parsed: unknown,
  expectedNpcIds: string[],
): LaunchProductResult {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Parsed value is not an object')
  }

  const record = parsed as Record<string, unknown>
  const estimatedInvestment = record.estimatedInvestment
  const marketNote = record.marketNote
  const npcReactionsRaw = record.npcReactions

  if (
    typeof estimatedInvestment !== 'number' ||
    Number.isNaN(estimatedInvestment) ||
    !Number.isFinite(estimatedInvestment)
  ) {
    throw new Error('estimatedInvestment must be a finite number')
  }

  const investment = Math.round(estimatedInvestment)
  if (investment < 0) {
    throw new Error('estimatedInvestment must be non-negative')
  }

  if (typeof marketNote !== 'string' || !marketNote.trim()) {
    throw new Error('marketNote must be a non-empty string')
  }

  if (!Array.isArray(npcReactionsRaw)) {
    throw new Error('npcReactions must be an array')
  }

  const npcReactions: LaunchProductNpcReaction[] = npcReactionsRaw.map(
    (item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`npcReactions[${index}] is not an object`)
      }

      const reaction = item as Record<string, unknown>
      const npcId = reaction.npcId
      const reactionText = reaction.reactionText
      const willAdopt = reaction.willAdopt
      const adoptionStrength = reaction.adoptionStrength

      if (typeof npcId !== 'string' || !npcId.trim()) {
        throw new Error(`npcReactions[${index}] has invalid npcId`)
      }
      if (typeof reactionText !== 'string' || !reactionText.trim()) {
        throw new Error(`npcReactions[${index}] has invalid reactionText`)
      }
      if (typeof willAdopt !== 'boolean') {
        throw new Error(`npcReactions[${index}] has invalid willAdopt`)
      }
      if (
        typeof adoptionStrength !== 'number' ||
        Number.isNaN(adoptionStrength)
      ) {
        throw new Error(`npcReactions[${index}] has invalid adoptionStrength`)
      }

      const strength = Math.round(adoptionStrength)
      if (strength < 0 || strength > 100) {
        throw new Error(`npcReactions[${index}] adoptionStrength out of range`)
      }

      return {
        npcId: npcId.trim(),
        reactionText: reactionText.trim(),
        willAdopt,
        adoptionStrength: strength,
      }
    },
  )

  const returnedIds = new Set(npcReactions.map((r) => r.npcId))
  for (const id of expectedNpcIds) {
    if (!returnedIds.has(id)) {
      throw new Error(`Missing reaction for npcId "${id}"`)
    }
  }

  if (returnedIds.size !== expectedNpcIds.length) {
    throw new Error('Unexpected extra npcId in npcReactions')
  }

  return {
    estimatedInvestment: investment,
    npcReactions,
    marketNote: marketNote.trim(),
  }
}

async function callLlm(
  config: NonNullable<ReturnType<typeof resolveLlmConfig>>,
  body: RequestBody,
): Promise<LaunchProductResult> {
  const content = await chatCompletionWithRetry(
    config,
    [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(body) },
    ],
    { temperature: 0.35, timeoutMs: GROK_TIMEOUT_MS },
  )

  const parsed = extractJsonObject(content)
  const expectedIds = body.npcs.map((npc) => npc.id)
  return validateLaunchProductResult(parsed, expectedIds)
}

async function fetchWithRetry(
  config: NonNullable<ReturnType<typeof resolveLlmConfig>>,
  body: RequestBody,
): Promise<LaunchProductResult> {
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
  const problem = body.problem as ProblemPayload
  const solution = body.solution as SolutionPayload
  const cityName = body.cityName
  const npcs = body.npcs as NpcPayload[]

  if (!problem?.name?.trim() || !problem?.description?.trim()) {
    throw new Error('problem.name and problem.description are required')
  }

  if (
    !solution?.approach?.trim() ||
    !solution?.customer?.trim() ||
    !solution?.revenue?.trim() ||
    !solution?.pricing?.trim() ||
    !solution?.edge?.trim()
  ) {
    throw new Error('solution must include approach, customer, revenue, pricing, and edge')
  }

  if (typeof cityName !== 'string' || !cityName.trim()) {
    throw new Error('cityName is required')
  }

  if (!Array.isArray(npcs) || npcs.length === 0) {
    throw new Error('npcs array is required and must not be empty')
  }

  for (const [index, npc] of npcs.entries()) {
    if (!npc?.id?.trim()) throw new Error(`npcs[${index}].id is required`)
    if (!npc?.name?.trim()) throw new Error(`npcs[${index}].name is required`)
    if (!npc?.profession?.trim()) {
      throw new Error(`npcs[${index}].profession is required`)
    }
    if (!npc?.personality?.trim()) {
      throw new Error(`npcs[${index}].personality is required`)
    }
    if (!Array.isArray(npc.preferredCategories)) {
      throw new Error(`npcs[${index}].preferredCategories must be an array`)
    }
    if (
      typeof npc.influenceLevel !== 'number' ||
      npc.influenceLevel < 1 ||
      npc.influenceLevel > 5
    ) {
      throw new Error(`npcs[${index}].influenceLevel must be 1-5`)
    }
  }

  return {
    problem: {
      name: problem.name.trim(),
      description: problem.description.trim(),
    },
    solution: {
      approach: solution.approach.trim(),
      customer: solution.customer.trim(),
      revenue: solution.revenue.trim(),
      pricing: solution.pricing.trim(),
      edge: solution.edge.trim(),
    },
    cityName: cityName.trim(),
    npcs: npcs.map((npc) => ({
      id: npc.id.trim(),
      name: npc.name.trim(),
      profession: npc.profession.trim(),
      personality: npc.personality.trim(),
      preferredCategories: npc.preferredCategories.map((c) => String(c).trim()),
      influenceLevel: npc.influenceLevel,
    })),
  }
}

function classifyError(error: unknown): { status: number; body: ErrorResponse } {
  const message =
    error instanceof Error ? error.message : 'Unknown server error'

  if (message.includes('timed out')) {
    return {
      status: 504,
      body: { error: message, code: 'GROK_TIMEOUT' },
    }
  }

  if (message.startsWith('Grok API error')) {
    return {
      status: 502,
      body: { error: message, code: 'GROK_API_ERROR' },
    }
  }

  if (
    message.includes('JSON') ||
    message.includes('invalid') ||
    message.includes('Missing reaction') ||
    message.includes('must be')
  ) {
    return {
      status: 502,
      body: { error: message, code: 'GROK_VALIDATION_ERROR' },
    }
  }

  if (message.includes('Parse') || message.includes('parse')) {
    return {
      status: 502,
      body: { error: message, code: 'GROK_PARSE_ERROR' },
    }
  }

  return {
    status: 502,
    body: { error: message, code: 'GROK_API_ERROR' },
  }
}

const router = Router()

router.post('/', async (req, res) => {
  const llm = resolveLlmConfig()
  if (!llm) {
    return res.status(500).json({
      error:
        'No LLM API key configured. Add GROQ_API_KEY or GROK_API_KEY to backend/.env.local and restart the backend.',
      code: 'MISSING_API_KEY',
    } satisfies ErrorResponse)
  }

  let body: RequestBody
  try {
    body = parseRequestBody(req.body)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Invalid request body'
    return res.status(400).json({
      error: message,
      code: 'INVALID_REQUEST',
    } satisfies ErrorResponse)
  }

  try {
    const result = await fetchWithRetry(llm, body)
    return res.status(200).json(result)
  } catch (error) {
    const { status, body: errorBody } = classifyError(error)
    return res.status(status).json(errorBody)
  }
})

export default router
