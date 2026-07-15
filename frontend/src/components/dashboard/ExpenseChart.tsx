import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatFunds } from '@/lib/blueprintUi'
import { groupExpensesByCategory } from '@/lib/expenseLedger'
import type { ExpenseLineItem } from '@/types'

type ExpenseChartProps = {
  items: ExpenseLineItem[]
  totalExpenses: number
  totalRevenue: number
}


export function ExpenseChart({
  items,
  totalExpenses,
  totalRevenue,
}: ExpenseChartProps) {
  const grouped = groupExpensesByCategory(items)
  const net = totalRevenue - totalExpenses

  if (grouped.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 p-6 text-sm text-stone-400">
        No expenses recorded yet. Launch or take an action to see your burn.
      </div>
    )
  }

  return (
    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1.1fr_1fr]">
      <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-background/60 p-4">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-stone-400">
          Spend by Category
        </p>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%" minHeight={180}>
            <PieChart>
              <Pie
                data={grouped}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={2}
              >
                {grouped.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? formatFunds(value) : ''
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-background/60 p-4">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-stone-400">
          Category Breakdown
        </p>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%" minHeight={180}>
            <BarChart data={grouped} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E0D4" />
              <XAxis type="number" tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
              <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? formatFunds(value) : ''
                }
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                {grouped.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-2 grid shrink-0 grid-cols-3 gap-3">
        <SummaryPill label="Revenue" value={formatFunds(totalRevenue)} tone="positive" />
        <SummaryPill label="Expenses" value={formatFunds(totalExpenses)} tone="negative" />
        <SummaryPill
          label="Net (Month)"
          value={formatFunds(net)}
          tone={net >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <div className="lg:col-span-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-stone-800">{item.label}</p>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                {item.category}
              </p>
            </div>
            <p className="text-sm font-bold text-stone-700">
              {formatFunds(item.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'positive' | 'negative'
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-bold ${
          tone === 'positive' ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
