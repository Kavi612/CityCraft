import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { avatars } from '@/data/avatars'
import {
  buildLaunchActivities,
  mergeRecentActivities,
} from '@/lib/dashboardUtils'
import { generateLaunchNpcReactions } from '@/lib/npcReactionGenerator'
import { computeLaunchOutcomes } from '@/lib/launchOutcomes'
import { useGameStore } from '@/store/gameStore'

export function useDashboardBootstrap() {
  const navigate = useNavigate()

  const founder = useGameStore((state) => state.founder)
  const city = useGameStore((state) => state.city)
  const problem = useGameStore((state) => state.problem)
  const solutionSummary = useGameStore((state) => state.solutionSummary)
  const stats = useGameStore((state) => state.stats)
  const npcs = useGameStore((state) => state.npcs)
  const npcReactionHistory = useGameStore((state) => state.npcReactionHistory)
  const dashboardActivities = useGameStore((state) => state.dashboardActivities)
  const turn = useGameStore((state) => state.turn)
  const setNpcReactionHistory = useGameStore((state) => state.setNpcReactionHistory)
  const applyStatDelta = useGameStore((state) => state.applyStatDelta)
  const pushDashboardActivity = useGameStore((state) => state.pushDashboardActivity)
  const upsertNpcReaction = useGameStore((state) => state.upsertNpcReaction)
  const addExpenseBreakdown = useGameStore((state) => state.addExpenseBreakdown)
  const expenseBreakdown = useGameStore((state) => state.expenseBreakdown)
  const performGameAction = useGameStore((state) => state.performGameAction)

  useEffect(() => {
    if (!founder?.name?.trim() || turn < 1) {
      navigate('/company-setup', { replace: true })
      return
    }

    if (!city || !problem || !solutionSummary) {
      navigate('/city-map', { replace: true })
      return
    }

    const hasGrokLaunch = useGameStore.getState().hasLaunchedThisSolution

    if (npcReactionHistory.length === 0 && !hasGrokLaunch) {
      const reactions = generateLaunchNpcReactions({
        npcs,
        city,
        problem,
        solution: solutionSummary,
        startupName: founder.startupName,
      })
      setNpcReactionHistory(reactions)
      const outcome = computeLaunchOutcomes(reactions, problem)
      applyStatDelta(outcome.delta)
      if (expenseBreakdown.length === 0) {
        addExpenseBreakdown(outcome.breakdown)
      }

      if (dashboardActivities.length === 0) {
        buildLaunchActivities(reactions, npcs, problem, turn).forEach((activity) =>
          pushDashboardActivity(activity),
        )
      }
      return
    }

    if (stats.revenue > 0 && stats.expenses === 0 && !hasGrokLaunch) {
      const outcome = computeLaunchOutcomes(npcReactionHistory, problem)
      applyStatDelta(outcome.delta)
      addExpenseBreakdown(outcome.breakdown)
    }
  }, [
    founder,
    turn,
    city,
    problem,
    solutionSummary,
    npcReactionHistory,
    npcReactionHistory.length,
    stats.revenue,
    stats.expenses,
    expenseBreakdown.length,
    npcs,
    navigate,
    setNpcReactionHistory,
    applyStatDelta,
    pushDashboardActivity,
    addExpenseBreakdown,
    dashboardActivities.length,
  ])

  const founderAvatar = useMemo(
    () => avatars.find((avatar) => avatar.id === founder?.avatarId),
    [founder?.avatarId],
  )

  const activities = useMemo(() => {
    if (!problem) return dashboardActivities
    if (useGameStore.getState().hasLaunchedThisSolution) {
      return dashboardActivities
    }
    const launchSeed = buildLaunchActivities(
      npcReactionHistory,
      npcs,
      problem,
      turn,
    )
    return mergeRecentActivities(dashboardActivities, launchSeed)
  }, [dashboardActivities, npcReactionHistory, npcs, problem, turn])

  const ready = Boolean(
    founder?.name?.trim() &&
      turn >= 1 &&
      city &&
      problem &&
      solutionSummary &&
      founderAvatar,
  )

  return {
    ready,
    founder: founder!,
    founderAvatar: founderAvatar!,
    city: city!,
    problem: problem!,
    solutionSummary: solutionSummary!,
    stats,
    npcs,
    reactions: npcReactionHistory,
    activities,
    turn,
    expenseBreakdown,
    applyStatDelta,
    upsertNpcReaction,
    pushDashboardActivity,
    performGameAction,
  }
}
