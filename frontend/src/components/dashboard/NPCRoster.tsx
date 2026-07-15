import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import type { NPC } from '@/types'

type NPCRosterProps = {
  npcs: NPC[]
}

export function NPCRoster({ npcs }: NPCRosterProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 shadow-card sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
        NPC Roster
      </p>
      <p className="mt-1 text-sm text-stone-500">
        Build relationships across {npcs.length} city stakeholders.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {npcs.map((npc) => (
          <article
            key={npc.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3"
          >
            <NPCAvatarPlaceholder
              id={npc.id}
              name={npc.name}
              imagePath={npc.imagePath}
              size="sm"
              className="border border-border"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-stone-800">
                {npc.name}
              </p>
              <p className="truncate text-xs text-stone-400">
                {npc.profession}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] font-medium text-stone-500">
                <span>Rel {npc.relationshipScore}</span>
                <span>Trust {npc.trustScore}</span>
                <span>Appr {npc.approvalRating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
