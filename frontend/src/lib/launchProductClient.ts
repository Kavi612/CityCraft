import {
  ALWAYS_RELEVANT_NPC_IDS,
} from '@/data/npcs'
import { apiUrl } from '@/lib/apiBase'
import { OTHER_ANSWER_MAX_LENGTH } from '@/lib/solutionQuiz'
import { solutionFingerprint } from '@/lib/solutionFingerprint'
import type { City, NPC, Problem, SolutionAnswer, SolutionSummary } from '@/types'

export { solutionFingerprint }

const SOLUTION_FIELD_MAX_LENGTH = 500

export type LaunchProductNpcPayload = {
  id: string
  name: string
  profession: string
  personality: string
  preferredCategories: string[]
  influenceLevel: number
}

export type LaunchProductRequestBody = {
  problem: {
    name: string
    description: string
  }
  solution: SolutionSummary
  cityName: string
  npcs: LaunchProductNpcPayload[]
}

export type LaunchProductNpcReaction = {
  npcId: string
  reactionText: string
  willAdopt: boolean
  adoptionStrength: number
}

export type LaunchProductResponse = {
  estimatedInvestment: number
  npcReactions: LaunchProductNpcReaction[]
  marketNote: string
}

export type LaunchProductErrorResponse = {
  error: string
  code?: string
}

function clampSolutionField(value: string): string {
  return value.trim().slice(0, SOLUTION_FIELD_MAX_LENGTH)
}

function clampSolutionSummary(summary: SolutionSummary): SolutionSummary {
  return {
    approach: clampSolutionField(summary.approach),
    customer: clampSolutionField(summary.customer),
    revenue: clampSolutionField(summary.revenue),
    pricing: clampSolutionField(summary.pricing),
    edge: clampSolutionField(summary.edge),
  }
}

/** Enforce Phase A / quiz length caps before sending to Grok. */
export function sanitizeSolutionForGrok(
  summary: SolutionSummary,
  wasCustomByField?: Partial<Record<keyof SolutionSummary, boolean>>,
): SolutionSummary {
  const clamped = clampSolutionSummary(summary)
  if (!wasCustomByField) return clamped

  const fields: (keyof SolutionSummary)[] = [
    'approach',
    'customer',
    'revenue',
    'pricing',
    'edge',
  ]

  const next = { ...clamped }
  for (const field of fields) {
    if (wasCustomByField[field]) {
      next[field] = next[field].slice(0, OTHER_ANSWER_MAX_LENGTH)
    }
  }
  return next
}

function findProblemCategoryName(city: City, problem: Problem): string {
  for (const category of city.categories) {
    if (category.problems.some((item) => item.id === problem.id)) {
      return category.name
    }
  }
  return 'City Services'
}

function npcMatchesCategory(npc: NPC, categoryName: string): boolean {
  const normalized = categoryName.toLowerCase()

  return npc.preferredCategories.some((preferred) => {
    const token = preferred.toLowerCase()
    return (
      normalized.includes(token) ||
      token.includes(normalized.split(' ')[0] ?? '') ||
      normalized.split(' ').some((part) => token.includes(part))
    )
  })
}

/** Category-matched NPCs plus Mayor, VC, and Journalist — deduped. */
export function selectRelevantNpcsForCategory(
  npcs: NPC[],
  categoryName: string,
): NPC[] {
  const selected = new Map<string, NPC>()

  for (const npc of npcs) {
    if (
      ALWAYS_RELEVANT_NPC_IDS.includes(
        npc.id as (typeof ALWAYS_RELEVANT_NPC_IDS)[number],
      ) ||
      npcMatchesCategory(npc, categoryName)
    ) {
      selected.set(npc.id, npc)
    }
  }

  for (const id of ALWAYS_RELEVANT_NPC_IDS) {
    const npc = npcs.find((item) => item.id === id)
    if (npc) selected.set(npc.id, npc)
  }

  return [...selected.values()]
}

/** Category-matched NPCs plus Mayor, VC, and Journalist — deduped. */
export function selectRelevantNpcs(
  npcs: NPC[],
  city: City,
  problem: Problem,
): NPC[] {
  const categoryName = findProblemCategoryName(city, problem)
  return selectRelevantNpcsForCategory(npcs, categoryName)
}

export type CustomProblemDraft = {
  name: string
  description: string
  categoryName: string
}

export function buildCustomProblemTestRequest(
  city: City,
  customProblem: CustomProblemDraft,
  solution: SolutionSummary,
  npcs: NPC[],
): LaunchProductRequestBody {
  const relevant = selectRelevantNpcsForCategory(
    npcs,
    customProblem.categoryName,
  )

  return {
    problem: {
      name: customProblem.name.trim(),
      description: customProblem.description.trim(),
    },
    solution: sanitizeSolutionForGrok(solution),
    cityName: city.name,
    npcs: relevant.map((npc) => ({
      id: npc.id,
      name: npc.name,
      profession: npc.profession,
      personality: npc.personality,
      preferredCategories: npc.preferredCategories,
      influenceLevel: npc.influenceLevel,
    })),
  }
}

export function buildLaunchProductRequest(
  city: City,
  problem: Problem,
  solution: SolutionSummary,
  npcs: NPC[],
  solutionAnswers?: SolutionAnswer[],
): LaunchProductRequestBody {
  const relevant = selectRelevantNpcs(npcs, city, problem)
  const wasCustomByField = solutionAnswers?.reduce(
    (acc, answer) => {
      if (answer.wasCustom) {
        acc[answer.questionId as keyof SolutionSummary] = true
      }
      return acc
    },
    {} as Partial<Record<keyof SolutionSummary, boolean>>,
  )

  return {
    problem: {
      name: problem.name,
      description: problem.description,
    },
    solution: sanitizeSolutionForGrok(solution, wasCustomByField),
    cityName: city.name,
    npcs: relevant.map((npc) => ({
      id: npc.id,
      name: npc.name,
      profession: npc.profession,
      personality: npc.personality,
      preferredCategories: npc.preferredCategories,
      influenceLevel: npc.influenceLevel,
    })),
  }
}

export async function fetchLaunchProductVerification(
  body: LaunchProductRequestBody,
): Promise<LaunchProductResponse> {
  const response = await fetch(apiUrl('/api/launch-product'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const rawBody = await response.text()
  let payload: unknown

  if (!rawBody.trim()) {
    throw new Error(
      'Launch API is not reachable. Run `npm run dev` in the backend folder (port 3000), then click Retry.',
    )
  }

  try {
    payload = JSON.parse(rawBody)
  } catch {
    throw new Error(
      'Launch API returned an invalid response. Ensure the backend is running on port 3000.',
    )
  }

  if (!response.ok) {
    const errorBody = payload as LaunchProductErrorResponse
    throw new Error(
      errorBody?.error ??
        "Couldn't reach the network right now — try again in a moment",
    )
  }

  const result = payload as LaunchProductResponse
  if (
    typeof result.estimatedInvestment !== 'number' ||
    !Array.isArray(result.npcReactions) ||
    typeof result.marketNote !== 'string'
  ) {
    throw new Error('Launch verification returned an unexpected shape')
  }

  return result
}
