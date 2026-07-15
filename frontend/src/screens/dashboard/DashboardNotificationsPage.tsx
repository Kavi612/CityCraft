import { sentimentStyles } from '@/lib/dashboardUtils'
import { useDashboard } from '@/context/DashboardContext'

export default function DashboardNotificationsPage() {
  const { activities } = useDashboard()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 pb-4">
        <h1 className="text-lg font-bold text-stone-800">Notifications</h1>
        <p className="text-sm text-stone-500">
          {activities.length} updates from your city this turn.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-sm text-stone-400">No notifications yet.</p>
        ) : (
          activities.map((activity) => (
            <article
              key={activity.id}
              className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
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
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
