import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BlueprintEditorCard } from '@/components/blueprint/BlueprintEditorCard'
import { BlueprintHeader } from '@/components/blueprint/BlueprintHeader'
import { BlueprintOverviewPanel } from '@/components/blueprint/BlueprintOverviewPanel'
import { BlueprintSectionTabs } from '@/components/blueprint/BlueprintSectionTabs'
import {
  BLUEPRINT_SECTIONS,
  blueprintDraftStorageKey,
  computeStartupScores,
  createEmptyDraft,
  draftToQuizDraft,
  expandChipToIdea,
  findProblemCategory,
  generateMoreChips,
  getDefaultChips,
  isBlueprintComplete,
  isSectionComplete,
  loadBlueprintDraft,
  saveBlueprintDraft,
  type BlueprintDraft,
  type BlueprintSectionId,
} from '@/lib/blueprintUi'
import { buildSolutionPayload } from '@/lib/solutionQuiz'
import { useGameStore } from '@/store/gameStore'

const QUIZ_BG = '/assets/quiz_bg.png'

export default function SolutionQuiz() {
  const navigate = useNavigate()
  const city = useGameStore((state) => state.city)
  const problem = useGameStore((state) => state.problem)
  const stats = useGameStore((state) => state.stats)
  const turn = useGameStore((state) => state.turn)
  const setSolutionAnswers = useGameStore((state) => state.setSolutionAnswers)

  const [activeSectionId, setActiveSectionId] =
    useState<BlueprintSectionId>('approach')
  const [draft, setDraft] = useState<BlueprintDraft>(createEmptyDraft)
  const [visibleChips, setVisibleChips] = useState<
    Record<BlueprintSectionId, string[]>
  >({
    approach: [],
    customer: [],
    revenue: [],
    pricing: [],
    edge: [],
  })
  const [draftSaved, setDraftSaved] = useState(false)

  const category = useMemo(() => {
    if (!city || !problem) return undefined
    return findProblemCategory(city, problem)
  }, [city, problem])

  useEffect(() => {
    if (!problem || !city) {
      navigate('/city-map', { replace: true })
    }
  }, [problem, city, navigate])

  useEffect(() => {
    if (!problem || !category) return

    const saved = loadBlueprintDraft(problem.id)
    if (saved) {
      setDraft(saved)
    }

    setVisibleChips((current) => {
      const next = { ...current }
      for (const section of BLUEPRINT_SECTIONS) {
        if (next[section.id].length === 0) {
          next[section.id] = getDefaultChips(section.id, category.name)
        }
      }
      return next
    })
  }, [problem?.id, category?.name])

  const completedSections = useMemo(() => {
    const set = new Set<BlueprintSectionId>()
    for (const section of BLUEPRINT_SECTIONS) {
      if (isSectionComplete(draft[section.id])) {
        set.add(section.id)
      }
    }
    return set
  }, [draft])

  const scores = useMemo(() => computeStartupScores(draft), [draft])
  const activeSection =
    BLUEPRINT_SECTIONS.find((section) => section.id === activeSectionId) ??
    BLUEPRINT_SECTIONS[0]
  const activeIndex = BLUEPRINT_SECTIONS.findIndex(
    (section) => section.id === activeSectionId,
  )

  if (!city || !problem) {
    return null
  }

  const updateDraft = (sectionId: BlueprintSectionId, value: string) => {
    setDraft((current) => ({ ...current, [sectionId]: value }))
    setDraftSaved(false)
  }

  const handleChipClick = (chip: string) => {
    const expanded = expandChipToIdea({
      chip,
      sectionId: activeSectionId,
      problem,
      city,
      category,
    })
    updateDraft(activeSectionId, expanded)
  }

  const handleGenerateMore = () => {
    const current = visibleChips[activeSectionId] ?? []
    const extra = generateMoreChips(activeSectionId, current)
    setVisibleChips((state) => ({
      ...state,
      [activeSectionId]: [...current, ...extra],
    }))
  }

  const handleSaveDraft = () => {
    saveBlueprintDraft(problem.id, draft)
    setDraftSaved(true)
    window.setTimeout(() => setDraftSaved(false), 2000)
  }

  const handlePrevious = () => {
    if (activeIndex === 0) {
      navigate('/city-map')
      return
    }
    setActiveSectionId(BLUEPRINT_SECTIONS[activeIndex - 1].id)
  }

  const handleContinue = () => {
    if (!isSectionComplete(draft[activeSectionId])) return

    if (activeIndex < BLUEPRINT_SECTIONS.length - 1) {
      setActiveSectionId(BLUEPRINT_SECTIONS[activeIndex + 1].id)
      return
    }

    if (!isBlueprintComplete(draft)) return

    const quizDraft = draftToQuizDraft(draft)
    const { summary, answers } = buildSolutionPayload(
      problem.questions,
      quizDraft,
    )
    setSolutionAnswers(answers, summary)
    saveBlueprintDraft(problem.id, draft)
    localStorage.removeItem(blueprintDraftStorageKey(problem.id))
    navigate('/company-setup', { state: { openLaunchProduct: true } })
  }

  const canContinue = isSectionComplete(draft[activeSectionId])
  const isLastSection = activeIndex === BLUEPRINT_SECTIONS.length - 1

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-[#070b14] text-white">
      <img
        src={QUIZ_BG}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[#070b14]/55"
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 mx-auto flex h-full w-full max-w-[1300px] flex-col px-3 py-3 sm:px-5 sm:py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <BlueprintHeader city={city} cash={stats.cash} turn={turn || 1} />

        <BlueprintSectionTabs
          sections={BLUEPRINT_SECTIONS}
          activeId={activeSectionId}
          completed={completedSections}
          onSelect={setActiveSectionId}
        />

        <div className="mt-3 flex min-h-0 flex-1 gap-3 lg:gap-4">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <AnimatePresence mode="wait">
              <BlueprintEditorCard
                key={activeSection.id}
                section={activeSection}
                category={category}
                problem={problem}
                value={draft[activeSectionId]}
                chips={visibleChips[activeSectionId] ?? []}
                onChange={(value) => updateDraft(activeSectionId, value)}
                onChipClick={handleChipClick}
                onGenerateMore={handleGenerateMore}
              />
            </AnimatePresence>
          </div>

          <BlueprintOverviewPanel
            category={category}
            problem={problem}
            scores={scores}
          />
        </div>

        <motion.footer
          className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-md sm:px-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            type="button"
            onClick={handlePrevious}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10 sm:text-sm"
          >
            Previous
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10 sm:text-sm"
            >
              {draftSaved ? 'Draft Saved ✓' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="rounded-xl bg-linear-to-r from-primary to-amber-500 px-6 py-2 text-xs font-bold text-white shadow-[0_8px_24px_rgba(217,119,6,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-45 sm:px-8 sm:text-sm"
            >
              {isLastSection
                ? 'Continue to Company Setup'
                : `Continue to ${BLUEPRINT_SECTIONS[activeIndex + 1]?.label}`}
            </button>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  )
}
