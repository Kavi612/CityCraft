import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyActions } from '@/components/dashboard/CompanyActions'
import { DashboardActionModal } from '@/components/dashboard/DashboardActionModal'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { StatCards } from '@/components/dashboard/StatCards'
import { useDashboard } from '@/context/DashboardContext'
import { DASHBOARD_PATHS } from '@/lib/dashboardUtils'
import type { ActionId } from '@/lib/actionsEngine'

type FormKind = 'reaction' | 'issue' | 'idea' | null

export default function DashboardHomePage() {
  const navigate = useNavigate()
  const {
    founder,
    problem,
    stats,
    npcs,
    activities,
    turn,
    applyStatDelta,
    upsertNpcReaction,
    pushDashboardActivity,
  } = useDashboard()

  const [formKind, setFormKind] = useState<FormKind>(null)
  const [formNpcId, setFormNpcId] = useState(npcs[0]?.id ?? '')
  const [formText, setFormText] = useState('')

  const closeForm = () => {
    setFormKind(null)
    setFormText('')
  }

  const handleActionTaken = (actionId: ActionId) => {
    const labels: Record<ActionId, string> = {
      hire: 'Hired a sales & support pod',
      develop: 'Shipped a product sprint',
      adjustPricing: 'Adjusted pricing strategy',
      runMarketing: 'Ran a marketing campaign',
      lobbyGovernment: 'Lobbied government stakeholders',
    }

    pushDashboardActivity({
      id: `action-${actionId}-${Date.now()}`,
      type: 'report',
      title: labels[actionId],
      subtitle: `By ${founder.name} · Turn ${turn}`,
      sentiment: 'neutral',
      turn,
    })
  }

  const handleSubmitReaction = () => {
    const text = formText.trim()
    if (!text || !formNpcId) return

    const npc = npcs.find((item) => item.id === formNpcId)
    upsertNpcReaction({ npcId: formNpcId, reactionText: text, adoptionScore: 78 })
    applyStatDelta({ publicTrust: 2, reputation: 1 })
    pushDashboardActivity({
      id: `reaction-${Date.now()}`,
      type: 'reaction',
      title: `New reaction on '${problem.name}'`,
      subtitle: `By ${npc?.name ?? 'Citizen'} · Turn ${turn}`,
      sentiment: 'positive',
      turn,
    })
    closeForm()
  }

  const handleSubmitIssue = () => {
    const text = formText.trim()
    if (!text) return

    applyStatDelta({ cash: -25_000, expenses: 25_000, governmentSupport: 2 })
    pushDashboardActivity({
      id: `issue-${Date.now()}`,
      type: 'issue',
      title: `Issue reported: ${text.slice(0, 48)}${text.length > 48 ? '…' : ''}`,
      subtitle: `By ${founder.name} · Turn ${turn}`,
      sentiment: 'negative',
      turn,
    })
    closeForm()
  }

  const handleSubmitIdea = () => {
    const text = formText.trim()
    if (!text) return

    applyStatDelta({ reputation: 3, investorConfidence: 2, publicTrust: 1 })
    pushDashboardActivity({
      id: `idea-${Date.now()}`,
      type: 'idea',
      title: `Idea shared: ${text.slice(0, 48)}${text.length > 48 ? '…' : ''}`,
      subtitle: `By ${founder.name} · Turn ${turn}`,
      sentiment: 'positive',
      turn,
    })
    closeForm()
  }

  return (
    <div className="flex min-h-full flex-col gap-4 overflow-y-auto pb-2 lg:h-full lg:overflow-hidden lg:pb-0">
      <StatCards stats={stats} compact />

      <div className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-2">
        <CompanyActions className="h-full" onActionTaken={handleActionTaken} />
        <RecentActivity activities={activities} className="h-full" />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(DASHBOARD_PATHS.reports)}
          className="text-xs font-semibold text-primary hover:text-primary-hover"
        >
          View expense chart →
        </button>
        <button
          type="button"
          onClick={() => {
            setFormNpcId(npcs[0]?.id ?? '')
            setFormText('')
            setFormKind('reaction')
          }}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          Add city reaction
        </button>
      </div>

      <DashboardActionModal
        kind={formKind}
        onClose={closeForm}
        npcs={npcs}
        formNpcId={formNpcId}
        formText={formText}
        onFormNpcChange={setFormNpcId}
        onFormTextChange={setFormText}
        onSubmitReaction={handleSubmitReaction}
        onSubmitIssue={handleSubmitIssue}
        onSubmitIdea={handleSubmitIdea}
      />
    </div>
  )
}
