import { getCategoryTheme } from '@/lib/categoryMapUi'
import type { Category } from '@/types'

type MapCategoryPinProps = {
  category: Category
  x: number
  y: number
  active: boolean
  onSelect: () => void
}

export function MapCategoryPin({
  category,
  x,
  y,
  active,
  onSelect,
}: MapCategoryPinProps) {
  const theme = getCategoryTheme(category.name)

  return (
    <button
      type="button"
      className="group absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onSelect}
      aria-label={`Open ${category.name} problems`}
      aria-pressed={active}
    >
      <div
        className={`relative flex flex-col items-center transition-transform ${
          active ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#0c1220]/95 ring-4 backdrop-blur-sm sm:h-16 sm:w-16 ${theme.ring} ${active ? theme.glow : ''}`}
        >
          <img
            src={category.icon}
            alt=""
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          />
        </span>

        <span
          className={`my-1 h-6 w-0.5 rounded-full bg-linear-to-b from-primary/80 to-primary/20 ${active ? 'opacity-100' : 'opacity-70'}`}
          aria-hidden="true"
        />

        <span
          className={`max-w-26 rounded-full px-2.5 py-1 text-center text-[10px] font-semibold leading-tight sm:max-w-30 sm:text-xs ${
            active
              ? 'bg-primary text-white shadow-[0_0_14px_rgba(217,119,6,0.55)]'
              : 'border border-white/10 bg-black/80 text-white'
          }`}
        >
          {theme.legend}
        </span>
      </div>

      <span
        className={`absolute left-1/2 top-full h-6 w-10 -translate-x-1/2 rounded-full bg-primary/25 blur-md ${active ? 'opacity-100' : 'opacity-60'}`}
        aria-hidden="true"
      />
    </button>
  )
}
