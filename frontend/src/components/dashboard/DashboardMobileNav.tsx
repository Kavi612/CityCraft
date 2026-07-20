import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Map,
  MessageCircle,
  Settings,
  Trophy,
} from 'lucide-react'
import { DASHBOARD_PATHS } from '@/lib/dashboardUtils'

export const DASHBOARD_NAV_ITEMS = [
  { path: DASHBOARD_PATHS.dashboard, label: 'Home', icon: LayoutDashboard },
  { path: DASHBOARD_PATHS['city-map'], label: 'Map', icon: Map },
  { path: DASHBOARD_PATHS.reactions, label: 'Reactions', icon: MessageCircle },
  { path: DASHBOARD_PATHS.reports, label: 'Reports', icon: BarChart3 },
  { path: DASHBOARD_PATHS.leaderboard, label: 'Ranks', icon: Trophy },
  { path: DASHBOARD_PATHS.notifications, label: 'Alerts', icon: Bell },
  { path: DASHBOARD_PATHS.settings, label: 'Settings', icon: Settings },
] as const

type DashboardMobileNavProps = {
  currentPath: string
  onNavigate: (path: string) => void
}

export function DashboardMobileNav({
  currentPath,
  onNavigate,
}: DashboardMobileNavProps) {
  return (
    <nav
      className="shrink-0 border-t border-border bg-surface/95 px-1 py-1.5 backdrop-blur-md lg:hidden"
      aria-label="Dashboard navigation"
    >
      <div className="flex gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = currentPath === item.path

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`flex min-w-[4.25rem] shrink-0 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-colors ${
                active
                  ? 'bg-primary/12 text-primary'
                  : 'text-stone-500 hover:bg-background hover:text-stone-800'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
