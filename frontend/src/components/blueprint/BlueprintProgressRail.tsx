import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import {
  BLUEPRINT_SECTIONS,
  type BlueprintSectionId,
} from '@/lib/blueprintUi'

type BlueprintProgressRailProps = {
  activeId: BlueprintSectionId
  completed: Set<BlueprintSectionId>
  onSelect: (id: BlueprintSectionId) => void
}

export function BlueprintProgressRail({
  activeId,
  completed,
  onSelect,
}: BlueprintProgressRailProps) {
  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <div className="sticky top-6 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-card backdrop-blur-md">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy/50">
          Startup Blueprint
        </p>
        <div className="mt-4 space-y-2">
          {BLUEPRINT_SECTIONS.map((section) => {
            const active = section.id === activeId
            const done = completed.has(section.id)

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                  active
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-navy/70 hover:bg-stone-100'
                }`}
              >
                <span>{section.label}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'border border-primary text-primary'
                        : 'border border-stone-300 text-stone-400'
                  }`}
                >
                  {done ? (
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    '○'
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <motion.div
          className="mt-4 h-1 overflow-hidden rounded-full bg-stone-200"
          layout
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{
              width: `${(completed.size / BLUEPRINT_SECTIONS.length) * 100}%`,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </motion.div>
      </div>
    </aside>
  )
}
