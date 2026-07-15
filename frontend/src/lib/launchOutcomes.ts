import type { NPCReaction, PlayerStats, Problem } from '@/types'
import type { ExpenseLineItem } from '@/types'

export type LaunchOutcome = {
  delta: Partial<PlayerStats>
  breakdown: ExpenseLineItem[]
}

/**
 * Month-1 economics: revenue from early adopters, expenses from team + ops burn.
 * Cash moves by net (revenue − expenses) so the books stay logical.
 */
export function computeLaunchOutcomes(
  reactions: NPCReaction[],
  problem: Problem,
): LaunchOutcome {
  if (reactions.length === 0) {
    return { delta: {}, breakdown: [] }
  }

  const avgAdoption =
    reactions.reduce((sum, reaction) => sum + reaction.adoptionScore, 0) /
    reactions.length

  const customers = Math.max(
    1,
    Math.round((avgAdoption / 100) * problem.opportunitySize * 12),
  )
  const avgTicket = 1_800 + problem.opportunitySize * 600
  const revenue = customers * avgTicket

  const breakdown: ExpenseLineItem[] = [
    {
      category: 'team',
      label: 'Founding team salaries',
      amount: 140_000 + problem.difficulty * 12_000,
    },
    {
      category: 'product',
      label: 'Cloud, APIs & dev tools',
      amount: 35_000 + problem.opportunitySize * 6_000,
    },
    {
      category: 'operations',
      label: 'Delivery & customer support',
      amount: customers * 420 + 18_000,
    },
    {
      category: 'marketing',
      label: 'Launch outreach & demos',
      amount: Math.round(30_000 + avgAdoption * 500),
    },
    {
      category: 'government',
      label: 'Licences & ward-office compliance',
      amount: 22_000 + problem.difficulty * 4_000,
    },
  ]

  const expenses = breakdown.reduce((sum, item) => sum + item.amount, 0)
  const netCash = revenue - expenses
  const scoreShift = Math.round((avgAdoption - 50) / 4)

  return {
    breakdown,
    delta: {
      customers,
      revenue,
      expenses,
      cash: netCash,
      reputation: scoreShift,
      publicTrust: Math.round(scoreShift * 0.9),
      investorConfidence: Math.round(scoreShift * 0.75),
      governmentSupport: Math.round(scoreShift * 0.6),
    },
  }
}
