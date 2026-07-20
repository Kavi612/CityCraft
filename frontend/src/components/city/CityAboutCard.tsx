import { BarChart3 } from 'lucide-react'
import type { City } from '@/types'

type CityAboutCardProps = {
  city: City
  description: string
  className?: string
}

export function CityAboutCard({ city, description, className = '' }: CityAboutCardProps) {
  return (
    <div
      className={`pointer-events-auto absolute left-2 top-2 z-20 max-w-[calc(100%-1rem)] rounded-2xl border border-white/15 bg-black/50 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:left-4 sm:top-4 sm:max-w-60 sm:p-4 md:max-w-52 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <img
          src={city.categoryImage}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full border border-white/15 object-cover"
        />
        <p className="text-xs font-bold text-white">About {city.name}</p>
      </div>
      <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-white/65">
        {description}
      </p>
      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-semibold text-white/90 transition-colors hover:bg-white/10"
      >
        <BarChart3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        City Overview
      </button>
    </div>
  )
}
