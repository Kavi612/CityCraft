import type {
  City,
  NPC,
  NPCReaction,
  Problem,
  SolutionSummary,
} from '@/types'

type GenerateReactionsInput = {
  npcs: NPC[]
  city: City
  problem: Problem
  solution: SolutionSummary
  startupName: string
}

function findProblemCategory(city: City, problem: Problem): string {
  for (const category of city.categories) {
    if (category.problems.some((item) => item.id === problem.id)) {
      return category.name
    }
  }
  return 'City Services'
}

function hashSeed(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function categoryAffinity(npc: NPC, categoryName: string): number {
  const normalized = categoryName.toLowerCase()
  const match = npc.preferredCategories.some((item) => {
    const preferred = item.toLowerCase()
    return (
      normalized.includes(preferred) ||
      preferred.includes(normalized.split(' ')[0] ?? '')
    )
  })
  return match ? 14 : -6
}

function toneFromScore(score: number): 'warm' | 'mixed' | 'skeptical' {
  if (score >= 65) return 'warm'
  if (score >= 42) return 'mixed'
  return 'skeptical'
}

function buildReactionText(
  npc: NPC,
  input: GenerateReactionsInput,
  categoryName: string,
  adoptionScore: number,
): string {
  const tone = toneFromScore(adoptionScore)
  const approachSnippet = input.solution.approach.split(/[.,]/)[0]?.trim()
  const customerSnippet = input.solution.customer.split(/[.,]/)[0]?.trim()
  const edgeSnippet = input.solution.edge.split(/[.,]/)[0]?.trim()

  const openers: Record<typeof tone, string[]> = {
    warm: [
      `${input.startupName}'s pitch on ${input.problem.name} feels grounded for ${input.city.name}.`,
      `I can see how ${input.startupName} could earn trust quickly in ${categoryName}.`,
      `This is one of the more thoughtful civic pitches I've heard in ${input.city.name} lately.`,
    ],
    mixed: [
      `${input.startupName} has an interesting angle on ${input.problem.name}, but execution details matter.`,
      `The idea around ${approachSnippet} is promising — I'd need clearer proof before backing it fully.`,
      `I'm listening, but ${input.city.name} has seen too many pilots that never scale past a ward office.`,
    ],
    skeptical: [
      `I'm not convinced ${input.startupName} understands how ${categoryName} actually works on the ground.`,
      `The ${input.problem.name} space in ${input.city.name} is crowded with promises — show me outcomes, not slides.`,
      `As a ${npc.profession.toLowerCase()}, I need more than a polished pitch before I stake my name on this.`,
    ],
  }

  const middles: Record<typeof tone, string[]> = {
    warm: [
      `Your focus on ${customerSnippet} lines up with what my network has been asking for.`,
      `${edgeSnippet} could be a real differentiator if you ship in Tamil and English from day one.`,
      `My colleagues in ${npc.sector.toLowerCase()} would take this seriously if you pilot with measurable KPIs.`,
    ],
    mixed: [
      `Pricing and revenue need to survive a municipal audit — that's where most startups stumble.`,
      `I'd want a 90-day pilot with ward-level reporting before I introduce you to decision-makers.`,
      `The approach sounds right, but ${npc.personality.split(';')[0]?.trim().toLowerCase() ?? 'my standards'} still apply.`,
    ],
    skeptical: [
      `Who pays when the corporation delays invoices for six months? That question wasn't answered.`,
      `Unit economics and ward-level adoption data need to be on one page before I'd share this further.`,
      `I've seen ${approachSnippet?.toLowerCase() ?? 'similar ideas'} fail when teams underestimate local operations.`,
    ],
  }

  const closers: Record<typeof tone, string[]> = {
    warm: [
      `Happy to stay in the loop as you launch — reach out when you have a pilot timeline.`,
      `If you keep citizens at the center, I can open a few doors in ${npc.sector.toLowerCase()}.`,
      `Strong start. I'll watch how ${input.startupName} performs in the first quarter.`,
    ],
    mixed: [
      `Come back with one concrete pilot metric and we can talk again.`,
      `I'm cautiously open — prove one ward, then we'll discuss scale.`,
      `Not a no, but not a yes yet. Show me traction in ${input.city.name} first.`,
    ],
    skeptical: [
      `Fix the gaps in your go-to-market story before asking for my endorsement.`,
      `I'll pass for now — too many unknowns for ${input.problem.name} at city scale.`,
      `Revisit this when you have paying customers, not just a blueprint.`,
    ],
  }

  const seed = hashSeed(`${npc.id}-${input.problem.id}`)
  const opener = openers[tone][seed % openers[tone].length]
  const middle = middles[tone][(seed >> 3) % middles[tone].length]
  const closer = closers[tone][(seed >> 6) % closers[tone].length]

  return `${opener} ${middle} ${closer}`
}

/** Deterministic launch reactions for all 20 NPCs — used until Grok is wired client-side. */
export function generateLaunchNpcReactions(
  input: GenerateReactionsInput,
): NPCReaction[] {
  const categoryName = findProblemCategory(input.city, input.problem)

  return input.npcs.map((npc) => {
    const affinity = categoryAffinity(npc, categoryName)
    const influenceBoost = (npc.influenceLevel - 3) * 3
    const personalityMod = (hashSeed(npc.id) % 11) - 5

    const adoptionScore = clampScore(
      npc.approvalRating +
        affinity +
        influenceBoost +
        personalityMod +
        (input.problem.opportunitySize - 3) * 2,
    )

    return {
      npcId: npc.id,
      adoptionScore,
      reactionText: buildReactionText(
        npc,
        input,
        categoryName,
        adoptionScore,
      ),
    }
  })
}
