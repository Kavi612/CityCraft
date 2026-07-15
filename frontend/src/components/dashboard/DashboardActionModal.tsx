import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import type { NPC } from '@/types'

type FormKind = 'reaction' | 'issue' | 'idea' | null

type DashboardActionModalProps = {
  kind: FormKind
  onClose: () => void
  npcs: NPC[]
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
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
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
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export function DashboardActionModal({
  kind,
  onClose,
  npcs,
  formNpcId,
  formText,
  onFormNpcChange,
  onFormTextChange,
  onSubmitReaction,
  onSubmitIssue,
  onSubmitIdea,
}: DashboardActionModalProps) {
  if (!kind) return null

  if (kind === 'reaction') {
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

  if (kind === 'issue') {
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
