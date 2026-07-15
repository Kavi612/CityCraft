import type { PlayerStats } from '@/types'

/**
 * Action Panel wiring (Phase 13):
 * ```ts
 * const delta = hire(stats)
 * if (canAfford(stats, delta)) applyStatDelta(delta)
 * ```
 * These functions only **compute** deltas — never touch the store.
 * `applyStatDelta` (Phase 6) merges, clamps scores, and recalculates companyValue.
 */

export type ActionId =
  | 'hire'
  | 'develop'
  | 'adjustPricing'
  | 'runMarketing'
  | 'lobbyGovernment'

/** Cash outflow magnitude for UI affordance checks (absolute value). */
export function actionCashCost(delta: Partial<PlayerStats>): number {
  const cashDelta = delta.cash ?? 0
  return cashDelta < 0 ? Math.abs(cashDelta) : 0
}

export function canAffordAction(
  stats: PlayerStats,
  delta: Partial<PlayerStats>,
): boolean {
  return stats.cash >= actionCashCost(delta)
}

/**
 * Hire — add one small-team pod (sales + support).
 * - ₹1.2L cash: realistic monthly pod cost for an early TN startup.
 * - +₹1.2L expenses: books the burn into cumulative expenses.
 * - +8 customers: extra capacity to onboard/serve accounts this turn.
 * - +1 reputation: smoother delivery as staffing improves.
 */
export function hire(_stats: PlayerStats): Partial<PlayerStats> {
  return {
    cash: -120_000,
    expenses: 120_000,
    customers: 8,
    reputation: 1,
  }
}

/**
 * Develop — ship a meaningful product iteration.
 * - ₹2L cash + expenses: one sprint cycle (design + eng + QA).
 * - +₹15k revenue: run-rate lift from a shippable feature (annualised monthly bump).
 * - +2 reputation / +1 investorConfidence: product progress signal.
 * companyValue rises via revenue + reputation through applyStatDelta recalc.
 */
export function develop(_stats: PlayerStats): Partial<PlayerStats> {
  return {
    cash: -200_000,
    expenses: 200_000,
    revenue: 15_000,
    reputation: 2,
    investorConfidence: 1,
  }
}

/**
 * Adjust pricing — raise prices this turn (deterministic tradeoff).
 * - +₹25k revenue: higher ARPU on retained accounts.
 * - −6 customers: price-sensitive churn (ratio ~4.2k revenue per lost customer).
 * - −1 publicTrust: mild backlash from sticker shock in a civic-facing market.
 */
export function adjustPricing(_stats: PlayerStats): Partial<PlayerStats> {
  return {
    revenue: 25_000,
    customers: -6,
    publicTrust: -1,
  }
}

/**
 * Run marketing — paid acquisition + brand push.
 * - ₹1.5L cash spend.
 * - +12 customers: ₹12.5k effective CAC (150k / 12).
 * - +2 reputation: every ₹75k spend buys ~1 reputation point here (150k → 2).
 * - +1 publicTrust: visible community outreach bundled into the campaign.
 */
export function runMarketing(_stats: PlayerStats): Partial<PlayerStats> {
  return {
    cash: -150_000,
    expenses: 150_000,
    customers: 12,
    reputation: 2,
    publicTrust: 1,
  }
}

/**
 * Lobby government — pursue permits, pilots, or ward-office relationships.
 * - ₹80k cash: filings, meetings, compliance consultants.
 * - +6 governmentSupport: meaningful bump on 0–100 scale for one lobbying push.
 * - −1 reputation / −1 investorConfidence: optics cost of playing politics.
 */
export function lobbyGovernment(_stats: PlayerStats): Partial<PlayerStats> {
  return {
    cash: -80_000,
    expenses: 80_000,
    governmentSupport: 6,
    reputation: -1,
    investorConfidence: -1,
  }
}

const ACTION_HANDLERS: Record<
  ActionId,
  (stats: PlayerStats) => Partial<PlayerStats>
> = {
  hire,
  develop,
  adjustPricing,
  runMarketing,
  lobbyGovernment,
}

export function getActionDelta(
  actionId: ActionId,
  stats: PlayerStats,
): Partial<PlayerStats> {
  return ACTION_HANDLERS[actionId](stats)
}
