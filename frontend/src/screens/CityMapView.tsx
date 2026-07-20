import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CityAboutCard } from '@/components/city/CityAboutCard'
import { CityMapHeader } from '@/components/city/CityMapHeader'
import { MapCategoryPin } from '@/components/city/MapCategoryPin'
import { MapFooterFilters } from '@/components/city/MapFooterFilters'
import { ProblemDetailPanel } from '@/components/city/ProblemDetailPanel'
import { FloatingBackdrop } from '@/components/founder/FloatingBackdrop'
import { CITY_SELECTION_META } from '@/data/citySelectionMeta'
import { CITY_PIN_LAYOUTS } from '@/lib/mapProblemPins'
import { useGameStore } from '@/store/gameStore'
import type { Category, Problem } from '@/types'

export default function CityMapView() {
  const navigate = useNavigate()
  const city = useGameStore((state) => state.city)
  const stats = useGameStore((state) => state.stats)
  const turn = useGameStore((state) => state.turn)
  const setProblem = useGameStore((state) => state.setProblem)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [heatMapEnabled, setHeatMapEnabled] = useState(false)

  useEffect(() => {
    if (!city) {
      navigate('/city', { replace: true })
    }
  }, [city, navigate])

  const categoryPins = useMemo(() => {
    if (!city) return []

    const layouts =
      CITY_PIN_LAYOUTS[city.id] ??
      city.categories.map((category, index) => ({
        categoryName: category.name,
        x: 15 + (index % 3) * 30,
        y: 25 + Math.floor(index / 3) * 35,
      }))

    return layouts
      .map((layout) => {
        const category = city.categories.find(
          (item) => item.name === layout.categoryName,
        )
        if (!category) return null
        return { category, x: layout.x, y: layout.y }
      })
      .filter((pin): pin is { category: Category; x: number; y: number } =>
        Boolean(pin),
      )
  }, [city])

  if (!city) {
    return null
  }

  const cityMeta = CITY_SELECTION_META[city.id]

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setSelectedProblem(null)
    setFilterCategory(category.name)
  }

  const handleFilterChange = (categoryName: string | null) => {
    setFilterCategory(categoryName)
    if (categoryName) {
      const category = city.categories.find(
        (item) => item.name === categoryName,
      )
      if (category) {
        setSelectedCategory(category)
        setSelectedProblem(null)
      }
    } else {
      setSelectedCategory(null)
      setSelectedProblem(null)
    }
  }

  const handleConfirmProblem = () => {
    if (!selectedProblem) return
    setProblem(selectedProblem)
    navigate('/quiz')
  }

  const closePanel = () => {
    setSelectedCategory(null)
    setSelectedProblem(null)
    setFilterCategory(null)
  }

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#070b14] text-white">
      <FloatingBackdrop />

      <CityMapHeader
        city={city}
        meta={cityMeta}
        cash={stats.cash}
        turn={turn || 1}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-3 pb-2 sm:px-5">
        <div className="relative min-h-[min(52dvh,420px)] w-full flex-1 overflow-hidden rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <img
            src={city.backgroundImage}
            alt={`${city.name} map`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className={`absolute inset-0 transition-colors ${
              heatMapEnabled
                ? 'bg-[radial-gradient(circle_at_30%_40%,rgba(217,119,6,0.25),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.2),transparent_40%)]'
                : 'bg-black/15'
            }`}
          />

          <CityAboutCard
            city={city}
            description={cityMeta?.motto ?? city.description}
            className="hidden sm:block"
          />

          <div className="absolute inset-0">
            {categoryPins.map((pin) => (
              <MapCategoryPin
                key={pin.category.name}
                category={pin.category}
                x={pin.x}
                y={pin.y}
                active={selectedCategory?.name === pin.category.name}
                onSelect={() => handleCategorySelect(pin.category)}
              />
            ))}
          </div>

          {selectedCategory && (
            <>
              <button
                type="button"
                aria-label="Close problem panel"
                onClick={closePanel}
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
              />
              <ProblemDetailPanel
                city={city}
                category={selectedCategory}
                problem={selectedProblem}
                onSelectProblem={setSelectedProblem}
                onBackToProblems={() => setSelectedProblem(null)}
                onConfirm={handleConfirmProblem}
                onClose={closePanel}
              />
            </>
          )}
        </div>
      </div>

      {!selectedCategory && (
        <MapFooterFilters
          categories={city.categories}
          filterCategory={filterCategory}
          heatMapEnabled={heatMapEnabled}
          onFilterChange={handleFilterChange}
          onHeatMapToggle={() => setHeatMapEnabled((value) => !value)}
        />
      )}
    </div>
  )
}
