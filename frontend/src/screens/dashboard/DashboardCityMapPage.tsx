import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CityMapPanel } from '@/components/dashboard/CityMapPanel'
import { useDashboard } from '@/context/DashboardContext'
import { DASHBOARD_PATHS, type MapFilterId } from '@/lib/dashboardUtils'

export default function DashboardCityMapPage() {
  const navigate = useNavigate()
  const { city, npcs } = useDashboard()
  const [mapFilter, setMapFilter] = useState<MapFilterId>('all')
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null)

  return (
    <div className="h-full overflow-hidden">
      <CityMapPanel
        city={city}
        npcs={npcs}
        activeFilter={mapFilter}
        selectedNpcId={selectedNpcId}
        onFilterChange={setMapFilter}
        onNpcSelect={(npcId) => {
          setSelectedNpcId(npcId)
          navigate(DASHBOARD_PATHS.reactions, { state: { highlightNpcId: npcId } })
        }}
        className="h-full min-h-0"
      />
    </div>
  )
}
