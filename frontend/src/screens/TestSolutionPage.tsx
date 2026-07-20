import { ArrowLeft, FlaskConical, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TestSolutionErrorPanel,
  TestSolutionLoadingPanel,
  TestSolutionResultsPanel,
} from '@/components/test/TestSolutionResultsPanel'
import {
  BLUEPRINT_MIN_LENGTH,
  BLUEPRINT_SECTIONS,
  createEmptyDraft,
  type BlueprintDraft,
  type BlueprintSectionId,
} from '@/lib/blueprintUi'
import { selectRelevantNpcsForCategory } from '@/lib/launchProductClient'
import type { LaunchProductResponse } from '@/lib/launchProductClient'
import {
  createSandboxProblem,
  fetchTestSolutionValidation,
  type CustomProblemDraft,
} from '@/lib/testSolutionClient'
import { useGameStore } from '@/store/gameStore'

const QUIZ_BG = '/assets/quiz_bg.png'

type ViewState = 'form' | 'loading' | 'success' | 'error'

function isFieldComplete(value: string): boolean {
  return value.trim().length >= BLUEPRINT_MIN_LENGTH
}

export default function TestSolutionPage() {
  const navigate = useNavigate()
  const city = useGameStore((state) => state.city)
  const npcs = useGameStore((state) => state.npcs)
  const stats = useGameStore((state) => state.stats)

  const [problemName, setProblemName] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [solution, setSolution] = useState<BlueprintDraft>(createEmptyDraft)
  const [view, setView] = useState<ViewState>('form')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState<LaunchProductResponse | null>(null)

  useEffect(() => {
    if (!city) {
      navigate('/city', { replace: true })
    }
  }, [city, navigate])

  useEffect(() => {
    if (city && !categoryName && city.categories[0]) {
      setCategoryName(city.categories[0].name)
    }
  }, [city, categoryName])

  const customProblem = useMemo<CustomProblemDraft | null>(() => {
    if (!problemName.trim() || !problemDescription.trim() || !categoryName) {
      return null
    }
    return {
      name: problemName.trim(),
      description: problemDescription.trim(),
      categoryName,
    }
  }, [problemName, problemDescription, categoryName])

  const solutionSummary = useMemo(
    () => ({
      approach: solution.approach.trim(),
      customer: solution.customer.trim(),
      revenue: solution.revenue.trim(),
      pricing: solution.pricing.trim(),
      edge: solution.edge.trim(),
    }),
    [solution],
  )

  const sandboxProblem = useMemo(
    () => (customProblem ? createSandboxProblem(customProblem) : null),
    [customProblem],
  )

  const relevantNpcs = useMemo(() => {
    if (!categoryName) return []
    return selectRelevantNpcsForCategory(npcs, categoryName)
  }, [npcs, categoryName])

  const canValidate =
    customProblem !== null &&
    BLUEPRINT_SECTIONS.every((section) => isFieldComplete(solution[section.id]))

  const updateSolution = (field: BlueprintSectionId, value: string) => {
    setSolution((current) => ({ ...current, [field]: value }))
  }

  const runValidation = async () => {
    if (!city || !customProblem || !canValidate) return

    setView('loading')
    setErrorMessage('')
    setResult(null)

    try {
      const response = await fetchTestSolutionValidation(
        city,
        customProblem,
        solutionSummary,
        npcs,
      )
      setResult(response)
      setView('success')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Couldn't reach the network right now — try again in a moment",
      )
      setView('error')
    }
  }

  const resetToForm = () => {
    setView('form')
    setResult(null)
    setErrorMessage('')
  }

  if (!city) {
    return null
  }

  return (
    <div className="relative min-h-svh overflow-y-auto bg-[#070b14] text-white">
      <img
        src={QUIZ_BG}
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none fixed inset-0 bg-[#070b14]/60" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        <header className="shrink-0">
          <button
            type="button"
            onClick={() => navigate('/city-map')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md hover:bg-black/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to map
          </button>

          <div className="mt-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Sandbox · {city.name}
              </p>
              <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
                Test Your Problem &amp; Solution
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Describe any civic problem and your startup idea. Our AI will
                check it with relevant citizens and a market read for this city.
              </p>
            </div>
          </div>
        </header>

        {view === 'form' && (
          <div className="mt-6 space-y-5 pb-8">
            <section className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Your problem
              </h2>

              <label className="mt-3 block">
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  Problem name
                </span>
                <input
                  type="text"
                  value={problemName}
                  onChange={(event) => setProblemName(event.target.value)}
                  placeholder="e.g. Last-mile delivery gaps in industrial zones"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </label>

              <label className="mt-3 block">
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  What is the problem?
                </span>
                <textarea
                  value={problemDescription}
                  onChange={(event) => setProblemDescription(event.target.value)}
                  rows={4}
                  placeholder="Describe who is affected, why it matters in this city, and the scale of the issue…"
                  className="w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </label>

              <label className="mt-3 block">
                <span className="mb-1.5 block text-xs font-semibold text-white/70">
                  Category (who we ask)
                </span>
                <select
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0c1220] px-3 py-2.5 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                >
                  {city.categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-white/45">
                  {relevantNpcs.length} citizens &amp; leaders will react, including
                  mayor, investors, and category experts.
                </p>
              </label>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Your solution
              </h2>
              <p className="mt-1 text-xs text-white/45">
                At least {BLUEPRINT_MIN_LENGTH} characters per field.
              </p>

              <div className="mt-4 space-y-4">
                {BLUEPRINT_SECTIONS.map((section) => (
                  <label key={section.id} className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-white/70">
                      <span aria-hidden="true">{section.emoji}</span>
                      {section.label}
                    </span>
                    <textarea
                      value={solution[section.id]}
                      onChange={(event) =>
                        updateSolution(section.id, event.target.value)
                      }
                      rows={3}
                      placeholder={section.description}
                      className="w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </label>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={() => void runValidation()}
              disabled={!canValidate}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(217,119,6,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Validate with city &amp; people
            </button>
          </div>
        )}

        {(view === 'loading' || view === 'success' || view === 'error') && (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
            {view === 'loading' && <TestSolutionLoadingPanel />}

            {view === 'error' && (
              <TestSolutionErrorPanel
                message={errorMessage}
                onRetry={() => void runValidation()}
              />
            )}

            {view === 'success' && result && sandboxProblem && (
              <>
                <TestSolutionResultsPanel
                  result={result}
                  problem={sandboxProblem}
                  solution={solutionSummary}
                  npcs={relevantNpcs}
                  cityName={city.name}
                  statsCash={stats.cash}
                />
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetToForm}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-background"
                  >
                    Edit &amp; test again
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/city-map')}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    Back to city map
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
