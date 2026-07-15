import { getCategoryTheme } from '@/lib/categoryMapUi'
import type { Category, Problem } from '@/types'

type MapProblemPinProps = {
  problem: Problem
  category: Category
  x: number
  y: number
  active: boolean
  onSelect: () => void
}

export function MapProblemPin({
  problem,
  category,
  x,
  y,
  active,
  onSelect,
}: MapProblemPinProps) {
  const theme = getCategoryTheme(category.name)

  return (
    <button
      type="button"
      className="group absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onSelect}
      aria-label={`Open ${problem.name}`}
      aria-pressed={active}
    >
      <div
        className={`relative flex flex-col items-center transition-transform ${
          active ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#0c1220]/95 ring-4 backdrop-blur-sm sm:h-11 sm:w-11 ${theme.ring} ${active ? theme.glow : ''}`}
        >
          <img
            src={category.icon}
            alt=""
            className="h-5 w-5 object-contain sm:h-6 sm:w-6"
          />
        </span>

        <span
          className={`my-1 h-6 w-0.5 rounded-full bg-linear-to-b from-primary/80 to-primary/20 ${active ? 'opacity-100' : 'opacity-70'}`}
          aria-hidden="true"
        />

        <span
          className={`max-w-26 rounded-full px-2 py-1 text-center text-[9px] font-semibold leading-tight sm:max-w-30 sm:text-[10px] ${
            active
              ? 'bg-primary text-white shadow-[0_0_14px_rgba(217,119,6,0.55)]'
              : 'border border-white/10 bg-black/80 text-white'
          }`}
        >
          {problem.name}
        </span>
      </div>

      <span
        className={`absolute left-1/2 top-full h-6 w-10 -translate-x-1/2 rounded-full bg-primary/25 blur-md ${active ? 'opacity-100' : 'opacity-60'}`}
        aria-hidden="true"
      />
    </button>
  )
}
