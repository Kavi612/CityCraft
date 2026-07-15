import { useState } from 'react'

const PALETTE = [
  'bg-amber-600',
  'bg-teal-600',
  'bg-orange-600',
  'bg-emerald-600',
  'bg-sky-600',
  'bg-rose-600',
  'bg-violet-600',
  'bg-lime-700',
] as const

type NPCAvatarPlaceholderProps = {
  id: string
  name: string
  imagePath?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

function hashId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const sizeClasses = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-14 w-14 text-sm',
  lg: 'h-20 w-20 text-lg',
  xl: 'h-24 w-24 text-xl',
} as const

export function npcPortraitPath(npcId: string): string {
  return `/assets/npcs/${npcId}.png`
}

export function NPCAvatarPlaceholder({
  id,
  name,
  imagePath,
  size = 'md',
  className = '',
}: NPCAvatarPlaceholderProps) {
  const [failed, setFailed] = useState(false)
  const color = PALETTE[hashId(id) % PALETTE.length]
  const initials = getInitials(name)
  const src = imagePath ?? npcPortraitPath(id)

  if (!failed) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-full border border-white/15 bg-stone-100 object-cover object-top ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color} ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
      title={name}
    >
      {initials}
    </div>
  )
}
