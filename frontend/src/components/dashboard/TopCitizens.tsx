import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { getTopCitizens } from '@/lib/dashboardUtils'
import type { NPC, NPCReaction } from '@/types'

type TopCitizensProps = {
  npcs: NPC[]
  reactions: NPCReaction[]
  onViewAll?: () => void
}

export function TopCitizens({ npcs, reactions, onViewAll }: TopCitizensProps) {
  const leaders = getTopCitizens(npcs, reactions, 3)

  return (
    <div className="rounded-3xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Top Citizens
        </p>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-primary hover:text-primary-hover"
          >
            View all
          </button>
        )}
      </div>

      <div className="space-y-3 p-4">
        {leaders.map((entry, index) => (
          <div
            key={entry.npc.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <NPCAvatarPlaceholder
              id={entry.npc.id}
              name={entry.npc.name}
              imagePath={entry.npc.imagePath}
              size="sm"
              className="border border-border"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-stone-800">
                {entry.npc.name}
              </p>
              <p className="truncate text-xs text-stone-400">
                {entry.npc.profession}
              </p>
            </div>
            <p className="text-sm font-bold text-stone-700">
              {entry.points} pts
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
