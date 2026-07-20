import { ChevronRight } from 'lucide-react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import type { NPC } from '@/types'

type NPCMapStripProps = {
  npcs: NPC[]
  selectedNpcId: string | null
  onSelect: (npcId: string) => void
  className?: string
}

export function NPCMapStrip({
  npcs,
  selectedNpcId,
  onSelect,
  className = '',
}: NPCMapStripProps) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-3 shadow-card ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Stakeholders
        </p>
        <p className="text-[10px] text-stone-400">Swipe · tap to open reactions</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {npcs.map((npc) => {
          const selected = selectedNpcId === npc.id

          return (
            <button
              key={npc.id}
              type="button"
              onClick={() => onSelect(npc.id)}
              className={`flex w-[7.5rem] shrink-0 flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-colors ${
                selected
                  ? 'border-primary/40 bg-primary/8'
                  : 'border-border bg-background/80 hover:border-primary/25 hover:bg-background'
              }`}
            >
              <NPCAvatarPlaceholder
                id={npc.id}
                name={npc.name}
                imagePath={npc.imagePath}
                size="sm"
                className={`border-2 ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
              />
              <div className="min-w-0 w-full">
                <p className="truncate text-xs font-semibold text-stone-800">{npc.name}</p>
                <p className="truncate text-[10px] text-stone-400">{npc.profession}</p>
              </div>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary">
                Reactions
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
