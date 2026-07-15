import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { npcs as defaultNpcs } from '@/data/npcs'
import { generateLaunchNpcReactions } from '@/lib/npcReactionGenerator'
import { computeLaunchOutcomes } from '@/lib/launchOutcomes'
import type { LaunchProductResponse } from '@/lib/launchProductClient'
import {
  buildGrokLaunchActivities,
  computeLaunchProductEconomics,
  launchProductEventId,
} from '@/lib/launchProductOutcomes'
import { expenseItemForAction, mergeExpenseBreakdown } from '@/lib/expenseLedger'
import { solutionFingerprint } from '@/lib/solutionFingerprint'
import {
  canAffordAction,
  getActionDelta,
  type ActionId,
} from '@/lib/actionsEngine'
import { formatRupeeShort } from '@/lib/formatRupee'
import type {
  City,
  DashboardActivity,
  ExpenseLineItem,
  Founder,
  GameState,
  NPC,
  NPCReaction,
  PlayerStats,
  Problem,
  SolutionAnswer,
  SolutionSummary,
} from '@/types'

const PERSIST_STORAGE_KEY = 'city-craft-save'

/** ₹50 lakh — typical pre-seed / angel cushion for a Tamil Nadu urban startup. */
export const STARTING_CASH = 5_000_000

/** Book value at incorporation equals initial cash on hand. */
const STARTING_BOOK_VALUE = 5_000_000

const SCORE_FIELDS = [
  'reputation',
  'publicTrust',
  'investorConfidence',
  'governmentSupport',
] as const satisfies ReadonlyArray<keyof PlayerStats>

interface GameStore extends GameState {
  setFounder: (founder: Founder) => void
  setCity: (city: City) => void
  setProblem: (problem: Problem) => void
  setSolutionAnswers: (
    answers: SolutionAnswer[],
    summary: SolutionSummary,
  ) => void
  applyStatDelta: (delta: Partial<PlayerStats>) => void
  advanceTurn: () => void
  logEvent: (eventId: string) => void
  resetGame: () => void
  investCapital: (amount: number) => void
  launchStartup: (founder: Founder) => void
  setNpcReactionHistory: (reactions: NPCReaction[]) => void
  pushDashboardActivity: (activity: DashboardActivity) => void
  upsertNpcReaction: (reaction: NPCReaction) => void
  addExpenseBreakdown: (items: ExpenseLineItem[]) => void
  performGameAction: (actionId: ActionId) => boolean
  updateNPCRelationship: (
    npcId: string,
    delta: { relationship?: number; trust?: number; approval?: number },
  ) => void
  applyLaunchProductResult: (result: LaunchProductResponse) => boolean
}

function cloneNpcs(): NPC[] {
  return defaultNpcs.map((npc) => ({ ...npc }))
}

/** Keep saved relationship scores but always use latest portrait paths. */
function mergePersistedNpcs(saved: NPC[]): NPC[] {
  return defaultNpcs.map((fresh) => {
    const persisted = saved.find((npc) => npc.id === fresh.id)
    return persisted ? { ...persisted, imagePath: fresh.imagePath } : { ...fresh }
  })
}

export function createInitialStats(): PlayerStats {
  const stats: PlayerStats = {
    cash: STARTING_CASH,
    revenue: 0,
    expenses: 0,
    customers: 0,
    reputation: 50,
    publicTrust: 50,
    investorConfidence: 50,
    governmentSupport: 50,
    companyValue: STARTING_BOOK_VALUE,
    investedCapital: 0,
  }
  stats.companyValue = computeCompanyValue(stats)
  return stats
}

export function createInitialState(): GameState {
  return {
    founder: null,
    city: null,
    problem: null,
    solutionAnswers: [],
    solutionSummary: null,
    stats: createInitialStats(),
    npcs: cloneNpcs(),
    eventHistory: [],
    npcReactionHistory: [],
    dashboardActivities: [],
    expenseBreakdown: [],
    turn: 0,
    winStreakCounter: 0,
    hasLaunchedThisSolution: false,
    launchedSolutionKey: null,
    gameOutcome: 'playing',
    lossReason: null,
    lossSummary: null,
    lastLaunchEconomics: null,
  }
}

function buildBankruptcySummary(
  economics: {
    investment: number
    revenue: number
    netCash: number
    adoptionPercentage: number
  },
): string {
  return [
    `Build cost was ${formatRupeeShort(economics.investment)} but early revenue only reached ${formatRupeeShort(economics.revenue)} (${economics.adoptionPercentage}% weighted adoption).`,
    `Net launch result: ${formatRupeeShort(Math.abs(economics.netCash))} loss — cash could not stay above zero.`,
  ].join(' ')
}

function clampNpcScore(value: number): number {
  return Math.min(100, Math.max(0, value))
}

function resolveLaunchGuard(
  summary: SolutionSummary,
  launchedSolutionKey: string | null,
  hasLaunchedThisSolution: boolean,
): { hasLaunchedThisSolution: boolean; launchedSolutionKey: string | null } {
  const nextKey = solutionFingerprint(summary)
  if (hasLaunchedThisSolution && launchedSolutionKey === nextKey) {
    return { hasLaunchedThisSolution: true, launchedSolutionKey: nextKey }
  }
  return { hasLaunchedThisSolution: false, launchedSolutionKey: null }
}

/**
 * Diminishing-returns premium on cumulative invested capital:
 * - First ₹20L → 3× (early product/engineering leverage)
 * - Next ₹30L → 2× (growth spend)
 * - Beyond ₹50L total → 1.25× (late-stage efficiency drops)
 */
export function capitalPremium(investedCapital: number): number {
  const tier1 = Math.min(Math.max(investedCapital, 0), 2_000_000)
  const tier2 = Math.min(Math.max(investedCapital - 2_000_000, 0), 3_000_000)
  const tier3 = Math.max(investedCapital - 5_000_000, 0)
  return tier1 * 3 + tier2 * 2 + tier3 * 1.25
}

/**
 * Deterministic valuation — never set directly by Grok or event text.
 * - Book value anchor (₹50L)
 * - Capital premium tiers on investedCapital
 * - Revenue at 0.5× (half of annual revenue run-rate as valuation signal)
 * - Soft bonus: avg(reputation, investorConfidence) × ₹20,000 per point
 */
export function computeCompanyValue(
  stats: Pick<
    PlayerStats,
    'investedCapital' | 'revenue' | 'reputation' | 'investorConfidence'
  >,
): number {
  const softBonus =
    ((stats.reputation + stats.investorConfidence) / 2) * 20_000
  return (
    STARTING_BOOK_VALUE +
    capitalPremium(stats.investedCapital) +
    stats.revenue * 0.5 +
    softBonus
  )
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value))
}

/**
 * Single funnel for every PlayerStats mutation.
 * Phase 13 action/event engines and Phase 14 reactionToStatDelta must call this —
 * Grok output never writes to the store directly.
 */
export function mergeStatDelta(
  current: PlayerStats,
  delta: Partial<PlayerStats>,
): PlayerStats {
  const next: PlayerStats = {
    cash: current.cash + (delta.cash ?? 0),
    revenue: current.revenue + (delta.revenue ?? 0),
    expenses: current.expenses + (delta.expenses ?? 0),
    customers: current.customers + (delta.customers ?? 0),
    reputation: current.reputation + (delta.reputation ?? 0),
    publicTrust: current.publicTrust + (delta.publicTrust ?? 0),
    investorConfidence:
      current.investorConfidence + (delta.investorConfidence ?? 0),
    governmentSupport:
      current.governmentSupport + (delta.governmentSupport ?? 0),
    companyValue: current.companyValue,
    investedCapital: current.investedCapital + (delta.investedCapital ?? 0),
  }

  for (const field of SCORE_FIELDS) {
    next[field] = clampScore(next[field])
  }

  next.expenses = Math.max(0, next.expenses)
  next.customers = Math.max(0, next.customers)
  next.investedCapital = Math.max(0, next.investedCapital)

  next.companyValue = computeCompanyValue(next)
  return next
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      setFounder: (founder) => set({ founder }),

      setCity: (city) => set({ city }),

      setProblem: (problem) =>
        set({
          problem,
          hasLaunchedThisSolution: false,
          launchedSolutionKey: null,
        }),

      setSolutionAnswers: (answers, summary) =>
        set((state) => ({
          solutionAnswers: answers,
          solutionSummary: summary,
          ...resolveLaunchGuard(
            summary,
            state.launchedSolutionKey,
            state.hasLaunchedThisSolution,
          ),
        })),

      applyStatDelta: (delta) =>
        set((state) => ({
          stats: mergeStatDelta(state.stats, delta),
        })),

      advanceTurn: () => set((state) => ({ turn: state.turn + 1 })),

      logEvent: (eventId) =>
        set((state) => ({
          eventHistory: [...state.eventHistory, eventId],
        })),

      resetGame: () => set(createInitialState()),

      investCapital: (amount) => {
        if (amount <= 0) return

        const { stats } = get()
        if (amount > stats.cash) return

        get().applyStatDelta({
          cash: -amount,
          investedCapital: amount,
        })
      },

      launchStartup: (founder) => {
        const state = get()

        if (state.stats.cash <= 0) {
          const econ = state.lastLaunchEconomics
          set({
            founder,
            gameOutcome: 'lost',
            lossReason: 'bankruptcy',
            lossSummary: econ
              ? buildBankruptcySummary(econ)
              : 'Cash hit zero — the startup could not cover the launch investment.',
            stats: { ...state.stats, cash: 0 },
          })
          return
        }

        const { city, problem, solutionSummary, npcs, hasLaunchedThisSolution } =
          state
        const grokLaunchApplied = hasLaunchedThisSolution

        const reactions =
          grokLaunchApplied && state.npcReactionHistory.length > 0
            ? state.npcReactionHistory
            : city && problem && solutionSummary
              ? generateLaunchNpcReactions({
                  npcs,
                  city,
                  problem,
                  solution: solutionSummary,
                  startupName: founder.startupName,
                })
              : []

        let stats = grokLaunchApplied ? state.stats : createInitialStats()
        let expenseBreakdown = grokLaunchApplied
          ? state.expenseBreakdown
          : []
        let dashboardActivities = grokLaunchApplied
          ? state.dashboardActivities
          : []

        if (!grokLaunchApplied && problem && reactions.length > 0) {
          const outcome = computeLaunchOutcomes(reactions, problem)
          stats = mergeStatDelta(stats, outcome.delta)
          expenseBreakdown = outcome.breakdown
        }

        set({
          founder,
          stats,
          turn: 1,
          npcReactionHistory: reactions,
          expenseBreakdown,
          dashboardActivities,
        })
      },

      setNpcReactionHistory: (reactions) =>
        set({ npcReactionHistory: reactions }),

      pushDashboardActivity: (activity) =>
        set((state) => ({
          dashboardActivities: [activity, ...state.dashboardActivities].slice(
            0,
            30,
          ),
        })),

      upsertNpcReaction: (reaction) =>
        set((state) => {
          const existing = state.npcReactionHistory.findIndex(
            (item) => item.npcId === reaction.npcId,
          )
          const npcReactionHistory =
            existing >= 0
              ? state.npcReactionHistory.map((item, index) =>
                  index === existing ? reaction : item,
                )
              : [...state.npcReactionHistory, reaction]

          return { npcReactionHistory }
        }),

      addExpenseBreakdown: (items) =>
        set((state) => ({
          expenseBreakdown: mergeExpenseBreakdown(state.expenseBreakdown, items),
        })),

      performGameAction: (actionId) => {
        const { stats } = get()
        const delta = getActionDelta(actionId, stats)
        if (!canAffordAction(stats, delta)) return false

        get().applyStatDelta(delta)

        const expenseAmount = delta.expenses ?? 0
        if (expenseAmount > 0) {
          get().addExpenseBreakdown([expenseItemForAction(actionId, expenseAmount)])
        }

        return true
      },

      updateNPCRelationship: (npcId, delta) =>
        set((state) => ({
          npcs: state.npcs.map((npc) =>
            npc.id === npcId
              ? {
                  ...npc,
                  relationshipScore: clampNpcScore(
                    npc.relationshipScore + (delta.relationship ?? 0),
                  ),
                  trustScore: clampNpcScore(
                    npc.trustScore + (delta.trust ?? 0),
                  ),
                  approvalRating: clampNpcScore(
                    npc.approvalRating + (delta.approval ?? 0),
                  ),
                }
              : npc,
          ),
        })),

      applyLaunchProductResult: (result) => {
        const state = get()
        const { problem, solutionSummary, npcs, stats, turn } = state

        if (!problem || !solutionSummary) return false
        if (state.hasLaunchedThisSolution) return false
        if (state.gameOutcome === 'lost') return false

        const economics = computeLaunchProductEconomics(
          result,
          npcs,
          problem,
          solutionSummary,
          stats,
        )

        get().applyStatDelta(economics.statDelta)
        get().addExpenseBreakdown([
          {
            category: 'product',
            label: 'Grok-estimated build & launch cost',
            amount: economics.investment,
          },
        ])

        for (const reaction of result.npcReactions) {
          const magnitude = reaction.adoptionStrength
          if (reaction.willAdopt) {
            get().updateNPCRelationship(reaction.npcId, {
              relationship: magnitude * 0.12,
              trust: magnitude * 0.08,
              approval: magnitude * 0.1,
            })
          } else {
            get().updateNPCRelationship(reaction.npcId, {
              relationship: -magnitude * 0.08,
              trust: -magnitude * 0.06,
              approval: -magnitude * 0.1,
            })
          }
        }

        const activities = buildGrokLaunchActivities(
          economics,
          result,
          npcs,
          problem,
          turn,
        )
        for (const activity of activities) {
          get().pushDashboardActivity(activity)
        }

        get().logEvent(launchProductEventId(problem.id, economics))
        get().setNpcReactionHistory(economics.npcReactions)

        const currentStats = get().stats
        if (currentStats.cash < 0) {
          set({ stats: { ...currentStats, cash: 0 } })
        }

        set({
          hasLaunchedThisSolution: true,
          launchedSolutionKey: solutionFingerprint(solutionSummary),
          lastLaunchEconomics: {
            investment: economics.investment,
            revenue: economics.revenue,
            netCash: economics.netCash,
            adoptionPercentage: economics.adoptionPercentage,
            customers: economics.customers,
          },
        })
        return true
      },
    }),
    {
      name: PERSIST_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.npcs?.length) {
          state.npcs = mergePersistedNpcs(state.npcs)
        }
        if (state) {
          state.hasLaunchedThisSolution ??= false
          state.launchedSolutionKey ??= null
          state.gameOutcome ??= 'playing'
          state.lossReason ??= null
          state.lossSummary ??= null
          state.lastLaunchEconomics ??= null
        }
      },
    },
  ),
)
