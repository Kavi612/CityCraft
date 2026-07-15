import type { Problem } from '@/types'

export function impactLabel(problem: Problem): 'Low' | 'Medium' | 'High' {
  if (problem.difficulty >= 4 || problem.opportunitySize >= 4) return 'High'
  if (problem.difficulty >= 2 || problem.opportunitySize >= 2) return 'Medium'
  return 'Low'
}

export const PROBLEM_REWARDS = [
  'Public Trust +',
  'Investor Interest +',
  'Revenue Potential +',
] as const

/** Short legend labels + accent ring colors for map pins. */
export const CATEGORY_PIN_THEMES: Record<
  string,
  { legend: string; ring: string; glow: string }
> = {
  'Mobility & Transport': {
    legend: 'Mobility',
    ring: 'ring-orange-400',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.55)]',
  },
  Environment: {
    legend: 'Environment',
    ring: 'ring-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.55)]',
  },
  Healthcare: {
    legend: 'Healthcare',
    ring: 'ring-rose-400',
    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.55)]',
  },
  'Food & Commerce': {
    legend: 'Food & Commerce',
    ring: 'ring-amber-400',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.55)]',
  },
  'Smart Civic Services': {
    legend: 'Smart Civic',
    ring: 'ring-violet-400',
    glow: 'shadow-[0_0_20px_rgba(167,139,250,0.55)]',
  },
  Manufacturing: {
    legend: 'Manufacturing',
    ring: 'ring-sky-400',
    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.55)]',
  },
  Agriculture: {
    legend: 'Agriculture',
    ring: 'ring-lime-400',
    glow: 'shadow-[0_0_20px_rgba(163,230,53,0.55)]',
  },
  Energy: {
    legend: 'Energy',
    ring: 'ring-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.55)]',
  },
  'Small Business': {
    legend: 'Small Business',
    ring: 'ring-blue-400',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.55)]',
  },
  Logistics: {
    legend: 'Logistics',
    ring: 'ring-orange-300',
    glow: 'shadow-[0_0_20px_rgba(253,186,116,0.55)]',
  },
  'Tourism & Heritage': {
    legend: 'Tourism',
    ring: 'ring-purple-400',
    glow: 'shadow-[0_0_20px_rgba(192,132,252,0.55)]',
  },
  'Local Business': {
    legend: 'Local Business',
    ring: 'ring-rose-300',
    glow: 'shadow-[0_0_20px_rgba(253,164,175,0.55)]',
  },
  'Community Health': {
    legend: 'Community Health',
    ring: 'ring-fuchsia-400',
    glow: 'shadow-[0_0_20px_rgba(232,121,249,0.55)]',
  },
  Sustainability: {
    legend: 'Sustainability',
    ring: 'ring-green-400',
    glow: 'shadow-[0_0_20px_rgba(74,222,128,0.55)]',
  },
  Education: {
    legend: 'Education',
    ring: 'ring-indigo-400',
    glow: 'shadow-[0_0_20px_rgba(129,140,248,0.55)]',
  },
}

export function getCategoryTheme(categoryName: string) {
  return (
    CATEGORY_PIN_THEMES[categoryName] ?? {
      legend: categoryName,
      ring: 'ring-primary',
      glow: 'shadow-[0_0_20px_rgba(217,119,6,0.55)]',
    }
  )
}
