import { LayoutGrid, Map } from 'lucide-react'
import { getCategoryTheme } from '@/lib/categoryMapUi'
import type { Category } from '@/types'

type MapFooterFiltersProps = {
  categories: Category[]
  filterCategory: string | null
  heatMapEnabled: boolean
  onFilterChange: (categoryName: string | null) => void
  onHeatMapToggle: () => void
}

export function MapFooterFilters({
  categories,
  filterCategory,
  heatMapEnabled,
  onFilterChange,
  onHeatMapToggle,
}: MapFooterFiltersProps) {
  return (
    <footer className="relative z-20 shrink-0 px-3 pb-3 pt-1 sm:px-5 sm:pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-md sm:px-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <FilterPill
            active={filterCategory === null}
            onClick={() => onFilterChange(null)}
            icon={LayoutGrid}
            label="All Problems"
            accentClass="bg-primary text-white shadow-[0_0_14px_rgba(217,119,6,0.4)]"
          />

          {categories.map((category) => {
            const theme = getCategoryTheme(category.name)
            const active = filterCategory === category.name

            return (
              <FilterPill
                key={category.name}
                active={active}
                onClick={() => onFilterChange(category.name)}
                label={theme.legend}
                iconSrc={category.icon}
                ringClass={theme.ring}
              />
            )
          })}
        </div>

        <button
          type="button"
          onClick={onHeatMapToggle}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            heatMapEnabled
              ? 'border-primary/50 bg-primary/15 text-primary'
              : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10'
          }`}
        >
          <Map className="h-3.5 w-3.5" aria-hidden="true" />
          Heat Map
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-white/40 sm:text-xs">
        Click a category marker to see its problems, then pick one to solve.
      </p>
    </footer>
  )
}

function FilterPill({
  active,
  onClick,
  label,
  icon: Icon,
  iconSrc,
  accentClass,
  ringClass,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: typeof LayoutGrid
  iconSrc?: string
  accentClass?: string
  ringClass?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
        active
          ? (accentClass ?? 'bg-white/15 text-white')
          : 'bg-white/5 text-white/70 hover:bg-white/10'
      }`}
    >
      {iconSrc ? (
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/40 ring-2 ${ringClass ?? 'ring-white/20'}`}
        >
          <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
        </span>
      ) : Icon ? (
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      ) : null}
      {label}
    </button>
  )
}
