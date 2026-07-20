import {
  ArrowLeft,
  BarChart3,
  Bell,
  CloudSun,
  Coins,
  MapPin,
  Settings,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { City } from '@/types'
import type { CitySelectionMeta } from '@/data/citySelectionMeta'

type CityMapHeaderProps = {
  city: City
  meta: CitySelectionMeta
  cash: number
  turn: number
}

function formatCash(amount: number): string {
  if (amount >= 1_000_000) {
    return `₹${(amount / 100_000).toFixed(0)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export function CityMapHeader({ city, meta, cash, turn }: CityMapHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/city')}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md hover:bg-black/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-extrabold uppercase tracking-wide sm:text-base">
              {city.name}
            </h1>
            <p className="truncate text-[10px] text-white/55 sm:text-xs">
              {meta.motto}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 md:hidden">
        <StatPill icon={Coins} label="Cash" value={formatCash(cash)} accent="text-emerald-300" />
        <StatPill icon={BarChart3} label="Day" value={`Day ${turn || 1}`} />
      </div>

      <div className="hidden flex-wrap items-center justify-center gap-2 md:flex lg:flex">
        <StatPill icon={Users} label="Population" value={meta.population} />
        <StatPill
          icon={TrendingUp}
          label="Economy"
          value={meta.growth}
          accent="text-emerald-400"
        />
        <StatPill icon={BarChart3} label="Day" value={`Day ${turn || 1}`} />
        <StatPill icon={CloudSun} label="Weather" value="32°C Sunny" />
        <StatPill
          icon={Coins}
          label="Cash"
          value={formatCash(cash)}
          accent="text-emerald-300"
        />
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <IconCircleButton icon={Bell} label="Notifications" />
        <IconCircleButton icon={Trophy} label="Achievements" />
        <IconCircleButton icon={Settings} label="Settings" />
      </div>
    </header>
  )
}

function StatPill({
  icon: Icon,
  label,
  value,
  accent = 'text-white',
}: {
  icon: typeof Users
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      <div>
        <p className="text-[9px] uppercase tracking-wider text-white/45">
          {label}
        </p>
        <p className={`text-xs font-bold ${accent}`}>{value}</p>
      </div>
    </div>
  )
}

function IconCircleButton({
  icon: Icon,
  label,
}: {
  icon: typeof Bell
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:bg-black/55"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
