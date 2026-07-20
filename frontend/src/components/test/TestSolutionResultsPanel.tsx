import { Loader2, Rocket } from 'lucide-react'
import { useMemo } from 'react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { formatRupeeShort } from '@/lib/formatRupee'
import type { LaunchProductResponse } from '@/lib/launchProductClient'
import {
  computeLaunchProductEconomics,
  computeWeightedAdoptionPercentage,
} from '@/lib/launchProductOutcomes'
import type { NPC, Problem, SolutionSummary } from '@/types'

type TestSolutionResultsPanelProps = {
  result: LaunchProductResponse
  problem: Problem
  solution: SolutionSummary
  npcs: NPC[]
  cityName: string
  statsCash: number
}

function npcById(npcs: NPC[], id: string): NPC | undefined {
  return npcs.find((npc) => npc.id === id)
}

export function TestSolutionResultsPanel({
  result,
  problem,
  solution,
  npcs,
  cityName,
  statsCash,
}: TestSolutionResultsPanelProps) {
  const economics = useMemo(
    () =>
      computeLaunchProductEconomics(result, npcs, problem, solution, {
        cash: statsCash,
        revenue: 0,
        expenses: 0,
        customers: 0,
        reputation: 50,
        publicTrust: 50,
        investorConfidence: 50,
        governmentSupport: 50,
        companyValue: 0,
        investedCapital: 0,
      }),
    [result, npcs, problem, solution, statsCash],
  )

  const adoption = computeWeightedAdoptionPercentage(result.npcReactions, npcs)
  const sortedReactions = [...result.npcReactions].sort(
    (a, b) => Number(b.willAdopt) - Number(a.willAdopt),
  )

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          City &amp; NPC validation
        </p>
        <p className="mt-1 text-sm text-stone-600">
          Feedback for{' '}
          <span className="font-semibold text-stone-800">{cityName}</span> — sandbox
          only; your game stats are unchanged.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/8 px-4 py-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Estimated build cost
        </p>
        <p className="mt-1 text-2xl font-extrabold text-stone-800 sm:text-3xl">
          {formatRupeeShort(result.estimatedInvestment)}
        </p>
      </div>

      <div
        className={`rounded-2xl border px-4 py-3 ${
          economics.netCash >= 0
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-rose-200 bg-rose-50'
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Projected early outcome
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          <div>
            <p className="text-stone-500">Weighted adoption</p>
            <p className="font-semibold text-stone-800">{adoption}%</p>
          </div>
          <div>
            <p className="text-stone-500">Early revenue</p>
            <p className="font-semibold text-stone-800">
              {formatRupeeShort(economics.revenue)}
            </p>
          </div>
          <div>
            <p className="text-stone-500">Net vs ₹50L starting cash</p>
            <p
              className={`font-semibold ${
                economics.netCash >= 0 ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              {economics.netCash >= 0 ? '+' : '−'}
              {formatRupeeShort(Math.abs(economics.netCash))}
            </p>
          </div>
          <div>
            <p className="text-stone-500">Potential customers</p>
            <p className="font-semibold text-stone-800">{economics.customers}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
          What our people think ({result.npcReactions.length})
        </p>
        <div className="space-y-3">
          {sortedReactions.map((reaction) => {
            const npc = npcById(npcs, reaction.npcId)
            if (!npc) return null

            return (
              <article
                key={reaction.npcId}
                className="rounded-2xl border border-border bg-background/80 px-3 py-3"
              >
                <div className="flex items-start gap-3">
                  <NPCAvatarPlaceholder
                    id={npc.id}
                    name={npc.name}
                    imagePath={npc.imagePath}
                    size="md"
                    className="border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-stone-800">
                        {npc.name}
                      </p>
                      <span className="text-xs text-stone-400">
                        {npc.profession}
                      </span>
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          reaction.willAdopt
                            ? 'bg-primary/12 text-primary'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {reaction.willAdopt ? 'Would adopt' : 'Skeptical'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                      {reaction.reactionText}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
          Market note · {cityName}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-amber-900">
          {result.marketNote}
        </p>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-stone-400">
        <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
        Ready to commit? Pick an official city problem on the map.
      </p>
    </div>
  )
}

export function TestSolutionLoadingPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Loader2 className="h-9 w-9 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-semibold text-stone-700">
        Checking with the city and its people…
      </p>
      <p className="max-w-sm text-xs text-stone-500">
        AI is estimating cost, adoption, and gathering NPC reactions.
      </p>
    </div>
  )
}

export function TestSolutionErrorPanel({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
      <p className="text-sm font-semibold text-rose-800">
        Couldn&apos;t validate right now
      </p>
      {message && <p className="mt-2 text-xs text-rose-700/80">{message}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Retry
      </button>
    </div>
  )
}
