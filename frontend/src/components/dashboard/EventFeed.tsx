import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { adoptionLabel, adoptionSentiment, sentimentStyles } from '@/lib/dashboardUtils'
import type { NPC, NPCReaction } from '@/types'

type EventFeedProps = {
  reactions: NPCReaction[]
  npcs: NPC[]
  limit?: number
  highlightNpcId?: string | null
  onViewAll?: () => void
  className?: string
}

function npcById(npcs: NPC[], id: string): NPC | undefined {
  return npcs.find((npc) => npc.id === id)
}

export function EventFeed({
  reactions,
  npcs,
  limit,
  highlightNpcId,
  onViewAll,
  className = '',
}: EventFeedProps) {
  const sorted = [...reactions].sort(
    (a, b) => b.adoptionScore - a.adoptionScore,
  )
  const visible = limit ? sorted.slice(0, limit) : sorted

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            City Reactions
          </p>
          <h2 className="text-sm font-bold text-stone-800">
            {reactions.length} people responded
          </h2>
        </div>
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {visible.length === 0 ? (
          <p className="text-center text-sm text-stone-400">
            Launch your startup to hear from the city.
          </p>
        ) : (
          visible.map((reaction) => {
            const npc = npcById(npcs, reaction.npcId)
            if (!npc) return null

            const sentiment = adoptionSentiment(reaction.adoptionScore)
            const highlighted = highlightNpcId === reaction.npcId

            return (
              <article
                key={reaction.npcId}
                className={`rounded-2xl border p-3 transition-colors ${
                  highlighted
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <NPCAvatarPlaceholder
                    id={npc.id}
                    name={npc.name}
                    imagePath={npc.imagePath}
                    size="md"
                    className="border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-stone-800">
                        {npc.name}
                      </p>
                      <span className="text-xs text-stone-400">
                        {npc.profession}
                      </span>
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${sentimentStyles(sentiment)}`}
                      >
                        {adoptionLabel(reaction.adoptionScore)}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-stone-600">
                      {reaction.reactionText}
                    </p>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
