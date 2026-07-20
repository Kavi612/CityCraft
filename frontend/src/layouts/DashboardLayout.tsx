import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { DashboardProvider } from '@/context/DashboardContext'
import { DashboardMobileNav } from '@/components/dashboard/DashboardMobileNav'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar'
import { useDashboardBootstrap } from '@/hooks/useDashboardBootstrap'
import { DASHBOARD_PATHS } from '@/lib/dashboardUtils'
import { useGameStore } from '@/store/gameStore'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const gameOutcome = useGameStore((state) => state.gameOutcome)
  const bootstrap = useDashboardBootstrap()

  useEffect(() => {
    if (gameOutcome === 'lost') {
      navigate('/game-over', { replace: true })
    }
  }, [gameOutcome, navigate])

  if (!bootstrap.ready) {
    return (
      <div className="flex h-svh items-center justify-center bg-background text-sm text-stone-500">
        Loading dashboard…
      </div>
    )
  }

  const {
    founder,
    founderAvatar,
    city,
    problem,
    solutionSummary,
    stats,
    npcs,
    reactions,
    activities,
    turn,
    expenseBreakdown,
    applyStatDelta,
    upsertNpcReaction,
    pushDashboardActivity,
    performGameAction,
  } = bootstrap

  return (
    <DashboardProvider
      value={{
        founder,
        founderAvatar,
        city,
        problem,
        solutionSummary,
        stats,
        npcs,
        reactions,
        activities,
        turn,
        expenseBreakdown,
        applyStatDelta,
        upsertNpcReaction,
        pushDashboardActivity,
        performGameAction,
      }}
    >
      <div className="flex h-svh overflow-hidden bg-background">
        <DashboardSidebar
          startupName={founder.startupName}
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardTopBar
            startupName={founder.startupName}
            cityName={city.name}
            founder={founder}
            founderAvatarPath={founderAvatar.imagePath}
            turn={turn}
            notificationCount={Math.min(activities.length, 9)}
            onNotificationsClick={() => navigate(DASHBOARD_PATHS.notifications)}
          />

          <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-6 sm:py-5 lg:overflow-hidden">
            <Outlet />
          </main>

          <DashboardMobileNav
            currentPath={location.pathname}
            onNavigate={(path) => navigate(path)}
          />
        </div>
      </div>
    </DashboardProvider>
  )
}
