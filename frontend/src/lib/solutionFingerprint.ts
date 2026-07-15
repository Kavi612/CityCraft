import type { SolutionSummary } from '@/types'

/** Stable hash for the current quiz submission — used by launch guardrails. */
export function solutionFingerprint(summary: SolutionSummary): string {
  const raw = [
    summary.approach,
    summary.customer,
    summary.revenue,
    summary.pricing,
    summary.edge,
  ].join('|')

  let hash = 0
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}
