import { motion } from 'framer-motion'
import { BrainCircuit, Check, TrendingUp, Users } from 'lucide-react'
import type { City } from '@/types'
import {
  CITY_ACCENT_STYLES,
  CITY_SELECTION_META,
  FOCUS_TAG_STYLES,
} from '@/data/citySelectionMeta'

type CitySelectionCardProps = {
  city: City
  selected: boolean
  index: number
  onSelect: () => void
}

export function CitySelectionCard({
  city,
  selected,
  index,
  onSelect,
}: CitySelectionCardProps) {
  const meta = CITY_SELECTION_META[city.id]
  const accent = CITY_ACCENT_STYLES[meta.accent]

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-[#0c1220]/85 text-left backdrop-blur-md transition-all duration-300 ${
        selected
          ? `${accent.border} ${accent.glow}`
          : 'border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-white/25'
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_14px_rgba(217,119,6,0.6)]">
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        </span>
      )}

      <div className="relative aspect-5/3 w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#0a101c]">
        <img
          src={city.categoryImage}
          alt={city.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-[#0c1220] to-transparent" />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <h3 className="text-base font-extrabold uppercase tracking-wide text-white sm:text-lg">
          {city.name}
        </h3>
        <p className="mt-0.5 text-xs text-white/65 sm:text-sm">{meta.motto}</p>

        <div className="mt-3 grid grid-cols-3 gap-2 border-y border-white/10 py-3">
          <div className="text-center">
            <Users
              className={`mx-auto h-4 w-4 ${accent.stat}`}
              aria-hidden="true"
            />
            <p className="mt-1 text-[10px] text-white/50">Population</p>
            <p className="text-xs font-bold text-white sm:text-sm">
              {meta.population}
            </p>
          </div>
          <div className="text-center">
            <TrendingUp
              className={`mx-auto h-4 w-4 ${accent.stat}`}
              aria-hidden="true"
            />
            <p className="mt-1 text-[10px] text-white/50">Growth</p>
            <p className="text-xs font-bold text-white sm:text-sm">
              {meta.growth}
            </p>
          </div>
          <div className="text-center">
            <BrainCircuit
              className="mx-auto h-4 w-4 text-emerald-400"
              aria-hidden="true"
            />
            <p className="mt-1 text-[10px] text-white/50">Innovation</p>
            <p className="text-xs font-bold text-white sm:text-sm">
              {meta.innovation}
            </p>
          </div>
        </div>

        <div className="mt-3 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45 sm:text-xs">
            Top Focus Areas
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meta.focusAreas.map((area) => (
              <span
                key={area.label}
                className={`rounded-full border px-2 py-0.5 text-[9px] font-medium sm:text-[10px] ${FOCUS_TAG_STYLES[area.accent]}`}
              >
                {area.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
