import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CitySelectionCard } from '@/components/city/CitySelectionCard'
import { FloatingBackdrop } from '@/components/founder/FloatingBackdrop'
import { cities } from '@/data'
import { useGameStore } from '@/store/gameStore'

export default function ChooseCity() {
  const navigate = useNavigate()
  const setCity = useGameStore((state) => state.setCity)
  const existingCityId = useGameStore((state) => state.city?.id)

  const [selectedCityId, setSelectedCityId] = useState<string | null>(
    existingCityId ?? null,
  )

  const handleContinue = () => {
    const city = cities.find((item) => item.id === selectedCityId)
    if (!city) return

    setCity(city)
    navigate('/city-map')
  }

  return (
    <div className="relative h-svh overflow-hidden bg-[#070b14] text-white">
      <FloatingBackdrop />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5">
        <motion.header
          className="shrink-0 text-center sm:text-left"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
              2
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
              City Selection Page
            </p>
          </div>
          <h1 className="mt-2 text-xl font-extrabold uppercase tracking-wide sm:text-3xl">
            Choose Your City
          </h1>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-white/65 sm:mx-0">
            Each city has unique challenges, opportunities, and people waiting
            for solutions.
          </p>
        </motion.header>

        <div className="min-h-0 flex-1 py-4 sm:py-5">
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {cities.map((city, index) => (
              <CitySelectionCard
                key={city.id}
                city={city}
                index={index}
                selected={selectedCityId === city.id}
                onSelect={() => setSelectedCityId(city.id)}
              />
            ))}
          </div>
        </div>

        <motion.footer
          className="shrink-0 flex justify-center pb-1 pt-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedCityId}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary via-amber-500 to-amber-400 px-8 py-3 text-sm font-bold text-white shadow-[0_8px_28px_rgba(217,119,6,0.45)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:px-10 sm:py-3.5 sm:text-base"
          >
            Select City &amp; Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.footer>
      </div>
    </div>
  )
}
