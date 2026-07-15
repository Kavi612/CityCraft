import type {
  DashboardActivity,
  NPC,
  NPCReaction,
  Problem,
} from '@/types'

export type DashboardSection =
  | 'dashboard'
  | 'city-map'
  | 'reactions'
  | 'reports'
  | 'leaderboard'
  | 'notifications'
  | 'settings'

export const DASHBOARD_PATHS: Record<DashboardSection, string> = {
  dashboard: '/dashboard',
  'city-map': '/dashboard/city-map',
  reactions: '/dashboard/reactions',
  reports: '/dashboard/reports',
  leaderboard: '/dashboard/leaderboard',
  notifications: '/dashboard/notifications',
  settings: '/dashboard/settings',
}

export function sectionFromPath(pathname: string): DashboardSection {
  if (pathname.startsWith('/dashboard/city-map')) return 'city-map'
  if (pathname.startsWith('/dashboard/reactions')) return 'reactions'
  if (pathname.startsWith('/dashboard/reports')) return 'reports'
  if (pathname.startsWith('/dashboard/leaderboard')) return 'leaderboard'
  if (pathname.startsWith('/dashboard/notifications')) return 'notifications'
  if (pathname.startsWith('/dashboard/settings')) return 'settings'
  return 'dashboard'
}

export type MapFilterId =
  | 'all'
  | 'infrastructure'
  | 'cleanliness'
  | 'safety'
  | 'public-services'
  | 'environment'

export const MAP_FILTERS: {
  id: MapFilterId
  label: string
  dotClass: string
  keywords: string[]
}[] = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    dotClass: 'bg-sky-500',
    keywords: [
      'Manufacturing',
      'Mobility',
      'Transport',
      'Energy',
      'Technology',
      'Smart Civic',
      'Logistics',
    ],
  },
  {
    id: 'cleanliness',
    label: 'Cleanliness',
    dotClass: 'bg-emerald-500',
    keywords: ['Food', 'Commerce', 'Environment', 'Waste', 'Clean'],
  },
  {
    id: 'safety',
    label: 'Safety',
    dotClass: 'bg-amber-400',
    keywords: ['Government', 'Community', 'Business', 'Finance'],
  },
  {
    id: 'public-services',
    label: 'Public Services',
    dotClass: 'bg-violet-500',
    keywords: [
      'Healthcare',
      'Education',
      'Community Health',
      'Small Business',
      'Tourism',
    ],
  },
  {
    id: 'environment',
    label: 'Environment',
    dotClass: 'bg-teal-500',
    keywords: ['Environment', 'Sustainability', 'Agriculture', 'Energy'],
  },
]

export type CitizenRank = {
  npc: NPC
  points: number
  reaction?: NPCReaction
}

export function adoptionSentiment(
  score: number,
): 'positive' | 'neutral' | 'negative' {
  if (score >= 65) return 'positive'
  if (score >= 42) return 'neutral'
  return 'negative'
}

export function adoptionLabel(score: number): string {
  const sentiment = adoptionSentiment(score)
  if (sentiment === 'positive') return `${score}% Positive`
  if (sentiment === 'neutral') return `${score}% Neutral`
  return `${score}% Negative`
}

export function sentimentStyles(sentiment: DashboardActivity['sentiment']): string {
  if (sentiment === 'positive') return 'text-emerald-700 bg-emerald-50'
  if (sentiment === 'neutral') return 'text-amber-700 bg-amber-50'
  return 'text-rose-700 bg-rose-50'
}

export function formatGameDate(turn: number): string {
  const base = new Date(2025, 4, 13)
  base.setDate(base.getDate() + Math.max(0, turn - 1))
  return base.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function greetingForHour(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function npcMatchesMapFilter(
  npc: NPC,
  filterId: MapFilterId,
): boolean {
  if (filterId === 'all') return true

  const filter = MAP_FILTERS.find((item) => item.id === filterId)
  if (!filter) return true

  const haystack = [
    npc.sector,
    npc.profession,
    ...npc.preferredCategories,
  ]
    .join(' ')
    .toLowerCase()

  return filter.keywords.some((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  )
}

export function computeCitizenPoints(
  npc: NPC,
  reaction?: NPCReaction,
): number {
  const adoption = reaction?.adoptionScore ?? npc.approvalRating
  return Math.round(
    adoption * 10 + npc.relationshipScore * 2 + npc.influenceLevel * 25,
  )
}

export function getTopCitizens(
  npcs: NPC[],
  reactions: NPCReaction[],
  limit = 3,
): CitizenRank[] {
  const reactionByNpc = new Map(reactions.map((item) => [item.npcId, item]))

  return [...npcs]
    .map((npc) => ({
      npc,
      points: computeCitizenPoints(npc, reactionByNpc.get(npc.id)),
      reaction: reactionByNpc.get(npc.id),
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
}

export function buildLaunchActivities(
  reactions: NPCReaction[],
  npcs: NPC[],
  problem: Problem,
  turn: number,
): DashboardActivity[] {
  return reactions.slice(0, 3).map((reaction) => {
    const npc = npcs.find((item) => item.id === reaction.npcId)
    return {
      id: `launch-${reaction.npcId}`,
      type: 'launch',
      title: `New reaction on '${problem.name}'`,
      subtitle: `By ${npc?.name ?? 'Citizen'} • Turn ${turn}`,
      sentiment: adoptionSentiment(reaction.adoptionScore),
      turn,
    }
  })
}

export function mergeRecentActivities(
  stored: DashboardActivity[],
  launchSeed: DashboardActivity[],
): DashboardActivity[] {
  const seen = new Set(stored.map((item) => item.id))
  const seeded = launchSeed.filter((item) => !seen.has(item.id))
  return [...seeded, ...stored].sort((a, b) => b.turn - a.turn)
}

export function statTrend(
  key: string,
  value: number,
): 'up' | 'down' | 'flat' {
  if (['cash', 'revenue', 'companyValue', 'customers'].includes(key)) {
    return value > 0 ? 'up' : 'flat'
  }
  if (key === 'expenses') {
    return value > 0 ? 'down' : 'flat'
  }
  if (value >= 55) return 'up'
  if (value <= 45) return 'down'
  return 'flat'
}
