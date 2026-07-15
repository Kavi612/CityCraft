import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { formatFunds } from '@/lib/blueprintUi'
import { formatRupeeShort } from '@/lib/formatRupee'
import { useGameStore } from '@/store/gameStore'

export default function GameOverPage() {
  const navigate = useNavigate()
  const stats = useGameStore((state) => state.stats)
  const lossSummary = useGameStore((state) => state.lossSummary)
  const lossReason = useGameStore((state) => state.lossReason)
  const lastLaunchEconomics = useGameStore((state) => state.lastLaunchEconomics)
  const founder = useGameStore((state) => state.founder)
  const resetGame = useGameStore((state) => state.resetGame)

  const handleRestart = () => {
    resetGame()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertTriangle className="h-8 w-8 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Game Over
            </p>
            <h1 className="text-xl font-extrabold text-stone-800 sm:text-2xl">
              {founder?.startupName ?? 'Your startup'} ran out of runway
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          {lossSummary ??
            'Cash hit zero — the startup could not continue in a playable state.'}
        </p>

        {lossReason && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            Reason: {lossReason.replace('_', ' ')}
          </p>
        )}

        {lastLaunchEconomics && (
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Build cost
              </p>
              <p className="mt-1 font-semibold text-stone-800">
                {formatRupeeShort(lastLaunchEconomics.investment)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Early revenue
              </p>
              <p className="mt-1 font-semibold text-stone-800">
                {formatRupeeShort(lastLaunchEconomics.revenue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Net launch result
              </p>
              <p
                className={`mt-1 font-semibold ${
                  lastLaunchEconomics.netCash >= 0
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {lastLaunchEconomics.netCash >= 0 ? '+' : '−'}
                {formatRupeeShort(Math.abs(lastLaunchEconomics.netCash))}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Adoption
              </p>
              <p className="mt-1 font-semibold text-stone-800">
                {lastLaunchEconomics.adoptionPercentage}% ·{' '}
                {lastLaunchEconomics.customers} customers
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-border bg-background/80 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Final Cash
          </p>
          <p className="mt-1 text-2xl font-extrabold text-stone-800">
            {formatFunds(Math.max(0, stats.cash))}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton onClick={handleRestart}>
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Start New Run
            </span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
