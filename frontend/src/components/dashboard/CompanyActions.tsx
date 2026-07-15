import {
  Briefcase,
  Code2,
  Landmark,
  Megaphone,
  Tag,
} from 'lucide-react'
import { actionCashCost, getActionDelta, type ActionId } from '@/lib/actionsEngine'
import { formatFunds } from '@/lib/blueprintUi'
import { useDashboard } from '@/context/DashboardContext'

const ACTIONS: {
  id: ActionId
  label: string
  icon: typeof Briefcase
  iconClass: string
}[] = [
  { id: 'hire', label: 'Hire', icon: Briefcase, iconClass: 'bg-primary/12 text-primary' },
  { id: 'develop', label: 'Develop', icon: Code2, iconClass: 'bg-sky-100 text-sky-600' },
  { id: 'adjustPricing', label: 'Price', icon: Tag, iconClass: 'bg-amber-100 text-amber-600' },
  {
    id: 'runMarketing',
    label: 'Marketing',
    icon: Megaphone,
    iconClass: 'bg-violet-100 text-violet-600',
  },
  {
    id: 'lobbyGovernment',
    label: 'Government',
    icon: Landmark,
    iconClass: 'bg-stone-200 text-stone-600',
  },
]

type CompanyActionsProps = {
  className?: string
  onActionTaken?: (actionId: ActionId) => void
}

export function CompanyActions({ className = '', onActionTaken }: CompanyActionsProps) {
  const { stats, performGameAction } = useDashboard()

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${className}`}
    >
      <div className="shrink-0 border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Company Actions
        </p>
        <p className="mt-0.5 text-xs text-stone-500">
          Each action spends cash and updates your expense ledger.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-5">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          const delta = getActionDelta(action.id, stats)
          const cost = actionCashCost(delta)
          const affordable = stats.cash >= cost

          return (
            <button
              key={action.id}
              type="button"
              disabled={!affordable}
              onClick={() => {
                if (performGameAction(action.id)) {
                  onActionTaken?.(action.id)
                }
              }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/70 px-2 py-4 transition-colors hover:border-primary/30 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${action.iconClass}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-center text-xs font-semibold text-stone-700">
                {action.label}
              </span>
              {cost > 0 && (
                <span className="text-[10px] font-medium text-stone-400">
                  −{formatFunds(cost)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
