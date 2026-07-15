import { Bell, CalendarDays, ChevronDown } from 'lucide-react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { formatGameDate } from '@/lib/dashboardUtils'
import type { Founder } from '@/types'

type DashboardTopBarProps = {
  startupName: string
  cityName: string
  founder: Founder
  founderAvatarPath: string
  turn: number
  notificationCount: number
  onNotificationsClick: () => void
}

export function DashboardTopBar({
  startupName,
  cityName,
  founder,
  founderAvatarPath,
  turn,
  notificationCount,
  onNotificationsClick,
}: DashboardTopBarProps) {
  return (
    <header className="shrink-0 border-b border-border bg-surface/80 px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-stone-800 sm:text-xl">
            {startupName}
          </h1>
          <p className="text-sm text-stone-500">
            {cityName} · Turn {turn}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-stone-600"
          >
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            {formatGameDate(turn)}
            <ChevronDown className="h-4 w-4 text-stone-400" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onNotificationsClick}
            className="relative rounded-full border border-border bg-surface p-2.5 text-stone-600 hover:text-stone-800"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3">
            <NPCAvatarPlaceholder
              id={founder.avatarId}
              name={founder.name}
              imagePath={founderAvatarPath}
              size="sm"
              className="border border-border"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-stone-800">
                {founder.name}
              </p>
              <p className="text-[11px] text-stone-400">Founder</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
