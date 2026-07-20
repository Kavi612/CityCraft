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

const CHART_HEIGHT_MOBILE = 220

export function ExpenseChart({
  items,
  totalExpenses,
  totalRevenue,
}: ExpenseChartProps) {
  const grouped = groupExpensesByCategory(items)
  const net = totalRevenue - totalExpenses

  if (grouped.length === 0) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 p-6 text-center text-sm text-stone-400">
        No expenses recorded yet. Launch or take an action to see your burn.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-2 lg:grid-rows-[auto_auto_1fr] lg:gap-4">
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
          Spend by Category
        </p>
        <div
          className="w-full lg:min-h-0 lg:flex-1"
          style={{ height: CHART_HEIGHT_MOBILE }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={grouped}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="42%"
                outerRadius="72%"
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

      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
          Category Breakdown
        </p>
        <div
          className="w-full lg:min-h-0 lg:flex-1"
          style={{ height: Math.max(CHART_HEIGHT_MOBILE, grouped.length * 36 + 40) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={grouped}
              layout="vertical"
              margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E0D4" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={88}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? formatFunds(value) : ''
                }
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={18}>
                {grouped.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:col-span-2">
        <SummaryPill label="Revenue" value={formatFunds(totalRevenue)} tone="positive" />
        <SummaryPill label="Expenses" value={formatFunds(totalExpenses)} tone="negative" />
        <SummaryPill
          label="Net (Month)"
          value={formatFunds(net)}
          tone={net >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <div className="space-y-2 lg:col-span-2 lg:max-h-[min(16rem,30vh)] lg:overflow-y-auto lg:pr-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-stone-800">{item.label}</p>
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                {item.category}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold text-stone-700">
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
        className={`mt-0.5 text-sm font-bold sm:text-base ${
          tone === 'positive' ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
