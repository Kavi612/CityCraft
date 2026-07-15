import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { useDashboard } from '@/context/DashboardContext'
import { getTopCitizens } from '@/lib/dashboardUtils'

export default function DashboardLeaderboardPage() {
  const { npcs, reactions } = useDashboard()
  const leaders = getTopCitizens(npcs, reactions, npcs.length)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 pb-4">
        <h1 className="text-lg font-bold text-stone-800">Top Citizens</h1>
        <p className="text-sm text-stone-500">
          Ranked by support, relationship, and influence.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {leaders.map((entry, index) => (
          <div
            key={entry.npc.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {index + 1}
            </span>
            <NPCAvatarPlaceholder
              id={entry.npc.id}
              name={entry.npc.name}
              imagePath={entry.npc.imagePath}
              size="md"
              className="border border-border"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-stone-800">
                {entry.npc.name}
              </p>
              <p className="truncate text-xs text-stone-500">
                {entry.npc.profession}
              </p>
            </div>
            <p className="shrink-0 font-bold text-stone-700">
              {entry.points} pts
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
