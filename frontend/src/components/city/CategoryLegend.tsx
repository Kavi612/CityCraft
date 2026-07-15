import { getCategoryTheme } from '@/lib/categoryMapUi'
import type { Category } from '@/types'

type CategoryLegendProps = {
  categories: Category[]
  activeCategoryName: string | null
  onSelect: (category: Category) => void
}

export function CategoryLegend({
  categories,
  activeCategoryName,
  onSelect,
}: CategoryLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 sm:gap-5">
      {categories.map((category) => {
        const theme = getCategoryTheme(category.name)
        const active = activeCategoryName === category.name

        return (
          <button
            key={category.name}
            type="button"
            onClick={() => onSelect(category)}
            className={`flex items-center gap-2 rounded-full px-2 py-1 transition-colors ${
              active ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-black/40 ring-2 ${theme.ring}`}
            >
              <img
                src={category.icon}
                alt=""
                className="h-4 w-4 object-contain"
              />
            </span>
            <span className="text-xs font-medium text-white/85">
              {theme.legend}
            </span>
          </button>
        )
      })}
    </div>
  )
}
