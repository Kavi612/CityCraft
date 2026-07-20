import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CityMapPanel } from '@/components/dashboard/CityMapPanel'
import { NPCMapStrip } from '@/components/dashboard/NPCMapStrip'
import { useDashboard } from '@/context/DashboardContext'
import { DASHBOARD_PATHS, npcMatchesMapFilter, type MapFilterId } from '@/lib/dashboardUtils'

export default function DashboardCityMapPage() {
  const navigate = useNavigate()
  const { city, npcs } = useDashboard()
  const [mapFilter, setMapFilter] = useState<MapFilterId>('all')
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null)

  const visibleNpcs = npcs.filter((npc) => npcMatchesMapFilter(npc, mapFilter))

  const handleNpcOpen = (npcId: string) => {
    setSelectedNpcId(npcId)
    navigate(DASHBOARD_PATHS.reactions, { state: { highlightNpcId: npcId } })
  }

  return (
    <div className="flex flex-col gap-3 lg:h-full lg:gap-0 lg:overflow-hidden">
      <CityMapPanel
        city={city}
        npcs={npcs}
        activeFilter={mapFilter}
        selectedNpcId={selectedNpcId}
        onFilterChange={setMapFilter}
        onNpcHighlight={setSelectedNpcId}
        onNpcOpen={handleNpcOpen}
        className="lg:h-full lg:min-h-0"
      />

      <NPCMapStrip
        npcs={visibleNpcs}
        selectedNpcId={selectedNpcId}
        onSelect={handleNpcOpen}
        className="lg:hidden"
      />
    </div>
  )
}
