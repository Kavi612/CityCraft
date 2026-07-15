import { motion } from 'framer-motion'
import type { Avatar } from '@/types'
import { Check } from 'lucide-react'
import { useRef } from 'react'

type FounderAvatarCardProps = {
  avatar: Avatar
  selected: boolean
  index: number
  onSelect: () => void
}

export function FounderAvatarCard({
  avatar,
  selected,
  index,
  onSelect,
}: FounderAvatarCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const node = cardRef.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / rect.height) * -8
    const rotateY = ((x - rect.width / 2) / rect.width) * 8

    node.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${selected ? 12 : 6}px) scale(${selected ? 1.02 : 1})`
  }

  const handleMouseLeave = () => {
    const node = cardRef.current
    if (!node) return
    node.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(${selected ? 8 : 0}px) scale(${selected ? 1.01 : 1})`
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-[#0c1220]/80 text-left backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
        selected
          ? 'border-primary shadow-[0_0_0_1px_#D97706,0_0_24px_rgba(217,119,6,0.45)]'
          : 'border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-white/20'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transform: selected
          ? 'perspective(900px) translateZ(8px) scale(1.01)'
          : undefined,
      }}
    >
      <div
        className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col items-center justify-center px-3 py-3 sm:px-4 sm:py-4">
        {selected && (
          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_12px_rgba(217,119,6,0.55)]">
            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
        )}

        <div className="mb-2 flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/15 bg-[#151d2e] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <img
            src={avatar.imagePath}
            alt={avatar.name}
            className="h-full w-full scale-95 object-contain object-center"
          />
        </div>

        <p className="line-clamp-1 text-center text-xs font-bold uppercase tracking-wide text-amber-400 sm:text-sm">
          {avatar.name}
        </p>
        <p className="mt-1 line-clamp-2 text-center text-[10px] leading-snug text-white/75 sm:text-xs">
          {avatar.traits}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {avatar.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] font-medium text-white/80 sm:text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  )
}
