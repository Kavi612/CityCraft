import { useDashboard } from '@/context/DashboardContext'

export default function DashboardSettingsPage() {
  const { founder, city, problem, founderAvatar } = useDashboard()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 pb-4">
        <h1 className="text-lg font-bold text-stone-800">Settings</h1>
        <p className="text-sm text-stone-500">Your startup profile and game context.</p>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2">
        <SettingCard label="Founder" value={founder.name} />
        <SettingCard label="Startup" value={founder.startupName} />
        <SettingCard label="Archetype" value={founderAvatar.name} />
        <SettingCard label="City" value={city.name} />
        <SettingCard label="Problem" value={problem.name} className="sm:col-span-2" />
        <SettingCard
          label="City Description"
          value={city.description}
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}

function SettingCard({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface px-4 py-4 shadow-card ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-stone-700">{value}</p>
    </div>
  )
}
