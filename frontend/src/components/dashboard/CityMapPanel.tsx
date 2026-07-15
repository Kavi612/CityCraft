import { MapPin } from 'lucide-react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import {
  MAP_FILTERS,
  npcMatchesMapFilter,
  type MapFilterId,
} from '@/lib/dashboardUtils'
import { NPC_MAP_PINS } from '@/lib/npcMapLayout'
import type { City, NPC } from '@/types'

type CityMapPanelProps = {
  city: City
  npcs: NPC[]
  activeFilter: MapFilterId
  selectedNpcId: string | null
  onFilterChange: (filter: MapFilterId) => void
  onNpcSelect: (npcId: string) => void
  className?: string
}

export function CityMapPanel({
  city,
  npcs,
  activeFilter,
  selectedNpcId,
  onFilterChange,
  onNpcSelect,
  className = '',
}: CityMapPanelProps) {
  const visibleNpcs = npcs.filter((npc) => npcMatchesMapFilter(npc, activeFilter))

  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${className}`}
    >
      <img
        src={city.backgroundImage}
        alt={`${city.name} map`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

      <div className="relative z-10 flex items-start justify-between p-4">
        <div className="rounded-2xl border border-white/20 bg-black/45 px-3 py-2 backdrop-blur-sm">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
            <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
            City Map
          </p>
          <p className="text-sm font-bold text-white">{city.name}</p>
        </div>
        <p className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          {visibleNpcs.length} NPCs
        </p>
      </div>

      <div className="absolute inset-0 pb-16">
        {visibleNpcs.map((npc, index) => {
          const pin =
            NPC_MAP_PINS[npc.id] ?? {
              x: 12 + (index % 5) * 18,
              y: 20 + Math.floor(index / 5) * 16,
            }
          const selected = selectedNpcId === npc.id

          return (
            <button
              key={npc.id}
              type="button"
              onClick={() => onNpcSelect(npc.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                selected ? 'z-20 scale-110' : 'z-10'
              }`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              title={`${npc.name} — ${npc.profession}`}
            >
              <span
                className={`absolute left-1/2 top-full mt-1 h-2.5 w-2.5 -translate-x-1/2 rotate-45 ${
                  selected ? 'bg-white' : 'bg-primary'
                }`}
              />
              <NPCAvatarPlaceholder
                id={npc.id}
                name={npc.name}
                imagePath={npc.imagePath}
                size="lg"
                className={`border-[3px] ring-2 ${
                  selected
                    ? 'border-white ring-primary'
                    : 'border-primary ring-white/90'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center gap-2 border-t border-white/15 bg-black/50 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            activeFilter === 'all'
              ? 'bg-white text-stone-800'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-white" />
          All
        </button>
        {MAP_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              activeFilter === filter.id
                ? 'bg-white text-stone-800'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${filter.dotClass}`} />
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
