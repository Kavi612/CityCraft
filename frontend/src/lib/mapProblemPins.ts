import type { Category, Problem } from '@/types'

export type CategoryPinLayout = {
  categoryName: string
  x: number
  y: number
}

export const CITY_PIN_LAYOUTS: Record<string, CategoryPinLayout[]> = {
  maruthapuram: [
    { categoryName: 'Mobility & Transport', x: 22, y: 62 },
    { categoryName: 'Environment', x: 78, y: 28 },
    { categoryName: 'Healthcare', x: 72, y: 68 },
    { categoryName: 'Food & Commerce', x: 28, y: 32 },
    { categoryName: 'Smart Civic Services', x: 52, y: 48 },
  ],
  velanagar: [
    { categoryName: 'Manufacturing', x: 18, y: 38 },
    { categoryName: 'Agriculture', x: 80, y: 78 },
    { categoryName: 'Energy', x: 74, y: 20 },
    { categoryName: 'Small Business', x: 46, y: 52 },
    { categoryName: 'Logistics', x: 20, y: 76 },
  ],
  'thenmozhil-nagar': [
    { categoryName: 'Tourism & Heritage', x: 52, y: 24 },
    { categoryName: 'Local Business', x: 20, y: 54 },
    { categoryName: 'Community Health', x: 82, y: 50 },
    { categoryName: 'Sustainability', x: 30, y: 80 },
    { categoryName: 'Education', x: 78, y: 22 },
  ],
}

export type ProblemPin = {
  problem: Problem
  category: Category
  x: number
  y: number
}

/** Offset each category's 3 problems around the category anchor on the map. */
export function buildProblemPins(
  categories: Category[],
  layouts: CategoryPinLayout[],
): ProblemPin[] {
  const offsets = [
    { x: -6, y: -4 },
    { x: 5, y: 2 },
    { x: -2, y: 7 },
  ]

  const pins: ProblemPin[] = []

  for (const layout of layouts) {
    const category = categories.find((item) => item.name === layout.categoryName)
    if (!category) continue

    category.problems.forEach((problem, index) => {
      const offset = offsets[index] ?? { x: 0, y: 0 }
      pins.push({
        problem,
        category,
        x: layout.x + offset.x,
        y: layout.y + offset.y,
      })
    })
  }

  return pins
}

export function marketSizeLabel(opportunitySize: number): string {
  if (opportunitySize >= 5) return 'Very High'
  if (opportunitySize >= 4) return 'High'
  if (opportunitySize >= 2) return 'Medium'
  return 'Low'
}

export function formatInvestment(difficulty: number): string {
  const lakhs = difficulty * 12 + 8
  return `₹${lakhs}L`
}

export function formatRevenuePotential(opportunitySize: number): string {
  const lakhs = opportunitySize * 18 + 10
  return `₹${lakhs}L/yr`
}
