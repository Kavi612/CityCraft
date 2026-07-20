import {
  DASHBOARD_NAV_ITEMS,
} from '@/components/dashboard/DashboardMobileNav'
import { ArrowRight } from 'lucide-react'
import { DASHBOARD_PATHS } from '@/lib/dashboardUtils'

const NAV_ITEMS = DASHBOARD_NAV_ITEMS.map((item) => ({
  ...item,
  label:
    item.path === DASHBOARD_PATHS.dashboard
      ? 'Dashboard'
      : item.path === DASHBOARD_PATHS.leaderboard
        ? 'Leaderboard'
        : item.path === DASHBOARD_PATHS.notifications
          ? 'Notifications'
          : item.label,
}))

type DashboardSidebarProps = {
  startupName: string
  currentPath: string
  onNavigate: (path: string) => void
}

export function DashboardSidebar({
  startupName,
  currentPath,
  onNavigate,
}: DashboardSidebarProps) {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col overflow-hidden border-r border-border bg-surface/90 px-4 py-5 lg:flex">
      <div className="mb-6 flex shrink-0 items-center gap-3">
        <img
          src="/assets/logo.png"
          alt="City Craft"
          className="h-11 w-11 object-contain"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            City Craft
          </p>
          <p className="truncate text-lg font-bold text-stone-800">
            {startupName}
          </p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = currentPath === item.path

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary/12 text-primary'
                  : 'text-stone-500 hover:bg-background hover:text-stone-800'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-4 shrink-0 rounded-2xl border border-border bg-background p-4 shadow-card">
        <div className="mb-3 flex -space-x-2">
          {[
            '/assets/npcs/murugan-ravi.png',
            '/assets/npcs/nila-kannan.png',
            '/assets/npcs/karthik-rajan.png',
          ].map((path) => (
            <img
              key={path}
              src={path}
              alt=""
              className="h-9 w-9 rounded-full border-2 border-surface object-cover"
            />
          ))}
        </div>
        <p className="text-sm font-semibold text-stone-800">
          Your voice shapes our city.
        </p>
        <p className="mt-1 text-xs text-stone-500">Keep reacting!</p>
        <button
          type="button"
          onClick={() => onNavigate(DASHBOARD_PATHS.reactions)}
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover"
          aria-label="Open reactions"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
