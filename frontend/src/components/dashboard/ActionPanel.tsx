import {
  Briefcase,
  Code2,
  Landmark,
  Megaphone,
  Tag,
} from 'lucide-react'

const ACTIONS = [
  { id: 'hire', label: 'Hire', icon: Briefcase },
  { id: 'develop', label: 'Develop', icon: Code2 },
  { id: 'price', label: 'Price', icon: Tag },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'government', label: 'Government', icon: Landmark },
] as const

export function ActionPanel() {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
        Company Actions
      </p>
      <p className="mt-1 text-sm text-stone-500">
        Action engine arrives in Phase 13 — buttons are wired for layout only.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              type="button"
              disabled
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background px-4 py-5 text-stone-500 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
