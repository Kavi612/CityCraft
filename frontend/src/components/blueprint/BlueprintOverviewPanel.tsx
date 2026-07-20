import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { getInterestedNpcs } from '@/lib/interestedNpcs'
import {
  buildTimeLabel,
  expectedUsersLabel,
  type StartupScores,
} from '@/lib/blueprintUi'
import {
  formatInvestment,
  formatRevenuePotential,
  marketSizeLabel,
} from '@/lib/mapProblemPins'
import type { Category, Problem } from '@/types'

type BlueprintOverviewPanelProps = {
  category?: Category
  problem: Problem
  scores: StartupScores
}

function ScoreBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-medium text-white/70">{label}</span>
        <span className="font-bold text-white">{Math.round(value)}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-primary to-amber-300"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export function BlueprintOverviewPanel({
  category,
  problem,
  scores,
}: BlueprintOverviewPanelProps) {
  const npcs = getInterestedNpcs(category?.name ?? '', 5)

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 lg:h-full lg:w-64 xl:w-72">
      <div className="flex max-h-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a101c]/92 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-h-72 lg:max-h-none lg:min-h-0 lg:flex-1">
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
          Problem Overview
        </p>

        <div className="mt-2 shrink-0 space-y-1.5">
          <OverviewRow label="Difficulty">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`h-3 w-3 ${
                    index < problem.difficulty
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-white/20'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </OverviewRow>
          <OverviewRow
            label="Market Size"
            value={marketSizeLabel(problem.opportunitySize)}
          />
          <OverviewRow
            label="Investment"
            value={formatInvestment(problem.difficulty)}
          />
          <OverviewRow
            label="Revenue"
            value={formatRevenuePotential(problem.opportunitySize)}
          />
          <OverviewRow
            label="Users"
            value={expectedUsersLabel(problem.opportunitySize)}
          />
          <OverviewRow
            label="Build Time"
            value={buildTimeLabel(problem.difficulty)}
          />
        </div>

        <p className="mt-3 shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
          Affected NPCs
        </p>
        <div className="mt-2 grid shrink-0 grid-cols-3 gap-2">
          {npcs.map((npc) => (
            <div key={npc.id} className="flex flex-col items-center gap-1">
              <NPCAvatarPlaceholder
                id={npc.id}
                name={npc.name}
                imagePath={npc.imagePath}
                size="md"
                className="h-12 w-12 border-2 border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.35)] sm:h-14 sm:w-14"
              />
              <p className="line-clamp-2 w-full text-center text-[9px] font-medium leading-tight text-white/75">
                {npc.profession}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 shrink-0 border-t border-white/10 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
            AI Startup Score
          </p>
          <div className="mt-2 space-y-2">
            <ScoreBar label="Innovation" value={scores.innovation} />
            <ScoreBar label="Scalability" value={scores.scalability} />
            <ScoreBar label="Impact" value={scores.impact} />
            <ScoreBar label="Execution" value={scores.execution} />
          </div>
        </div>
      </div>
    </aside>
  )
}

function OverviewRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/8 pb-1 last:border-b-0 last:pb-0">
      <span className="text-[10px] text-white/50">{label}</span>
      {children ?? (
        <span className="text-[10px] font-bold text-white">{value}</span>
      )}
    </div>
  )
}
