import type { Avatar, AvatarId } from '@/types'

/** Grid order on Choose Founder — matches reference layout (2×3). */
export const FOUNDER_DISPLAY_ORDER: AvatarId[] = [
  'builder',
  'analyst',
  'strategist',
  'communicator',
  'technologist',
  'hustler',
]

/**
 * avathar 1 → Analyst, 2 → Builder, 3 → Hustler,
 * 4 → Strategist, 5 → Technologist, 6 → Communicator
 */
export const avatars: Avatar[] = [
  {
    id: 'builder',
    name: 'The Builder',
    tagline: 'Ships the product first and iterates in the wild.',
    traits: 'Practical • Reliable • Hardworking',
    tags: ['Builder', 'Organized', 'Reliable'],
    imagePath: '/avathar/avathar 2.png',
  },
  {
    id: 'analyst',
    name: 'The Analyst',
    tagline: 'Decisions backed by data, models, and ruthless clarity.',
    traits: 'Analytical • Focused • Logical',
    tags: ['Analytical', 'Focused', 'Logical'],
    imagePath: '/avathar/avathar 1.png',
  },
  {
    id: 'strategist',
    name: 'The Visionary',
    tagline: 'Plays the long game across markets, policy, and timing.',
    traits: 'Visionary • Strategic • Inspiring',
    tags: ['Visionary', 'Strategic', 'Inspiring'],
    imagePath: '/avathar/avathar 4.png',
  },
  {
    id: 'communicator',
    name: 'The Designer',
    tagline: 'Turns complex ideas into stories people trust and share.',
    traits: 'Creative • Innovative • Artistic',
    tags: ['Creative', 'Innovative', 'Artistic'],
    imagePath: '/avathar/avathar 6.png',
  },
  {
    id: 'technologist',
    name: 'The Operator',
    tagline: 'Builds systems that scale when the city finally notices.',
    traits: 'Efficient • Calm • Process-Oriented',
    tags: ['Efficient', 'Calm', 'Process-Oriented'],
    imagePath: '/avathar/avathar 5.png',
  },
  {
    id: 'hustler',
    name: 'The Hustler',
    tagline: 'Opens doors, closes deals, and never waits for permission.',
    traits: 'Ambitious • Bold • Risk-Taker',
    tags: ['Ambitious', 'Bold', 'Risk-Taker'],
    imagePath: '/avathar/avathar 3.png',
  },
]

export function getAvatarsInDisplayOrder(): Avatar[] {
  const byId = new Map(avatars.map((avatar) => [avatar.id, avatar]))
  return FOUNDER_DISPLAY_ORDER.map((id) => byId.get(id)!)
}
