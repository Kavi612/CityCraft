import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Coins,
  Star,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { getCategoryTheme, impactLabel } from '@/lib/categoryMapUi'
import { getInterestedNpcs } from '@/lib/interestedNpcs'
import {
  formatInvestment,
  formatRevenuePotential,
  marketSizeLabel,
} from '@/lib/mapProblemPins'
import type { Category, City, Problem } from '@/types'

type ProblemDetailPanelProps = {
  city: City
  category: Category
  problem: Problem | null
  onSelectProblem: (problem: Problem) => void
  onBackToProblems: () => void
  onConfirm: () => void
  onClose: () => void
}

function DifficultyStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < value
              ? 'fill-amber-400 text-amber-400'
              : 'text-white/20'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function ProblemDetailPanel({
  city,
  category,
  problem,
  onSelectProblem,
  onBackToProblems,
  onConfirm,
  onClose,
}: ProblemDetailPanelProps) {
  const theme = getCategoryTheme(category.name)

  if (!problem) {
    return (
      <aside className="pointer-events-auto absolute bottom-3 right-3 top-3 z-30 flex w-[min(100%,18rem)] flex-col overflow-hidden rounded-2xl border border-primary/30 bg-[#0a101c]/92 shadow-[0_0_40px_rgba(217,119,6,0.18),0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:w-80">
        <div className="relative h-24 shrink-0 overflow-hidden">
          <img
            src={city.backgroundImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a101c] via-[#0a101c]/40 to-transparent" />
          <span
            className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 ring-2 ${theme.ring}`}
          >
            <img
              src={category.icon}
              alt=""
              className="h-5 w-5 object-contain"
            />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4">
          <h2 className="text-lg font-extrabold leading-tight text-white">
            {category.name}
          </h2>
          <p className="mt-1 text-xs text-white/55">
            Choose one of {category.problems.length} problems to solve
          </p>

          <ul className="mt-4 space-y-2">
            {category.problems.map((item) => {
              const impact = impactLabel(item)

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProblem(item)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left transition-all hover:border-primary/40 hover:bg-primary/10"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[11px] text-white/55">
                      Impact:{' '}
                      <span className="font-medium text-white">{impact}</span>
                      {' · '}
                      Difficulty: {item.difficulty}/5
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                      {item.description}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    )
  }

  const interestedNpcs = getInterestedNpcs(category.name)

  return (
    <aside className="pointer-events-auto absolute bottom-3 right-3 top-3 z-30 flex w-[min(100%,18rem)] flex-col overflow-hidden rounded-2xl border border-primary/30 bg-[#0a101c]/92 shadow-[0_0_40px_rgba(217,119,6,0.18),0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:w-80">
      <div className="relative h-28 shrink-0 overflow-hidden">
        <img
          src={city.backgroundImage}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a101c] via-[#0a101c]/40 to-transparent" />
        <span
          className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 ring-2 ${theme.ring}`}
        >
          <img
            src={category.icon}
            alt=""
            className="h-5 w-5 object-contain"
          />
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close problem details"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4">
        <button
          type="button"
          onClick={onBackToProblems}
          className="mb-2 inline-flex items-center gap-1 text-[11px] font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Back to problems
        </button>

        <h2 className="text-lg font-extrabold leading-tight text-white">
          {problem.name}
        </h2>
        <span className="mt-2 inline-flex w-fit rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
          {category.name}
        </span>
        <p className="mt-3 text-xs leading-relaxed text-white/65">
          {problem.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile label="Difficulty">
            <DifficultyStars value={problem.difficulty} />
          </StatTile>
          <StatTile label="Market Size">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-white">
                {marketSizeLabel(problem.opportunitySize)}
              </span>
            </div>
          </StatTile>
          <StatTile label="Investment">
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              <span className="text-xs font-semibold text-white">
                {formatInvestment(problem.difficulty)}
              </span>
            </div>
          </StatTile>
          <StatTile label="Potential Revenue">
            <span className="text-xs font-semibold text-emerald-300">
              {formatRevenuePotential(problem.opportunitySize)}
            </span>
          </StatTile>
        </div>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-white/45">
          NPCs Interested
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {interestedNpcs.map((npc) => (
            <div key={npc.id} className="flex flex-col items-center gap-1">
              <NPCAvatarPlaceholder
                id={npc.id}
                name={npc.name}
                imagePath={npc.imagePath}
                size="sm"
                className="border border-white/15"
              />
              <p className="w-full truncate text-center text-[9px] text-white/55">
                {npc.profession}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-amber-500 py-3 text-sm font-bold text-white shadow-[0_6px_20px_rgba(217,119,6,0.45)] transition-transform hover:scale-[1.01]"
        >
          Solve This Problem
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}

function StatTile({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-2.5 py-2">
      <p className="text-[9px] uppercase tracking-wider text-white/45">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  )
}
