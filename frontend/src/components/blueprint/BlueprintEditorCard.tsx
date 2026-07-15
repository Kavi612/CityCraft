import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { Category, Problem } from '@/types'
import {
  BLUEPRINT_MAX_LENGTH,
  type BlueprintSection,
} from '@/lib/blueprintUi'

type BlueprintEditorCardProps = {
  section: BlueprintSection
  category?: Category
  problem: Problem
  value: string
  chips: string[]
  onChange: (value: string) => void
  onChipClick: (chip: string) => void
  onGenerateMore: () => void
}

export function BlueprintEditorCard({
  section,
  category,
  problem,
  value,
  chips,
  onChange,
  onChipClick,
  onGenerateMore,
}: BlueprintEditorCardProps) {
  return (
    <motion.section
      key={section.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0c1220]/88 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
    >
      <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          {category && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-2 ring-primary/30">
              <img
                src={category.icon}
                alt=""
                className="h-6 w-6 object-contain"
              />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {category?.name ?? 'City Problem'}
            </p>
            <h2 className="truncate text-sm font-extrabold text-white sm:text-base">
              {problem.name}
            </h2>
            <p className="line-clamp-1 text-xs text-white/55">
              {problem.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <div className="shrink-0">
          <h3 className="text-lg font-extrabold text-white sm:text-xl">
            <span className="mr-1.5" aria-hidden="true">
              {section.emoji}
            </span>
            {section.label}
          </h3>
          <p className="mt-0.5 text-xs text-white/55">{section.description}</p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <textarea
            value={value}
            maxLength={BLUEPRINT_MAX_LENGTH}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write your own startup idea..."
            className="min-h-0 flex-1 resize-none rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-sm leading-relaxed text-white outline-none transition-shadow placeholder:text-white/35 focus:border-primary focus:shadow-[0_0_0_3px_rgba(217,119,6,0.15)]"
          />
          <p className="mt-1 shrink-0 text-right text-[10px] text-white/40">
            {value.length}/{BLUEPRINT_MAX_LENGTH}
          </p>
        </div>

        <div className="shrink-0">
          <p className="text-xs font-bold text-white/80">Suggested Ideas</p>
          <div className="mt-2 flex max-h-[4.5rem] flex-wrap gap-1.5 overflow-hidden">
            {chips.slice(0, 12).map((chip) => (
              <motion.button
                key={chip}
                type="button"
                onClick={() => onChipClick(chip)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:border-primary hover:shadow-[0_0_14px_rgba(217,119,6,0.2)]"
              >
                {chip}
              </motion.button>
            ))}
          </div>

          <button
            type="button"
            onClick={onGenerateMore}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-primary/40 hover:text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Generate More Ideas
          </button>
        </div>
      </div>
    </motion.section>
  )
}
