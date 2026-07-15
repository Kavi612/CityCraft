type StatCardProps = {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ label, value, trend = 'neutral' }: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-secondary'
      : trend === 'down'
        ? 'text-red-600'
        : 'text-stone-400'

  return (
    <div className="rounded-card bg-surface p-6 shadow-card">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-stone-800">
        {value}
      </p>
      {trend !== 'neutral' && (
        <p className={`mt-1 text-xs font-medium ${trendColor}`}>
          {trend === 'up' ? '↑ vs last turn' : '↓ vs last turn'}
        </p>
      )}
    </div>
  )
}
