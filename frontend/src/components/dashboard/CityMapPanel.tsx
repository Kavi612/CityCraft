import { MapPin } from 'lucide-react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import {
  MAP_FILTERS,
  npcMatchesMapFilter,
  type MapFilterId,
} from '@/lib/dashboardUtils'
import { fallbackNpcPin, NPC_MAP_PINS } from '@/lib/npcMapLayout'
import type { City, NPC } from '@/types'

type CityMapPanelProps = {
  city: City
  npcs: NPC[]
  activeFilter: MapFilterId
  selectedNpcId: string | null
  onFilterChange: (filter: MapFilterId) => void
  onNpcHighlight: (npcId: string) => void
  onNpcOpen: (npcId: string) => void
  className?: string
}

function professionShort(profession: string): string {
  return profession.split(/[\s/]+/)[0]?.slice(0, 8).toUpperCase() ?? 'NPC'
}

export function CityMapPanel({
  city,
  npcs,
  activeFilter,
  selectedNpcId,
  onFilterChange,
  onNpcHighlight,
  onNpcOpen,
  className = '',
}: CityMapPanelProps) {
  const visibleNpcs = npcs.filter((npc) => npcMatchesMapFilter(npc, activeFilter))
  const selectedNpc = visibleNpcs.find((npc) => npc.id === selectedNpcId) ?? null

  return (
    <div
      className={`relative flex h-full min-h-[min(52dvh,480px)] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${className}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={city.backgroundImage}
          alt={`${city.name} map`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-black/10" />

        <div className="relative z-10 flex items-start justify-between p-3 sm:p-4">
          <div className="rounded-2xl border border-white/20 bg-black/50 px-3 py-2 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
              <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
              City Map
            </p>
            <p className="text-sm font-bold text-white">{city.name}</p>
          </div>
          <p className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            {visibleNpcs.length} NPCs
          </p>
        </div>

        <div className="absolute inset-x-0 top-14 bottom-0 sm:top-16">
          {visibleNpcs.map((npc, index) => {
            const pin = NPC_MAP_PINS[npc.id] ?? fallbackNpcPin(index)
            const selected = selectedNpcId === npc.id

            return (
              <button
                key={npc.id}
                type="button"
                onClick={() => {
                  onNpcHighlight(npc.id)
                  if (window.matchMedia('(min-width: 1024px)').matches) {
                    onNpcOpen(npc.id)
                  }
                }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:z-30 hover:scale-110 ${
                  selected ? 'z-30 scale-110' : 'z-10'
                }`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                title={`${npc.name} — ${npc.profession}`}
              >
                <span
                  className={`absolute left-1/2 top-full mt-0.5 hidden h-2 w-2 -translate-x-1/2 rotate-45 sm:block ${
                    selected ? 'bg-white' : 'bg-primary'
                  }`}
                />
                <NPCAvatarPlaceholder
                  id={npc.id}
                  name={npc.name}
                  imagePath={npc.imagePath}
                  size="md"
                  className={`border-2 shadow-lg ring-2 transition-all sm:border-[3px] lg:h-20 lg:w-20 ${
                    selected
                      ? 'border-white ring-primary'
                      : 'border-white/80 ring-black/20 group-hover:border-primary group-hover:ring-white/90'
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-[calc(100%+0.35rem)] hidden max-w-[4.5rem] -translate-x-1/2 truncate rounded-md bg-black/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm sm:block ${
                    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {professionShort(npc.profession)}
                </span>
              </button>
            )
          })}
        </div>

        {selectedNpc && (
          <div className="absolute bottom-2 left-2 right-2 z-20 sm:hidden">
            <button
              type="button"
              onClick={() => onNpcOpen(selectedNpc.id)}
              className="flex w-full items-center gap-2.5 rounded-2xl border border-white/20 bg-black/65 px-3 py-2 text-left backdrop-blur-md transition-colors hover:bg-black/75"
            >
              <NPCAvatarPlaceholder
                id={selectedNpc.id}
                name={selectedNpc.name}
                imagePath={selectedNpc.imagePath}
                size="sm"
                className="border-2 border-primary ring-1 ring-white/50"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{selectedNpc.name}</p>
                <p className="truncate text-xs text-white/70">{selectedNpc.profession}</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-white">
                Reactions
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="relative z-20 shrink-0 border-t border-white/15 bg-black/55 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:px-4 sm:py-3 [&::-webkit-scrollbar]:hidden">
          <FilterChip
            active={activeFilter === 'all'}
            dotClass="bg-white"
            label="All"
            onClick={() => onFilterChange('all')}
          />
          {MAP_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={activeFilter === filter.id}
              dotClass={filter.dotClass}
              label={filter.label}
              onClick={() => onFilterChange(filter.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  dotClass,
  label,
  onClick,
}: {
  active: boolean
  dotClass: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-white text-stone-800 shadow-sm'
          : 'bg-white/10 text-white/85 hover:bg-white/20'
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
      {label}
    </button>
  )
}
