import { createContext, useContext, type ReactNode } from 'react'
import type { ActionId } from '@/lib/actionsEngine'
import type { Avatar } from '@/types'
import type {
  City,
  DashboardActivity,
  ExpenseLineItem,
  Founder,
  NPC,
  NPCReaction,
  PlayerStats,
  Problem,
  SolutionSummary,
} from '@/types'

export type DashboardContextValue = {
  founder: Founder
  founderAvatar: Avatar
  city: City
  problem: Problem
  solutionSummary: SolutionSummary
  stats: PlayerStats
  npcs: NPC[]
  reactions: NPCReaction[]
  activities: DashboardActivity[]
  expenseBreakdown: ExpenseLineItem[]
  turn: number
  applyStatDelta: (delta: Partial<PlayerStats>) => void
  upsertNpcReaction: (reaction: NPCReaction) => void
  pushDashboardActivity: (activity: DashboardActivity) => void
  performGameAction: (actionId: ActionId) => boolean
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({
  value,
  children,
}: {
  value: DashboardContextValue
  children: ReactNode
}) {
  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  )
}

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
