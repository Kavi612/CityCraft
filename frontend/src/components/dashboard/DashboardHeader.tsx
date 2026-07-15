import type { Founder } from '@/types'

type DashboardHeaderProps = {
  founder: Founder
  turn: number
}

export function DashboardHeader({ founder, turn }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-surface/80 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="City Craft"
            className="h-10 w-10 shrink-0 object-contain"
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              City Craft
            </p>
            <h1 className="text-xl font-bold lowercase text-stone-800 first-letter:uppercase">
              {founder.startupName.trim() || 'Your startup'}
            </h1>
          </div>
        </div>
        <p className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-stone-600">
          Turn {turn}
        </p>
      </div>
    </header>
  )
}
