import type { Category, City, Problem } from '@/types'

export const BLUEPRINT_MIN_LENGTH = 20
export const BLUEPRINT_MAX_LENGTH = 1500

export type BlueprintSectionId =
  | 'approach'
  | 'customer'
  | 'revenue'
  | 'pricing'
  | 'edge'

export type BlueprintSection = {
  id: BlueprintSectionId
  label: string
  emoji: string
  description: string
}

export const BLUEPRINT_SECTIONS: BlueprintSection[] = [
  {
    id: 'approach',
    label: 'Solution',
    emoji: '🚗',
    description: 'Describe your startup solution for this city problem.',
  },
  {
    id: 'customer',
    label: 'Target Users',
    emoji: '👥',
    description: 'Who will use your product and who pays for the value you create?',
  },
  {
    id: 'revenue',
    label: 'Revenue Model',
    emoji: '💰',
    description: 'Explain how your startup earns money at city scale.',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    emoji: '💵',
    description: 'Define your pricing strategy for citizens, businesses, or government.',
  },
  {
    id: 'edge',
    label: 'Competitive Advantage',
    emoji: '⭐',
    description: 'What makes your approach hard to copy in this city?',
  },
]

export type BlueprintDraft = Record<BlueprintSectionId, string>

export type StartupScores = {
  innovation: number
  scalability: number
  impact: number
  execution: number
}

const BASE_CHIPS: Record<BlueprintSectionId, string[]> = {
  approach: [
    'AI Signals',
    'Smart Parking',
    'Metro Pass',
    'Car Pool',
    'Traffic Analytics',
    'Smart Sensors',
    'IoT Platform',
    'Mobile App',
    'Predictive AI',
    'Crowdsourcing',
  ],
  customer: [
    'Daily Commuters',
    'Office Parks',
    'Auto Unions',
    'Municipal Corp',
    'Fleet Operators',
    'College Students',
    'Senior Citizens',
    'SME Owners',
    'Hospital Networks',
    'Ward Councillors',
  ],
  revenue: [
    'SaaS Subscription',
    'Per-Trip Fee',
    'City License',
    'Data Insights',
    'Transaction Cut',
    'Freemium Tier',
    'Enterprise Plan',
    'Public-Private PPP',
    'Advertising',
    'Outcome Bonus',
  ],
  pricing: [
    '₹99/month',
    '₹5 per ride',
    'Tiered Plans',
    'Pay-per-use',
    'Annual Contract',
    'Ward Bundle',
    'Free Pilot',
    'Volume Discount',
    'Citizen Subsidy',
    'Revenue Share',
  ],
  edge: [
    'Local Data Moat',
    'Tamil Voice UX',
    'Ward-Level Ops',
    'Government API',
    'Offline-First',
    'Union Partnership',
    'Fast Deployment',
    'Low Capex Model',
    'Proprietary AI',
    'Community Trust',
  ],
}

const CATEGORY_CHIPS: Record<string, Partial<Record<BlueprintSectionId, string[]>>> =
  {
    'Mobility & Transport': {
      approach: [
        'Adaptive Signals',
        'Parking Sensors',
        'Last-Mile Shuttles',
        'Congestion Pricing',
      ],
      customer: ['IT Corridor Workers', 'Bus Depots', 'Traffic Police'],
    },
    Environment: {
      approach: ['Air Quality Grid', 'Flood Sensors', 'Waste Tracking'],
      customer: ['Resident Welfare', 'Schools', 'Industrial Zones'],
    },
    Healthcare: {
      approach: ['OPD Queue App', 'Ambulance Routing', 'Home Care Network'],
      customer: ['Clinics', 'PHCs', 'Caregivers'],
    },
    'Food & Commerce': {
      approach: ['Surplus Marketplace', 'Hyperlocal Delivery', 'Khata Ledger'],
      customer: ['Street Vendors', 'Cloud Kitchens', 'Wholesale Markets'],
    },
    'Smart Civic Services': {
      approach: ['e-Seva Portal', 'Complaint Heatmap', 'CCTV Analytics'],
      customer: ['Ward Offices', 'Citizens', 'Contractors'],
    },
  }

const EXTRA_CHIP_POOL: Record<BlueprintSectionId, string[]> = {
  approach: [
    'Digital Twin',
    'Edge Computing',
    'Open Data API',
    'Drone Monitoring',
    'Blockchain Ledger',
    'Voice Assistant',
    'GIS Mapping',
    '5G Network',
    'Solar Integration',
    'Smart Kiosks',
    'Route Optimization',
    'Demand Forecasting',
  ],
  customer: [
    'NGO Partners',
    'Retail Chains',
    'Housing Societies',
    'Tour Operators',
    'Market Associations',
    'Tech Parks',
    'Women Self-Help Groups',
    'Delivery Partners',
    'Public Schools',
    'Utility Boards',
  ],
  revenue: [
    'API Access Fee',
    'White-Label SaaS',
    'Maintenance Contract',
    'Carbon Credits',
    'Consulting Retainer',
    'Hardware Lease',
    'Analytics Upsell',
    'Grant Funding',
    'CSR Sponsorship',
    'Licensing Fee',
  ],
  pricing: [
    'Dynamic Pricing',
    'Student Discount',
    'Micro-Subscription',
    'Per-Ward License',
    'Success Fee',
    'Hybrid Model',
    'Early-Bird Rate',
    'Institutional Plan',
    'Usage Cap',
    'Pilot Pricing',
  ],
  edge: [
    'Hyperlocal Network',
    'Regulatory Alignment',
    'Pilot Track Record',
    'Multi-Language UI',
    'Field Agent Network',
    'Real-Time Dashboard',
    'Vendor Ecosystem',
    'Citizen Co-Design',
    'Low Latency Stack',
    'Integrated Payments',
  ],
}

export function findProblemCategory(
  city: City,
  problem: Problem,
): Category | undefined {
  return city.categories.find((category) =>
    category.problems.some((item) => item.id === problem.id),
  )
}

export function getDefaultChips(
  sectionId: BlueprintSectionId,
  categoryName: string,
): string[] {
  const categorySpecific = CATEGORY_CHIPS[categoryName]?.[sectionId] ?? []
  const base = BASE_CHIPS[sectionId]
  const merged = [...categorySpecific, ...base]
  return [...new Set(merged)].slice(0, 10)
}

export function generateMoreChips(
  sectionId: BlueprintSectionId,
  visible: string[],
): string[] {
  const pool = EXTRA_CHIP_POOL[sectionId].filter((chip) => !visible.includes(chip))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 6)
}

type ExpandContext = {
  chip: string
  sectionId: BlueprintSectionId
  problem: Problem
  city: City
  category?: Category
}

export function expandChipToIdea({
  chip,
  sectionId,
  problem,
  city,
  category,
}: ExpandContext): string {
  const cityName = city.name
  const problemName = problem.name
  const categoryName = category?.name ?? 'urban services'

  const templates: Record<BlueprintSectionId, (c: string) => string> = {
    approach: (label) =>
      `Our startup develops a ${label.toLowerCase()} platform tailored for ${cityName} to address ${problemName.toLowerCase()}. We combine on-ground ${categoryName.toLowerCase()} workflows with real-time data so the city can pilot quickly, measure impact ward-by-ward, and scale what works without rebuilding infrastructure from scratch.`,
    customer: (label) =>
      `We focus first on ${label.toLowerCase()} because they feel ${problemName.toLowerCase()} every day in ${cityName}. Our go-to-market starts with a narrow beachhead segment, proves retention and willingness to pay, then expands to adjacent user groups through referrals and municipal partnerships.`,
    revenue: (label) =>
      `Revenue comes primarily through a ${label.toLowerCase()} model aligned with measurable outcomes for ${problemName.toLowerCase()}. We price for adoption in year one, then layer upsells as usage grows across ${cityName}'s wards and anchor institutions.`,
    pricing: (label) =>
      `Our pricing strategy uses ${label.toLowerCase()} so early adopters in ${cityName} can start without heavy upfront cost. As value is proven on ${problemName.toLowerCase()}, we introduce premium tiers for analytics, integrations, and multi-location rollouts.`,
    edge: (label) =>
      `Our defensible edge is ${label.toLowerCase()} built specifically for ${cityName}'s ${categoryName.toLowerCase()} context. Competitors can copy features, but not our local operator network, Tamil-first UX, and deployment playbook co-designed with city stakeholders.`,
  }

  const custom: Record<string, string> = {
    'AI Signals':
      'Our startup develops an AI-powered adaptive traffic signal system that analyses real-time traffic density using cameras and IoT sensors to dynamically optimize signal timings, reducing congestion and travel time across the city.',
    'Smart Parking':
      'Our platform helps drivers locate nearby parking spaces in real time using GPS and sensor-enabled parking lots while allowing municipalities to optimize parking utilization and pricing across high-demand zones.',
    'Adaptive Signals':
      'We deploy computer-vision and loop-sensor fusion at junctions so signal cycles respond to live queue lengths, prioritizing buses, ambulances, and peak-direction flows without manual police intervention.',
  }

  if (custom[chip]) return custom[chip]
  return templates[sectionId](chip)
}

export function createEmptyDraft(): BlueprintDraft {
  return {
    approach: '',
    customer: '',
    revenue: '',
    pricing: '',
    edge: '',
  }
}

export function isSectionComplete(text: string): boolean {
  return text.trim().length >= BLUEPRINT_MIN_LENGTH
}

export function isBlueprintComplete(draft: BlueprintDraft): boolean {
  return BLUEPRINT_SECTIONS.every((section) =>
    isSectionComplete(draft[section.id]),
  )
}

export function computeStartupScores(draft: BlueprintDraft): StartupScores {
  const combined = Object.values(draft).join(' ').toLowerCase()
  const wordCount = combined.split(/\s+/).filter(Boolean).length

  const score = (keywords: string[], base: number) => {
    const hits = keywords.filter((keyword) => combined.includes(keyword)).length
    return Math.min(95, base + hits * 6 + Math.min(wordCount / 8, 18))
  }

  return {
    innovation: score(
      ['ai', 'iot', 'predict', 'sensor', 'platform', 'automation', 'digital'],
      42,
    ),
    scalability: score(
      ['saas', 'subscription', 'api', 'cloud', 'network', 'license', 'platform'],
      40,
    ),
    impact: score(
      ['citizen', 'city', 'public', 'ward', 'community', 'trust', 'outcome'],
      44,
    ),
    execution: score(
      ['pilot', 'deploy', 'partnership', 'roadmap', 'team', 'metric', 'month'],
      38,
    ),
  }
}

export function blueprintDraftStorageKey(problemId: string): string {
  return `city-craft-blueprint-${problemId}`
}

export function loadBlueprintDraft(problemId: string): BlueprintDraft | null {
  try {
    const raw = localStorage.getItem(blueprintDraftStorageKey(problemId))
    if (!raw) return null
    return JSON.parse(raw) as BlueprintDraft
  } catch {
    return null
  }
}

export function saveBlueprintDraft(
  problemId: string,
  draft: BlueprintDraft,
): void {
  localStorage.setItem(
    blueprintDraftStorageKey(problemId),
    JSON.stringify(draft),
  )
}

export function draftToQuizDraft(draft: BlueprintDraft) {
  return {
    approach: { selectedOption: draft.approach.trim(), wasCustom: true },
    customer: { selectedOption: draft.customer.trim(), wasCustom: true },
    revenue: { selectedOption: draft.revenue.trim(), wasCustom: true },
    pricing: { selectedOption: draft.pricing.trim(), wasCustom: true },
    edge: { selectedOption: draft.edge.trim(), wasCustom: true },
  }
}

export function formatFunds(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`
}

export function expectedUsersLabel(opportunitySize: number): string {
  if (opportunitySize >= 5) return '48 Lakh Citizens'
  if (opportunitySize >= 4) return '32 Lakh Citizens'
  if (opportunitySize >= 3) return '18 Lakh Citizens'
  return '8 Lakh Citizens'
}

export function buildTimeLabel(difficulty: number): string {
  if (difficulty >= 4) return '8 Months'
  if (difficulty >= 3) return '6 Months'
  return '4 Months'
}
