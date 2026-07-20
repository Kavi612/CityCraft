import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight, Landmark, TrendingDown, Wallet } from 'lucide-react'
import { formatFunds } from '@/lib/blueprintUi'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { useDashboard } from '@/context/DashboardContext'

type ReportCardProps = {
  label: string
  value: string
  tone?: 'neutral' | 'positive' | 'negative' | 'accent'
  icon: ReactNode
}

function ReportCard({ label, value, tone = 'neutral', icon }: ReportCardProps) {
  const valueTone =
    tone === 'positive'
      ? 'text-emerald-600'
      : tone === 'negative'
        ? 'text-rose-600'
        : tone === 'accent'
          ? 'text-primary'
          : 'text-stone-800'

  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3 shadow-card sm:px-4 sm:py-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          {label}
        </p>
        <span className="rounded-lg bg-background p-1.5 text-stone-500">{icon}</span>
      </div>
      <p className={`mt-2 text-base font-bold tracking-tight sm:text-lg ${valueTone}`}>
        {value}
      </p>
    </div>
  )
}

export default function DashboardReportsPage() {
  const { founder, city, problem, stats, turn, expenseBreakdown } = useDashboard()
  const net = stats.revenue - stats.expenses

  return (
    <div className="flex flex-col gap-4 pb-2 lg:h-full lg:overflow-hidden lg:pb-0">
      <div className="shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-stone-800 sm:text-2xl">
          City Reports
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Revenue, expenses, and where your money goes in {city.name}.
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <ReportCard
          label="Revenue"
          value={formatFunds(stats.revenue)}
          tone="positive"
          icon={<ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />}
        />
        <ReportCard
          label="Total Expenses"
          value={formatFunds(stats.expenses)}
          tone="negative"
          icon={<ArrowDownRight className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />}
        />
        <ReportCard
          label="Net This Month"
          value={formatFunds(net)}
          tone={net >= 0 ? 'positive' : 'negative'}
          icon={
            net >= 0 ? (
              <TrendingDown className="h-3.5 w-3.5 rotate-180 text-emerald-600" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
            )
          }
        />
        <ReportCard
          label="City Cash"
          value={formatFunds(stats.cash)}
          tone="accent"
          icon={<Wallet className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
        />
      </div>

      <div className="rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        <div className="mb-4 flex shrink-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Expense Breakdown
            </p>
            <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
              {founder.startupName} · {problem.name} · Turn {turn}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            <Landmark className="h-3 w-3" aria-hidden="true" />
            Live ledger
          </div>
        </div>

        <ExpenseChart
          items={expenseBreakdown}
          totalExpenses={stats.expenses}
          totalRevenue={stats.revenue}
        />
      </div>
    </div>
  )
}
