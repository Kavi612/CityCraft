import { sentimentStyles } from '@/lib/dashboardUtils'
import type { DashboardActivity } from '@/types'

type RecentActivityProps = {
  activities: DashboardActivity[]
  className?: string
}

export function RecentActivity({ activities, className = '' }: RecentActivityProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${className}`}
    >
      <div className="shrink-0 border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Recent Activity
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {activities.length === 0 ? (
          <p className="text-sm text-stone-400">No activity yet this turn.</p>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <article
              key={activity.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-background/70 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">
                  {activity.title}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {activity.subtitle}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${sentimentStyles(activity.sentiment)}`}
              >
                {activity.sentiment}
              </span>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
