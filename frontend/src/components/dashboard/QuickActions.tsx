import {
  BarChart3,
  Lightbulb,
  MessageSquarePlus,
  TriangleAlert,
} from 'lucide-react'

export type QuickActionId = 'reaction' | 'issue' | 'idea' | 'reports'

const ACTIONS: {
  id: QuickActionId
  label: string
  icon: typeof MessageSquarePlus
  iconClass: string
}[] = [
  {
    id: 'reaction',
    label: 'Add Reaction',
    icon: MessageSquarePlus,
    iconClass: 'bg-primary/12 text-primary',
  },
  {
    id: 'issue',
    label: 'Report Issue',
    icon: TriangleAlert,
    iconClass: 'bg-rose-100 text-rose-600',
  },
  {
    id: 'idea',
    label: 'Suggest Idea',
    icon: Lightbulb,
    iconClass: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'reports',
    label: 'View Reports',
    icon: BarChart3,
    iconClass: 'bg-sky-100 text-sky-600',
  },
]

type QuickActionsProps = {
  onAction: (action: QuickActionId) => void
  className?: string
}

export function QuickActions({ onAction, className = '' }: QuickActionsProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${className}`}
    >
      <div className="shrink-0 border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Quick Actions
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 p-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action.id)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/70 px-3 py-5 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.iconClass}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-center text-xs font-semibold text-stone-700">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
