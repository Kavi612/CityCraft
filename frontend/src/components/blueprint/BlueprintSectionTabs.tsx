import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { BlueprintSection, BlueprintSectionId } from '@/lib/blueprintUi'

type BlueprintSectionTabsProps = {
  sections: BlueprintSection[]
  activeId: BlueprintSectionId
  completed: Set<BlueprintSectionId>
  onSelect: (id: BlueprintSectionId) => void
}

export function BlueprintSectionTabs({
  sections,
  activeId,
  completed,
  onSelect,
}: BlueprintSectionTabsProps) {
  return (
    <div className="relative z-10 mt-2 shrink-0 overflow-x-auto pb-0.5">
      <div className="flex min-w-max items-center gap-1.5 rounded-2xl border border-white/10 bg-black/45 p-1.5 backdrop-blur-md">
        {sections.map((section) => {
          const active = section.id === activeId
          const done = completed.has(section.id)

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                active
                  ? 'bg-primary text-white shadow-[0_6px_20px_rgba(217,119,6,0.35)]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span aria-hidden="true">{section.emoji}</span>
              <span className="whitespace-nowrap">{section.label}</span>
              {done && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    active ? 'bg-white/20' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                </motion.span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
