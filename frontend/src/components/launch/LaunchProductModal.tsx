import { Loader2, Rocket, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { formatRupeeShort } from '@/lib/formatRupee'
import {
  buildLaunchProductRequest,
  fetchLaunchProductVerification,
  type LaunchProductResponse,
} from '@/lib/launchProductClient'
import { computeLaunchProductEconomics } from '@/lib/launchProductOutcomes'
import { useGameStore } from '@/store/gameStore'
import type { NPC } from '@/types'

type LaunchProductModalProps = {
  open: boolean
  onClose: () => void
}

type ViewState = 'loading' | 'success' | 'error'

function npcById(npcs: NPC[], id: string): NPC | undefined {
  return npcs.find((npc) => npc.id === id)
}

export function LaunchProductModal({ open, onClose }: LaunchProductModalProps) {
  const city = useGameStore((state) => state.city)
  const problem = useGameStore((state) => state.problem)
  const solutionSummary = useGameStore((state) => state.solutionSummary)
  const solutionAnswers = useGameStore((state) => state.solutionAnswers)
  const stats = useGameStore((state) => state.stats)
  const npcs = useGameStore((state) => state.npcs)
  const hasLaunchedThisSolution = useGameStore(
    (state) => state.hasLaunchedThisSolution,
  )
  const applyLaunchProductResult = useGameStore(
    (state) => state.applyLaunchProductResult,
  )

  const [view, setView] = useState<ViewState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState<LaunchProductResponse | null>(null)

  const requestBody = useMemo(() => {
    if (!city || !problem || !solutionSummary) return null
    return buildLaunchProductRequest(
      city,
      problem,
      solutionSummary,
      npcs,
      solutionAnswers,
    )
  }, [city, problem, solutionSummary, npcs, solutionAnswers])

  const economicsPreview = useMemo(() => {
    if (!result || !problem || !solutionSummary) return null
    return computeLaunchProductEconomics(
      result,
      npcs,
      problem,
      solutionSummary,
      stats,
    )
  }, [result, npcs, problem, solutionSummary, stats])

  const runVerification = useCallback(async () => {
    if (!requestBody || !problem || !solutionSummary) return

    setView('loading')
    setErrorMessage('')
    setResult(null)

    try {
      const response = await fetchLaunchProductVerification(requestBody)
      setResult(response)
      setView('success')
    } catch (error) {
      setView('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Couldn't reach the network right now — try again in a moment",
      )
    }
  }, [requestBody, problem, solutionSummary])

  useEffect(() => {
    if (!open) return
    void runVerification()
  }, [open, runVerification])

  useEffect(() => {
    if (!open) {
      setView('loading')
      setErrorMessage('')
      setResult(null)
    }
  }, [open])

  if (!open || !city || !problem || !solutionSummary) {
    return null
  }

  const handleConfirm = () => {
    if (!result || hasLaunchedThisSolution) {
      onClose()
      return
    }

    applyLaunchProductResult(result)
    onClose()
  }

  const sortedReactions = result
    ? [...result.npcReactions].sort(
        (a, b) => Number(b.willAdopt) - Number(a.willAdopt),
      )
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 p-4 backdrop-blur-sm">
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-product-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Grok Verification
            </p>
            <h2
              id="launch-product-title"
              className="text-base font-bold text-stone-800 sm:text-lg"
            >
              Launch Product
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:bg-background hover:text-stone-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {view === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Loader2
                className="h-9 w-9 animate-spin text-primary"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-stone-700">
                Analyzing your solution...
              </p>
              <p className="max-w-sm text-xs text-stone-500">
                Grok is estimating build cost and gathering NPC reactions for{' '}
                {problem.name} in {city.name}.
              </p>
            </div>
          )}

          {view === 'error' && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
              <p className="text-sm font-semibold text-rose-800">
                Couldn&apos;t reach the network right now — try again in a moment
              </p>
              {errorMessage && (
                <p className="mt-2 text-xs text-rose-700/80">{errorMessage}</p>
              )}
              <button
                type="button"
                onClick={() => void runVerification()}
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Retry
              </button>
            </div>
          )}

          {view === 'success' && result && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/8 px-4 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Estimated Investment
                </p>
                <p className="mt-1 text-3xl font-extrabold text-stone-800">
                  {formatRupeeShort(result.estimatedInvestment)}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  To build and launch this specific solution in {city.name}
                </p>
              </div>

              {economicsPreview && (
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    economicsPreview.netCash >= 0
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-rose-200 bg-rose-50'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Projected launch P&amp;L
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-stone-500">Early revenue</p>
                      <p className="font-semibold text-stone-800">
                        {formatRupeeShort(economicsPreview.revenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500">Net result</p>
                      <p
                        className={`font-semibold ${
                          economicsPreview.netCash >= 0
                            ? 'text-emerald-800'
                            : 'text-rose-800'
                        }`}
                      >
                        {economicsPreview.netCash >= 0 ? '+' : '−'}
                        {formatRupeeShort(Math.abs(economicsPreview.netCash))}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500">Cash after launch</p>
                      <p className="font-semibold text-stone-800">
                        {formatRupeeShort(
                          Math.max(0, stats.cash + economicsPreview.netCash),
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500">Adoption</p>
                      <p className="font-semibold text-stone-800">
                        {economicsPreview.adoptionPercentage}% ·{' '}
                        {economicsPreview.customers} customers
                      </p>
                    </div>
                  </div>
                  {stats.cash + economicsPreview.netCash <= 0 && (
                    <p className="mt-3 text-xs font-semibold text-rose-800">
                      This launch would wipe your cash. You can still confirm to
                      record the outcome, but you won&apos;t be able to enter the
                      dashboard until you start a new run.
                    </p>
                  )}
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  NPC Reactions ({result.npcReactions.length})
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
                                {reaction.willAdopt
                                  ? 'Adopting'
                                  : 'Not Adopting'}
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
                  Market Note
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-900">
                  {result.marketNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {view === 'success' && (
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-border px-4 py-3 sm:px-5">
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleConfirm}>
              <span className="inline-flex items-center gap-2">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                Confirm Launch
              </span>
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  )
}
