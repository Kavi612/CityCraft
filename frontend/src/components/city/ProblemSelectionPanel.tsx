import { ArrowLeft, Plus } from 'lucide-react'
import { impactLabel, PROBLEM_REWARDS } from '@/lib/categoryMapUi'
import type { Category, Problem } from '@/types'

type ProblemSelectionPanelProps = {
  category: Category
  selectedProblem: Problem | null
  onSelectProblem: (problem: Problem) => void
  onConfirm: () => void
  onClose: () => void
}

export function ProblemSelectionPanel({
  category,
  selectedProblem,
  onSelectProblem,
  onConfirm,
  onClose,
}: ProblemSelectionPanelProps) {
  return (
    <aside className="flex h-full w-full flex-col rounded-2xl bg-[#0a101c]/95 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          + Problem Details
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-white/50 transition-colors hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={category.icon}
            alt=""
            className="h-10 w-10 rounded-full bg-white/10 p-1.5 object-contain"
          />
          <div>
            <h2 className="text-sm font-bold text-white">{category.name}</h2>
            <p className="text-xs text-white/50">
              {category.problems.length} problems available
            </p>
          </div>
        </div>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-white/45">
          Choose a problem
        </p>

        <ul className="mt-2 space-y-2">
          {category.problems.map((problem) => {
            const isActive = selectedProblem?.id === problem.id
            const impact = impactLabel(problem)

            return (
              <li key={problem.id}>
                <button
                  type="button"
                  onClick={() => onSelectProblem(problem)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(217,119,6,0.25)]'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <p className="text-sm font-semibold text-white">
                    {problem.name}
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Impact:{' '}
                    <span className="font-medium text-white">{impact}</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                    {problem.description}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>

        {selectedProblem && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
              Potential Rewards
            </p>
            <ul className="mt-2 space-y-1.5">
              {PROBLEM_REWARDS.map((reward) => (
                <li
                  key={reward}
                  className="flex items-center gap-2 text-xs text-emerald-300"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  {reward}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!selectedProblem}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-amber-500 py-3 text-sm font-bold text-white shadow-[0_6px_20px_rgba(217,119,6,0.4)] transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Select This Problem
          <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
