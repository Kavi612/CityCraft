import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { EventFeed } from '@/components/dashboard/EventFeed'
import { NPCAvatarPlaceholder } from '@/components/NPCAvatarPlaceholder'
import { formatFunds } from '@/lib/blueprintUi'
import { getTopCitizens } from '@/lib/dashboardUtils'
import type {
  City,
  DashboardActivity,
  Founder,
  NPC,
  NPCReaction,
  PlayerStats,
  Problem,
} from '@/types'

type DashboardModalProps = {
  kind:
    | 'reactions'
    | 'leaderboard'
    | 'reports'
    | 'settings'
    | 'notifications'
    | 'reaction-form'
    | 'issue-form'
    | 'idea-form'
    | null
  onClose: () => void
  founder: Founder
  city: City
  problem: Problem
  stats: PlayerStats
  turn: number
  npcs: NPC[]
  reactions: NPCReaction[]
  activities: DashboardActivity[]
  formNpcId: string
  formText: string
  onFormNpcChange: (npcId: string) => void
  onFormTextChange: (text: string) => void
  onSubmitReaction: () => void
  onSubmitIssue: () => void
  onSubmitIdea: () => void
}

function ModalShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[90vh] w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-card ${
          wide ? 'max-w-4xl' : 'max-w-lg'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold text-stone-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-background hover:text-stone-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-3.5rem)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export function DashboardModal({
  kind,
  onClose,
  founder,
  city,
  problem,
  stats,
  turn,
  npcs,
  reactions,
  activities,
  formNpcId,
  formText,
  onFormNpcChange,
  onFormTextChange,
  onSubmitReaction,
  onSubmitIssue,
  onSubmitIdea,
}: DashboardModalProps) {
  if (!kind) return null

  if (kind === 'reactions') {
    return (
      <ModalShell title="All City Reactions" onClose={onClose} wide>
        <EventFeed reactions={reactions} npcs={npcs} />
      </ModalShell>
    )
  }

  if (kind === 'leaderboard') {
    const leaders = getTopCitizens(npcs, reactions, npcs.length)
    return (
      <ModalShell title="Citizen Leaderboard" onClose={onClose} wide>
        <div className="space-y-2">
          {leaders.map((entry, index) => (
            <div
              key={entry.npc.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 px-3 py-2.5"
            >
              <span className="w-6 text-sm font-bold text-primary">
                {index + 1}
              </span>
              <NPCAvatarPlaceholder
                id={entry.npc.id}
                name={entry.npc.name}
                imagePath={entry.npc.imagePath}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-800">{entry.npc.name}</p>
                <p className="text-xs text-stone-500">{entry.npc.profession}</p>
              </div>
              <p className="font-bold text-stone-700">{entry.points} pts</p>
            </div>
          ))}
        </div>
      </ModalShell>
    )
  }

  if (kind === 'reports') {
    return (
      <ModalShell title="City Reports" onClose={onClose} wide>
        <div className="grid gap-3 sm:grid-cols-2">
          <ReportCard label="Startup" value={founder.startupName} />
          <ReportCard label="City" value={city.name} />
          <ReportCard label="Problem Focus" value={problem.name} />
          <ReportCard label="Turn" value={`Turn ${turn}`} />
          <ReportCard label="City Cash" value={formatFunds(stats.cash)} />
          <ReportCard label="Revenue" value={formatFunds(stats.revenue)} />
          <ReportCard
            label="Customers"
            value={stats.customers.toLocaleString('en-IN')}
          />
          <ReportCard
            label="Community Cash"
            value={formatFunds(stats.companyValue)}
          />
          <ReportCard label="Reputation" value={`${stats.reputation}/100`} />
          <ReportCard label="Public Trust" value={`${stats.publicTrust}/100`} />
          <ReportCard
            label="Investor Confidence"
            value={`${stats.investorConfidence}/100`}
          />
          <ReportCard
            label="Gov. Support"
            value={`${stats.governmentSupport}/100`}
          />
        </div>
      </ModalShell>
    )
  }

  if (kind === 'settings') {
    return (
      <ModalShell title="Settings" onClose={onClose}>
        <div className="space-y-3 text-sm text-stone-600">
          <p>
            <span className="font-semibold text-stone-800">Founder:</span>{' '}
            {founder.name}
          </p>
          <p>
            <span className="font-semibold text-stone-800">Startup:</span>{' '}
            {founder.startupName}
          </p>
          <p>
            <span className="font-semibold text-stone-800">City:</span>{' '}
            {city.name}
          </p>
          <p>
            <span className="font-semibold text-stone-800">Problem:</span>{' '}
            {problem.name}
          </p>
        </div>
      </ModalShell>
    )
  }

  if (kind === 'notifications') {
    return (
      <ModalShell title="Notifications" onClose={onClose} wide>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-sm text-stone-400">No notifications yet.</p>
          ) : (
            activities.slice(0, 8).map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl border border-border bg-background/70 px-3 py-2.5"
              >
                <p className="text-sm font-semibold text-stone-800">
                  {activity.title}
                </p>
                <p className="text-xs text-stone-500">{activity.subtitle}</p>
              </div>
            ))
          )}
        </div>
      </ModalShell>
    )
  }

  if (kind === 'reaction-form') {
    return (
      <ModalShell title="Add Reaction" onClose={onClose}>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-stone-700">
            Citizen
            <select
              value={formNpcId}
              onChange={(event) => onFormNpcChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              {npcs.map((npc) => (
                <option key={npc.id} value={npc.id}>
                  {npc.name} — {npc.profession}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Your reaction
            <textarea
              value={formText}
              onChange={(event) => onFormTextChange(event.target.value)}
              maxLength={180}
              rows={4}
              placeholder="Share your feedback with the city..."
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={onSubmitReaction}
            disabled={!formText.trim()}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Post Reaction
          </button>
        </div>
      </ModalShell>
    )
  }

  if (kind === 'issue-form') {
    return (
      <ModalShell title="Report Issue" onClose={onClose}>
        <div className="space-y-3">
          <textarea
            value={formText}
            onChange={(event) => onFormTextChange(event.target.value)}
            maxLength={180}
            rows={4}
            placeholder="Describe the issue affecting your startup or ward..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={onSubmitIssue}
            disabled={!formText.trim()}
            className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Submit Report
          </button>
        </div>
      </ModalShell>
    )
  }

  if (kind === 'idea-form') {
    return (
      <ModalShell title="Suggest Idea" onClose={onClose}>
        <div className="space-y-3">
          <textarea
            value={formText}
            onChange={(event) => onFormTextChange(event.target.value)}
            maxLength={180}
            rows={4}
            placeholder="Pitch a civic improvement idea to the city..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={onSubmitIdea}
            disabled={!formText.trim()}
            className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Share Idea
          </button>
        </div>
      </ModalShell>
    )
  }

  return null
}

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-stone-800">{value}</p>
    </div>
  )
}
