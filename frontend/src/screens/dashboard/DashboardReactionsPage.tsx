import { useLocation } from 'react-router-dom'
import { EventFeed } from '@/components/dashboard/EventFeed'
import { useDashboard } from '@/context/DashboardContext'

export default function DashboardReactionsPage() {
  const { reactions, npcs } = useDashboard()
  const location = useLocation()
  const highlightNpcId =
    (location.state as { highlightNpcId?: string } | null)?.highlightNpcId ?? null

  return (
    <div className="h-full overflow-hidden">
      <EventFeed
        reactions={reactions}
        npcs={npcs}
        highlightNpcId={highlightNpcId}
        className="h-full"
      />
    </div>
  )
}
