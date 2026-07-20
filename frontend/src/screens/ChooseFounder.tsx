import { ArrowRight, Pencil, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FounderAvatarCard } from '@/components/founder/FounderAvatarCard'
import { FloatingBackdrop } from '@/components/founder/FloatingBackdrop'
import { getAvatarsInDisplayOrder } from '@/data/avatars'
import { useGameStore } from '@/store/gameStore'
import type { AvatarId } from '@/types'

export default function ChooseFounder() {
  const navigate = useNavigate()
  const setFounder = useGameStore((state) => state.setFounder)
  const existingFounder = useGameStore((state) => state.founder)

  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId | null>(
    existingFounder?.avatarId ?? null,
  )
  const [founderName, setFounderName] = useState(existingFounder?.name ?? '')
  const [startupName, setStartupName] = useState(
    existingFounder?.startupName ?? '',
  )

  const avatars = getAvatarsInDisplayOrder()

  const canContinue =
    selectedAvatarId !== null &&
    founderName.trim().length > 0 &&
    startupName.trim().length > 0

  const handleContinue = () => {
    if (!canContinue || !selectedAvatarId) return

    setFounder({
      name: founderName.trim(),
      startupName: startupName.trim(),
      avatarId: selectedAvatarId,
    })
    navigate('/city')
  }

  return (
    <div className="relative min-h-svh overflow-y-auto bg-[#070b14] text-white">
      <FloatingBackdrop />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5">
        {/* Header */}
        <motion.header
          className="shrink-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:text-xs">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
              1
            </span>
            Avatar / Founder Selection
          </div>
          <h1 className="mt-2 text-xl font-extrabold uppercase tracking-wide sm:text-3xl">
            Choose Your Founder
          </h1>
          <p className="mt-1 text-sm text-white/65">
            Every founder has a different leadership style.
          </p>
        </motion.header>

        {/* Cards grid — fills remaining height */}
        <div
          className="py-3 perspective-[1000px] sm:py-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            {avatars.map((avatar, index) => (
              <FounderAvatarCard
                key={avatar.id}
                avatar={avatar}
                index={index}
                selected={selectedAvatarId === avatar.id}
                onSelect={() => setSelectedAvatarId(avatar.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer — always visible, no scroll */}
        <motion.footer
          className="shrink-0 grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <label className="relative block">
            <UserRound
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden="true"
            />
            <input
              type="text"
              value={founderName}
              onChange={(event) => setFounderName(event.target.value)}
              placeholder="Enter Founder Name"
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/25"
            />
          </label>

          <label className="relative block">
            <Pencil
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden="true"
            />
            <input
              type="text"
              value={startupName}
              onChange={(event) => setStartupName(event.target.value)}
              placeholder="Enter Startup Name"
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/25"
            />
          </label>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(217,119,6,0.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[150px] sm:py-3"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.footer>
      </div>
    </div>
  )
}
