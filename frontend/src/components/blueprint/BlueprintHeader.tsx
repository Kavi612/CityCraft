import { ArrowLeft, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { City } from '@/types'
import { formatFunds } from '@/lib/blueprintUi'

type BlueprintHeaderProps = {
  city: City
  cash: number
  turn: number
}

export function BlueprintHeader({ city, cash, turn }: BlueprintHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="relative z-20 flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate('/city-map')}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md hover:bg-black/60 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Map
        </button>
        <img
          src="/assets/logo.png"
          alt="City Craft"
          className="hidden h-8 w-auto object-contain sm:block lg:h-9"
        />
      </div>

      <div className="flex-1 text-center sm:px-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          City Craft
        </p>
        <h1 className="text-xs font-extrabold uppercase tracking-wide sm:text-lg">
          YOUR STARTUP BLUEPRINT
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end sm:gap-2">
        <StatPill icon={MapPin} label="City" value={city.name} />
        <StatPill label="Day" value={`Day ${turn || 1}`} />
        <StatPill label="Funds" value={formatFunds(cash)} accent />
      </div>
    </header>
  )
}

function StatPill({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon?: typeof MapPin
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/45 px-2.5 py-1.5 backdrop-blur-md">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-white/45">
        {label}
      </p>
      <p
        className={`flex items-center gap-1 text-[11px] font-bold sm:text-xs ${accent ? 'text-emerald-300' : 'text-white'}`}
      >
        {Icon ? <Icon className="h-3 w-3 text-primary" aria-hidden="true" /> : null}
        {value}
      </p>
    </div>
  )
}
