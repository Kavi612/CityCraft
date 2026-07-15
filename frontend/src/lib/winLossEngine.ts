import type { PlayerStats } from '@/types'

/**
 * Win / loss evaluation (Phase 15).
 *
 * Pure functions only — no store access. Dashboard calls `evaluateWinLoss` after
 * each `advanceTurn` (once actions/events for that turn are applied).
 */

// ---------------------------------------------------------------------------
// Threshold constants — tune here; UI can import for "at risk" copy.
// ---------------------------------------------------------------------------

/** Earliest turn a win can register (prevents instant win after setup + one lucky pitch). */
export const MIN_TURNS_BEFORE_WIN = 8

/** Minimum runway — below this counts as "low cash" for streak tracking. */
export const LOW_CASH_THRESHOLD = 500_000 // ₹5L

/** Instant loss — no streak grace once cash hits zero or negative. */
export const BANKRUPTCY_CASH = 0

/** Consecutive turns below LOW_CASH_THRESHOLD → bankruptcy loss. */
export const LOW_CASH_LOSS_STREAK = 2

/** publicTrust at or below this for LOW_TRUST_LOSS_STREAK turns → community backlash loss. */
export const LOW_TRUST_THRESHOLD = 20
export const LOW_TRUST_LOSS_STREAK = 3

/** investorConfidence at or below this for LOW_INVESTOR_LOSS_STREAK turns → funding pulled loss. */
export const LOW_INVESTOR_THRESHOLD = 25
export const LOW_INVESTOR_LOSS_STREAK = 3

/** Win gate — all three must hold simultaneously. */
export const WIN_COMPANY_VALUE = 15_000_000 // ₹1.5Cr (~3× book anchor at start)
export const WIN_INVESTOR_CONFIDENCE = 70
export const WIN_PUBLIC_TRUST = 65

/** Consecutive turns meeting every win gate → victory. */
export const WIN_SUSTAINED_TURNS = 3

/** One turn before a streak loss fires, surface an at-risk warning (not a separate game state). */
export const AT_RISK_CASH_TURNS_BEFORE = LOW_CASH_LOSS_STREAK - 1 // 1 turn warning
export const AT_RISK_TRUST_TURNS_BEFORE = LOW_TRUST_LOSS_STREAK - 1
export const AT_RISK_INVESTOR_TURNS_BEFORE = LOW_INVESTOR_LOSS_STREAK - 1

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GameOutcome = 'playing' | 'won' | 'lost'

export type LossReason =
  | 'bankruptcy'
  | 'cash_runway'
  | 'trust_collapse'
  | 'investor_exit'

export type AtRiskFlag =
  | 'cash_runway'
  | 'public_trust'
  | 'investor_confidence'

/** Streak counters persisted on GameState (winStreakCounter) + loss streaks (Phase 15 wiring). */
export interface WinLossStreaks {
  /** Consecutive turns meeting all win gates — maps to GameState.winStreakCounter. */
  winStreak: number
  /** Consecutive turns with cash below LOW_CASH_THRESHOLD (but still > BANKRUPTCY_CASH). */
  lowCashStreak: number
  /** Consecutive turns with publicTrust at or below LOW_TRUST_THRESHOLD. */
  lowTrustStreak: number
  /** Consecutive turns with investorConfidence at or below LOW_INVESTOR_THRESHOLD. */
  lowInvestorStreak: number
}

export const INITIAL_WIN_LOSS_STREAKS: WinLossStreaks = {
  winStreak: 0,
  lowCashStreak: 0,
  lowTrustStreak: 0,
  lowInvestorStreak: 0,
}

export interface WinLossEvaluation {
  outcome: GameOutcome
  lossReason?: LossReason
  /** Non-fatal warnings for dashboard banner — player still has one+ turns to recover. */
  atRisk: AtRiskFlag[]
  streaks: WinLossStreaks
  /** Human-readable summary for Win/Loss screens and toasts. */
  summary: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function meetsWinGates(stats: PlayerStats): boolean {
  return (
    stats.companyValue >= WIN_COMPANY_VALUE &&
    stats.investorConfidence >= WIN_INVESTOR_CONFIDENCE &&
    stats.publicTrust >= WIN_PUBLIC_TRUST &&
    stats.cash >= LOW_CASH_THRESHOLD
  )
}

function updateWinStreak(
  stats: PlayerStats,
  turn: number,
  prev: number,
): number {
  if (turn < MIN_TURNS_BEFORE_WIN) return 0
  if (!meetsWinGates(stats)) return 0
  return prev + 1
}

function updateLowCashStreak(stats: PlayerStats, prev: number): number {
  if (stats.cash <= BANKRUPTCY_CASH) return prev
  if (stats.cash < LOW_CASH_THRESHOLD) return prev + 1
  return 0
}

function updateLowTrustStreak(stats: PlayerStats, prev: number): number {
  if (stats.publicTrust <= LOW_TRUST_THRESHOLD) return prev + 1
  return 0
}

function updateLowInvestorStreak(stats: PlayerStats, prev: number): number {
  if (stats.investorConfidence <= LOW_INVESTOR_THRESHOLD) return prev + 1
  return 0
}

function collectAtRiskFlags(streaks: WinLossStreaks): AtRiskFlag[] {
  const flags: AtRiskFlag[] = []

  if (
    streaks.lowCashStreak >= AT_RISK_CASH_TURNS_BEFORE &&
    streaks.lowCashStreak < LOW_CASH_LOSS_STREAK
  ) {
    flags.push('cash_runway')
  }
  if (
    streaks.lowTrustStreak >= AT_RISK_TRUST_TURNS_BEFORE &&
    streaks.lowTrustStreak < LOW_TRUST_LOSS_STREAK
  ) {
    flags.push('public_trust')
  }
  if (
    streaks.lowInvestorStreak >= AT_RISK_INVESTOR_TURNS_BEFORE &&
    streaks.lowInvestorStreak < LOW_INVESTOR_LOSS_STREAK
  ) {
    flags.push('investor_confidence')
  }

  return flags
}

function resolveLoss(
  stats: PlayerStats,
  streaks: WinLossStreaks,
): { outcome: 'lost'; lossReason: LossReason; summary: string } | null {
  if (stats.cash <= BANKRUPTCY_CASH) {
    return {
      outcome: 'lost',
      lossReason: 'bankruptcy',
      summary: 'Cash hit zero — the startup could not make payroll.',
    }
  }

  if (streaks.lowCashStreak >= LOW_CASH_LOSS_STREAK) {
    return {
      outcome: 'lost',
      lossReason: 'cash_runway',
      summary: `Runway stayed below ₹5L for ${LOW_CASH_LOSS_STREAK} consecutive turns.`,
    }
  }

  if (streaks.lowTrustStreak >= LOW_TRUST_LOSS_STREAK) {
    return {
      outcome: 'lost',
      lossReason: 'trust_collapse',
      summary: `Public trust fell to ${LOW_TRUST_THRESHOLD} or below for ${LOW_TRUST_LOSS_STREAK} turns — the city turned away.`,
    }
  }

  if (streaks.lowInvestorStreak >= LOW_INVESTOR_LOSS_STREAK) {
    return {
      outcome: 'lost',
      lossReason: 'investor_exit',
      summary: `Investor confidence stayed at ${LOW_INVESTOR_THRESHOLD} or below for ${LOW_INVESTOR_LOSS_STREAK} turns — funding was pulled.`,
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Main entry — call once per turn after stats are final for that turn.
// ---------------------------------------------------------------------------

/**
 * Evaluate win/loss after a turn completes.
 *
 * **When to call:** at the end of `advanceTurn`, after action/event stat deltas
 * are merged — not on a separate timer. One check per turn keeps streak math
 * aligned with player actions.
 *
 * **Order:** update streaks → check hard loss → check sustained win → surface at-risk.
 */
export function evaluateWinLoss(
  stats: PlayerStats,
  turn: number,
  previousStreaks: WinLossStreaks = INITIAL_WIN_LOSS_STREAKS,
): WinLossEvaluation {
  const streaks: WinLossStreaks = {
    winStreak: updateWinStreak(stats, turn, previousStreaks.winStreak),
    lowCashStreak: updateLowCashStreak(stats, previousStreaks.lowCashStreak),
    lowTrustStreak: updateLowTrustStreak(stats, previousStreaks.lowTrustStreak),
    lowInvestorStreak: updateLowInvestorStreak(
      stats,
      previousStreaks.lowInvestorStreak,
    ),
  }

  const loss = resolveLoss(stats, streaks)
  if (loss) {
    return {
      outcome: loss.outcome,
      lossReason: loss.lossReason,
      atRisk: [],
      streaks,
      summary: loss.summary,
    }
  }

  if (
    turn >= MIN_TURNS_BEFORE_WIN &&
    streaks.winStreak >= WIN_SUSTAINED_TURNS
  ) {
    return {
      outcome: 'won',
      atRisk: [],
      streaks,
      summary: `Company value, investor confidence, and public trust held above win targets for ${WIN_SUSTAINED_TURNS} consecutive turns.`,
    }
  }

  const atRisk = collectAtRiskFlags(streaks)

  return {
    outcome: 'playing',
    atRisk,
    streaks,
    summary:
      atRisk.length > 0
        ? 'One or more metrics are at risk — recover before streak limits trigger a loss.'
        : 'Run continues.',
  }
}

/** Short UI copy for at-risk banners on the dashboard. */
export function atRiskMessage(flag: AtRiskFlag): string {
  switch (flag) {
    case 'cash_runway':
      return `Cash has been below ₹5L — one more turn without recovery ends the run.`
    case 'public_trust':
      return `Public trust is critically low — one more turn at this level and the community abandons you.`
    case 'investor_confidence':
      return `Investors are pulling back — one more turn at this confidence level and funding dries up.`
  }
}
