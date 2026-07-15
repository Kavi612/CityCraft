import type { LaunchProductResponse } from '@/lib/launchProductClient'
import { formatRupeeShort } from '@/lib/formatRupee'
import type {
  DashboardActivity,
  NPC,
  NPCReaction,
  PlayerStats,
  Problem,
  SolutionSummary,
} from '@/types'

export type LaunchProductEconomics = {
  adoptionPercentage: number
  customers: number
  revenue: number
  investment: number
  netCash: number
  statDelta: Partial<PlayerStats>
  npcReactions: NPCReaction[]
}

export function computeWeightedAdoptionPercentage(
  reactions: LaunchProductResponse['npcReactions'],
  npcs: NPC[],
): number {
  let totalWeight = 0
  let adopterWeight = 0

  for (const reaction of reactions) {
    const npc = npcs.find((item) => item.id === reaction.npcId)
    const weight = npc?.influenceLevel ?? 1
    totalWeight += weight
    if (reaction.willAdopt) {
      adopterWeight += weight
    }
  }

  if (totalWeight === 0) return 0
  return Math.round((adopterWeight / totalWeight) * 100)
}

/** Per-customer revenue from the player's pricing tier text — respects Grok adoption, not a fixed tier table. */
export function perCustomerRevenue(pricing: string, problem: Problem): number {
  const base = 1_200 + problem.opportunitySize * 800 + problem.difficulty * 200
  const text = pricing.toLowerCase()

  if (
    /free|pilot|subsidy|discount|budget|student|micro|₹99|₹45\/|ward bundle|citizen/.test(
      text,
    )
  ) {
    return Math.round(base * 0.65)
  }

  if (
    /premium|enterprise|outcome|crore|lakh\/year|annual contract|performance|saas license/.test(
      text,
    )
  ) {
    return Math.round(base * 1.85)
  }

  return Math.round(base)
}

export function computeLaunchProductEconomics(
  grokResult: LaunchProductResponse,
  npcs: NPC[],
  problem: Problem,
  solution: SolutionSummary,
  currentStats: PlayerStats,
): LaunchProductEconomics {
  const investment = Math.max(0, Math.round(grokResult.estimatedInvestment))
  const adoptionPercentage = computeWeightedAdoptionPercentage(
    grokResult.npcReactions,
    npcs,
  )

  const hasAdopters = grokResult.npcReactions.some((item) => item.willAdopt)
  const customers = hasAdopters
    ? Math.max(
        1,
        Math.round((adoptionPercentage / 100) * problem.opportunitySize * 12),
      )
    : 0

  const ticket = perCustomerRevenue(solution.pricing, problem)
  const revenue = customers * ticket
  const netCash = revenue - investment - currentStats.expenses
  const scoreShift = Math.round((adoptionPercentage - 50) / 4)

  const npcReactions: NPCReaction[] = grokResult.npcReactions.map(
    (reaction) => ({
      npcId: reaction.npcId,
      reactionText: reaction.reactionText,
      adoptionScore: reaction.willAdopt
        ? reaction.adoptionStrength
        : Math.max(0, Math.round(reaction.adoptionStrength * 0.45)),
    }),
  )

  return {
    adoptionPercentage,
    customers,
    revenue,
    investment,
    netCash,
    statDelta: {
      cash: netCash,
      revenue,
      expenses: investment,
      customers,
      reputation: scoreShift,
      publicTrust: Math.round(scoreShift * 0.9),
      investorConfidence: Math.round(scoreShift * 0.5),
      governmentSupport: Math.round(scoreShift * 0.35),
    },
    npcReactions,
  }
}

export function buildGrokLaunchActivities(
  economics: LaunchProductEconomics,
  grokResult: LaunchProductResponse,
  npcs: NPC[],
  problem: Problem,
  turn: number,
): DashboardActivity[] {
  const profitLabel =
    economics.netCash >= 0
      ? `${formatRupeeShort(economics.netCash)} profit`
      : `${formatRupeeShort(Math.abs(economics.netCash))} loss`

  const summary: DashboardActivity = {
    id: `launch-grok-summary-${problem.id}`,
    type: 'launch',
    title: `Grok launch: ${profitLabel}`,
    subtitle: `${formatRupeeShort(economics.investment)} invested · ${economics.adoptionPercentage}% weighted adoption · ${economics.customers} customers · Turn ${turn}`,
    sentiment:
      economics.netCash > 0
        ? 'positive'
        : economics.netCash < 0
          ? 'negative'
          : 'neutral',
    turn,
  }

  const npcActivities = grokResult.npcReactions.map((reaction) => {
    const npc = npcs.find((item) => item.id === reaction.npcId)
    const snippet =
      reaction.reactionText.length > 72
        ? `${reaction.reactionText.slice(0, 72)}…`
        : reaction.reactionText

    return {
      id: `launch-grok-${reaction.npcId}`,
      type: 'launch' as const,
      title: `${npc?.name ?? 'Citizen'} — ${reaction.willAdopt ? 'Adopting' : 'Not adopting'}`,
      subtitle: snippet,
      sentiment: reaction.willAdopt
        ? ('positive' as const)
        : ('negative' as const),
      turn,
    }
  })

  return [summary, ...npcActivities]
}

export function launchProductEventId(
  problemId: string,
  economics: LaunchProductEconomics,
): string {
  return [
    'launch-product',
    problemId,
    `inv-${economics.investment}`,
    `adopt-${economics.adoptionPercentage}`,
    `net-${economics.netCash}`,
    `customers-${economics.customers}`,
  ].join(':')
}
