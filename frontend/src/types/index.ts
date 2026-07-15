/**
 * Identifies one of the six founder archetypes selectable during onboarding.
 * Set in Choose Founder (Phase 8) and stored on {@link Founder.avatarId}.
 */
export type AvatarId =
  | 'analyst'
  | 'builder'
  | 'hustler'
  | 'strategist'
  | 'technologist'
  | 'communicator'

/**
 * Static founder archetype shown on the Choose Founder screen.
 * Sourced from `src/data/avatars.ts`; the player's pick becomes {@link Founder.avatarId}.
 */
export interface Avatar {
  id: AvatarId
  name: string
  tagline: string
  /** Short trait line shown on founder cards, e.g. "Practical • Reliable • Hardworking". */
  traits: string
  /** Keyword pills on founder selection cards. */
  tags: string[]
  imagePath: string
}

/**
 * One answer recorded during the Solution Quiz (Phase 10).
 * Written by `setSolutionAnswers` after the player completes all five questions.
 */
export interface SolutionAnswer {
  questionId: string
  selectedOption: string
  wasCustom: boolean
}

/**
 * Flat five-field solution object sent to Grok in Phase 14.
 * Keys match SolutionQuestion ids: approach, customer, revenue, pricing, edge.
 */
export interface SolutionSummary {
  approach: string
  customer: string
  revenue: string
  pricing: string
  edge: string
}

/**
 * A single preset quiz question for a startup problem.
 * Authored in city data files (Phase 4); consumed by SolutionQuiz (Phase 10).
 * The fifth "Other — write your own" option is UI-only and never stored here.
 */
export interface SolutionQuestion {
  id: string
  prompt: string
  /** Exactly four preset options — no "Other" entry. */
  options: string[]
}

/**
 * A solvable city problem with an attached five-question solution quiz.
 * Selected on the City Map (Phase 9); quiz questions drive the Grok pitch payload (Phase 14).
 */
export interface Problem {
  id: string
  name: string
  description: string
  /** Scale 1 (easiest) to 5 (hardest). */
  difficulty: number
  /** Scale 1 (smallest) to 5 (largest). */
  opportunitySize: number
  questions: SolutionQuestion[]
}

/**
 * One thematic grouping of problems on the city map (five per city).
 * Rendered as a map pin; expanding a pin shows its three {@link Problem} cards.
 */
export interface Category {
  name: string
  icon: string
  problems: Problem[]
}

/**
 * One of three playable Tamil-inspired cities.
 * Chosen during onboarding (Phase 8); background/category images drive map UI (Phase 9+).
 */
export interface City {
  id: string
  name: string
  description: string
  backgroundImage: string
  categoryImage: string
  /** Exactly five categories per city. */
  categories: Category[]
}

/** Sector taxonomy used to classify NPCs and filter the dashboard roster. */
export type NPCSector =
  | 'Government'
  | 'Finance'
  | 'Business'
  | 'Healthcare & Education'
  | 'Technology'
  | 'Community'

/**
 * A non-player character the founder can build relationships with.
 * Initialized from `src/data/npcs.ts`; scores mutate via store actions and Grok reactions (Phase 14).
 */
export interface NPC {
  id: string
  name: string
  profession: string
  sector: NPCSector
  personality: string
  imagePath: string
  /** Scale 1 (low) to 5 (high). Weighs Grok reaction → stat translation (Phase 14). */
  influenceLevel: number
  /** Range 0–100; shifts when the player takes relationship-building actions. */
  relationshipScore: number
  /** Range 0–100; shifts via events, actions, and NPC reactions. */
  trustScore: number
  /** Category names this NPC cares about — drives which NPCs are consulted per pitch (Phase 14). */
  preferredCategories: string[]
  /** Range 0–100; reflects how much this NPC approves of the player's startup. */
  approvalRating: number
}

/**
 * The player's identity, fully populated at Company Setup (Phase 11).
 * Partial avatar selection happens earlier; name and startupName are added last.
 */
export interface Founder {
  name: string
  startupName: string
  avatarId: AvatarId
}

/**
 * Core company metrics mutated by actions, events, and aggregated Grok reactions.
 * Every stat change must flow through `applyStatDelta` (Phase 6) — never set directly by Grok.
 */
export interface PlayerStats {
  cash: number
  revenue: number
  expenses: number
  customers: number
  reputation: number
  publicTrust: number
  investorConfidence: number
  governmentSupport: number
  companyValue: number
  investedCapital: number
}

/** One line in the expense ledger shown on Reports. */
export type ExpenseCategory =
  | 'team'
  | 'product'
  | 'operations'
  | 'marketing'
  | 'government'

export interface ExpenseLineItem {
  category: ExpenseCategory
  label: string
  amount: number
}

/**
 * A branching random event triggered by the event engine (Phase 13).
 * Authored in `src/data/events.ts`; presented as a modal with labeled choices.
 */
export interface GameEvent {
  id: string
  title: string
  description: string
  choices: {
    label: string
    effects: Partial<PlayerStats>
  }[]
}

/**
 * One NPC's Grok-generated response to the player's startup pitch.
 * Returned by `/api/npc-reaction` (Phase 14); translated to stat deltas via `reactionToStatDelta`.
 */
export interface NPCReaction {
  npcId: string
  reactionText: string
  /** Range 0–100; Grok's estimate of how likely this NPC is to adopt/support the solution. */
  adoptionScore: number
}

/** A dashboard timeline item from reactions, issues, or player quick actions. */
export interface DashboardActivity {
  id: string
  type: 'reaction' | 'issue' | 'idea' | 'report' | 'launch'
  title: string
  subtitle: string
  sentiment: 'positive' | 'neutral' | 'negative'
  turn: number
}

export type GameOutcome = 'playing' | 'won' | 'lost'

export type LossReason =
  | 'bankruptcy'
  | 'cash_runway'
  | 'trust_collapse'
  | 'investor_exit'

/** Snapshot saved after AI launch confirm — used for game-over copy. */
export interface LaunchEconomicsSnapshot {
  investment: number
  revenue: number
  netCash: number
  adoptionPercentage: number
  customers: number
}

/**
 * The single persisted runtime snapshot of an in-progress or completed game.
 * Shape of the Zustand store (Phase 6); serialized to localStorage via persist middleware.
 */
export interface GameState {
  founder: Founder | null
  city: City | null
  problem: Problem | null
  solutionAnswers: SolutionAnswer[]
  /** Collapsed quiz output for Grok pitch payload (Phase 14) and Company Setup summary. */
  solutionSummary: SolutionSummary | null
  stats: PlayerStats
  npcs: NPC[]
  /** IDs of {@link GameEvent}s that have fired, appended by `logEvent` during play. */
  eventHistory: string[]
  /** Grok reaction results accumulated after pitches and optional dashboard updates (Phase 14). */
  npcReactionHistory: NPCReaction[]
  /** Player-triggered dashboard events shown in Recent Activity. */
  dashboardActivities: DashboardActivity[]
  /** Itemised spend ledger for the expense chart on Reports. */
  expenseBreakdown: ExpenseLineItem[]
  turn: number
  /** Consecutive turns meeting win-threshold conditions; used by winLossEngine (Phase 15). */
  winStreakCounter: number
  /** True once Grok launch is confirmed for the current quiz submission. */
  hasLaunchedThisSolution: boolean
  /** Fingerprint of the solution that was launched — cleared when quiz answers change. */
  launchedSolutionKey: string | null
  gameOutcome: GameOutcome
  lossReason: LossReason | null
  lossSummary: string | null
  lastLaunchEconomics: LaunchEconomicsSnapshot | null
}
