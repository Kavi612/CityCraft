import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  HandCoins,
  Landmark,
  Minus,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { formatFunds } from '@/lib/blueprintUi'
import { statTrend } from '@/lib/dashboardUtils'
import type { PlayerStats } from '@/types'
import type { LucideIcon } from 'lucide-react'

type StatCardConfig = {
  key: keyof PlayerStats
  label: string
  icon: LucideIcon
  iconClass: string
  format: (value: number) => string
}

const STAT_CARDS: StatCardConfig[] = [
  {
    key: 'cash',
    label: 'City Cash',
    icon: Wallet,
    iconClass: 'bg-sky-100 text-sky-600',
    format: formatFunds,
  },
  {
    key: 'revenue',
    label: 'Revenue',
    icon: TrendingUp,
    iconClass: 'bg-emerald-100 text-emerald-600',
    format: formatFunds,
  },
  {
    key: 'expenses',
    label: 'Expenses',
    icon: HandCoins,
    iconClass: 'bg-rose-100 text-rose-600',
    format: formatFunds,
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: Users,
    iconClass: 'bg-indigo-100 text-indigo-600',
    format: (v) => v.toLocaleString('en-IN'),
  },
  {
    key: 'reputation',
    label: 'Reputation',
    icon: Star,
    iconClass: 'bg-amber-100 text-amber-600',
    format: (v) => `${v}/100`,
  },
  {
    key: 'publicTrust',
    label: 'Public Trust',
    icon: Shield,
    iconClass: 'bg-teal-100 text-teal-600',
    format: (v) => `${v}/100`,
  },
  {
    key: 'investorConfidence',
    label: 'Investor Confidence',
    icon: Building2,
    iconClass: 'bg-violet-100 text-violet-600',
    format: (v) => `${v}/100`,
  },
  {
    key: 'governmentSupport',
    label: 'Gov. Support',
    icon: Landmark,
    iconClass: 'bg-orange-100 text-orange-600',
    format: (v) => `${v}/100`,
  },
  {
    key: 'companyValue',
    label: 'Community Cash',
    icon: Wallet,
    iconClass: 'bg-lime-100 text-lime-700',
    format: formatFunds,
  },
]

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') {
    return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
  }
  if (trend === 'down') {
    return <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
  }
  return <Minus className="h-3.5 w-3.5 text-stone-300" />
}

type StatCardsProps = {
  stats: PlayerStats
  compact?: boolean
}

export function StatCards({ stats, compact = false }: StatCardsProps) {
  return (
    <div
      className={`grid shrink-0 gap-2 sm:gap-3 ${
        compact
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-9'
      }`}
    >
      {STAT_CARDS.map((card) => {
        const Icon = card.icon
        const value = stats[card.key]
        const trend = statTrend(card.key, value)

        return (
          <article
            key={card.key}
            className={`rounded-2xl border border-border bg-surface shadow-card ${
              compact ? 'px-2 py-2' : 'px-3 py-3'
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <span
                className={`inline-flex items-center justify-center rounded-xl ${card.iconClass} ${
                  compact ? 'h-7 w-7' : 'h-8 w-8'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <TrendIcon trend={trend} />
            </div>
            <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-stone-400 sm:text-[10px]">
              {card.label}
            </p>
            <p className="mt-0.5 text-[11px] font-bold leading-tight text-stone-800 sm:text-xs">
              {card.format(value)}
            </p>
          </article>
        )
      })}
    </div>
  )
}
