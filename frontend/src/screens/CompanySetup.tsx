import { ArrowLeft, Building2, Rocket, Sparkles, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LaunchProductModal } from '@/components/launch/LaunchProductModal'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { avatars } from '@/data/avatars'
import { BLUEPRINT_SECTIONS, formatFunds } from '@/lib/blueprintUi'
import { formatRupeeShort } from '@/lib/formatRupee'
import { STARTING_CASH, useGameStore } from '@/store/gameStore'
import type { SolutionSummary } from '@/types'

const QUIZ_BG = '/assets/quiz_bg.png'

const SUMMARY_LABELS: Record<keyof SolutionSummary, string> = {
  approach: 'Solution',
  customer: 'Target Users',
  revenue: 'Revenue Model',
  pricing: 'Pricing',
  edge: 'Competitive Advantage',
}

type CompanySetupLocationState = {
  openLaunchProduct?: boolean
}

export default function CompanySetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const founder = useGameStore((state) => state.founder)
  const city = useGameStore((state) => state.city)
  const problem = useGameStore((state) => state.problem)
  const solutionSummary = useGameStore((state) => state.solutionSummary)
  const launchStartup = useGameStore((state) => state.launchStartup)
  const hasLaunchedThisSolution = useGameStore(
    (state) => state.hasLaunchedThisSolution,
  )
  const stats = useGameStore((state) => state.stats)
  const lastLaunchEconomics = useGameStore((state) => state.lastLaunchEconomics)
  const gameOutcome = useGameStore((state) => state.gameOutcome)

  const [founderName, setFounderName] = useState(founder?.name ?? '')
  const [startupName, setStartupName] = useState(founder?.startupName ?? '')
  const [showLaunchModal, setShowLaunchModal] = useState(false)

  useEffect(() => {
    if (!founder?.avatarId || !city || !problem || !solutionSummary) {
      navigate('/city-map', { replace: true })
    }
  }, [founder, city, problem, solutionSummary, navigate])

  useEffect(() => {
    if (gameOutcome === 'lost') {
      navigate('/game-over', { replace: true })
    }
  }, [gameOutcome, navigate])

  useEffect(() => {
    const state = location.state as CompanySetupLocationState | null
    if (state?.openLaunchProduct && !hasLaunchedThisSolution) {
      setShowLaunchModal(true)
      navigate('.', { replace: true, state: {} })
    }
  }, [location.state, hasLaunchedThisSolution, navigate])

  const avatar = useMemo(
    () => avatars.find((item) => item.id === founder?.avatarId),
    [founder?.avatarId],
  )

  if (!founder?.avatarId || !city || !problem || !solutionSummary || !avatar) {
    return null
  }

  const canLaunch =
    founderName.trim().length > 0 &&
    startupName.trim().length > 0 &&
    stats.cash > 0

  const handleLaunch = () => {
    if (!founderName.trim() || !startupName.trim()) return

    launchStartup({
      name: founderName.trim(),
      startupName: startupName.trim(),
      avatarId: founder.avatarId,
    })

    if (useGameStore.getState().gameOutcome === 'lost') {
      navigate('/game-over', { replace: true })
      return
    }

    navigate('/dashboard')
  }

  const handleCloseLaunchModal = () => {
    setShowLaunchModal(false)
  }

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-[#070b14] text-white">
      <img
        src={QUIZ_BG}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#070b14]/60" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-5">
        <header className="shrink-0">
          <button
            type="button"
            onClick={() => navigate('/quiz')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md hover:bg-black/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Blueprint
          </button>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Step 4 of 4
              </p>
              <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Launch Your Startup
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Confirm your details and enter the city simulation.
              </p>
            </div>
            <StepIndicator steps={4} currentStep={4} />
          </div>
        </header>

        <motion.div
          className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_1.1fr]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <section className="flex min-h-0 flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
              Company Details
            </h2>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-white/70">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                Founder Name
              </span>
              <input
                type="text"
                value={founderName}
                onChange={(event) => setFounderName(event.target.value)}
                placeholder="Enter founder name"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-white/70">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Startup Name
              </span>
              <input
                type="text"
                value={startupName}
                onChange={(event) => setStartupName(event.target.value)}
                placeholder="Enter startup name"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </label>

            <div className="mt-auto rounded-xl border border-primary/25 bg-primary/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {hasLaunchedThisSolution ? 'Cash After Product Launch' : 'Starting Capital'}
              </p>
              <p className="mt-1 text-lg font-extrabold text-white">
                {formatFunds(hasLaunchedThisSolution ? stats.cash : STARTING_CASH)}
              </p>
              {hasLaunchedThisSolution && lastLaunchEconomics && (
                <p className="mt-2 text-xs text-white/70">
                  Build cost {formatRupeeShort(lastLaunchEconomics.investment)} ·
                  early revenue {formatRupeeShort(lastLaunchEconomics.revenue)} ·{' '}
                  {lastLaunchEconomics.adoptionPercentage}% adoption
                </p>
              )}
              {hasLaunchedThisSolution && stats.cash <= 0 && (
                <p className="mt-2 text-xs font-semibold text-rose-300">
                  No runway left — you cannot enter the dashboard. Start a new run
                  or go back and revise your blueprint.
                </p>
              )}
              {!hasLaunchedThisSolution && (
                <p className="mt-1 text-xs text-white/55">
                  Use Launch Product to stress-test costs before Day 1.
                </p>
              )}
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]/88 backdrop-blur-md">
            <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Startup Summary
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={avatar.imagePath}
                  alt={avatar.name}
                  className="h-12 w-12 rounded-full border border-white/15 object-contain bg-[#151d2e]"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {avatar.name}
                  </p>
                  <p className="truncate text-xs text-white/55">{city.name}</p>
                  <p className="truncate text-xs text-primary">{problem.name}</p>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 sm:px-5">
              {BLUEPRINT_SECTIONS.map((section) => {
                const key = section.id as keyof SolutionSummary
                const text = solutionSummary[key]

                return (
                  <div
                    key={section.id}
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {section.emoji} {SUMMARY_LABELS[key]}
                    </p>
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/75">
                      {text}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        </motion.div>

        <footer className="mt-4 flex shrink-0 flex-wrap items-center justify-end gap-2">
          <span
            title={
              hasLaunchedThisSolution
                ? 'Already verified for this solution'
                : undefined
            }
          >
            <SecondaryButton
              onClick={() => setShowLaunchModal(true)}
              disabled={hasLaunchedThisSolution}
            >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Launch Product
            </span>
            </SecondaryButton>
          </span>
          <span
            title={
              stats.cash <= 0 && hasLaunchedThisSolution
                ? 'Bankrupt — no cash left after product launch'
                : undefined
            }
          >
            <PrimaryButton onClick={handleLaunch} disabled={!canLaunch}>
              <span className="inline-flex items-center gap-2">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                Launch Startup
              </span>
            </PrimaryButton>
          </span>
        </footer>
      </div>

      <LaunchProductModal
        open={showLaunchModal}
        onClose={handleCloseLaunchModal}
      />
    </div>
  )
}
