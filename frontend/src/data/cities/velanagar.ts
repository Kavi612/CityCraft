import { maruthapuram } from './maruthapuram'
import type { City } from '@/types'

const CATEGORY_ICONS = [
  '/assets/category-icons/manufacturing.png',
  '/assets/category-icons/agriculture.png',
  '/assets/category-icons/energy.png',
  '/assets/category-icons/small buisness.png',
  '/assets/category-icons/logistics.png',
]

/** Velanagar — categories remapped; full problem sets pending Phase 4 completion. */
export const velanagar: City = {
  id: 'velanagar',
  name: 'Velanagar',
  description:
    'A powerhouse of factories, agri-processing zones, and logistics corridors where startups scale hardware and supply-chain innovation.',
  backgroundImage: '/assets/cities/velanagar_bg.png',
  categoryImage: '/assets/cities/velanagar_cat.png',
  categories: maruthapuram.categories.map((category, index) => ({
    ...category,
    name: [
      'Manufacturing',
      'Agriculture',
      'Energy',
      'Small Business',
      'Logistics',
    ][index],
    icon: CATEGORY_ICONS[index],
  })),
}
