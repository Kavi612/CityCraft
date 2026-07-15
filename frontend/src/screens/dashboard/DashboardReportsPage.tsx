import { formatFunds } from '@/lib/blueprintUi'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { useDashboard } from '@/context/DashboardContext'

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-3 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-stone-800">{value}</p>
    </div>
  )
}

export default function DashboardReportsPage() {
  const { founder, city, problem, stats, turn, expenseBreakdown } = useDashboard()
  const net = stats.revenue - stats.expenses

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-lg font-bold text-stone-800">City Reports</h1>
        <p className="text-sm text-stone-500">
          Revenue, expenses, and where your money goes in {city.name}.
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
        <ReportCard label="Revenue" value={formatFunds(stats.revenue)} />
        <ReportCard label="Total Expenses" value={formatFunds(stats.expenses)} />
        <ReportCard
          label="Net This Month"
          value={formatFunds(net)}
        />
        <ReportCard label="City Cash" value={formatFunds(stats.cash)} />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-card">
        <div className="mb-3 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Expense Breakdown
          </p>
          <p className="text-xs text-stone-500">
            {founder.startupName} · {problem.name} · Turn {turn}
          </p>
        </div>
        <div className="h-[calc(100%-2.5rem)] min-h-0 overflow-hidden">
          <ExpenseChart
            items={expenseBreakdown}
            totalExpenses={stats.expenses}
            totalRevenue={stats.revenue}
          />
        </div>
      </div>
    </div>
  )
}
