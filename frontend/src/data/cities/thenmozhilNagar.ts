import { maruthapuram } from './maruthapuram'
import type { City } from '@/types'

const CATEGORY_ICONS = [
  '/assets/category-icons/tourisum.png',
  '/assets/category-icons/local shop.png',
  '/assets/category-icons/community health.png',
  '/assets/category-icons/sustainability.png',
  '/assets/category-icons/education.png',
]

/** Thenmozhil Nagar — categories remapped; full problem sets pending Phase 4 completion. */
export const thenmozhilNagar: City = {
  id: 'thenmozhil-nagar',
  name: 'Thenmozhil Nagar',
  description:
    'A heritage-rich river city where temple towns, local commerce, and community health networks shape every startup opportunity.',
  backgroundImage: '/assets/cities/thenmozhil_nagar_bg.png',
  categoryImage: '/assets/cities/thenmozhil_cat.png',
  categories: maruthapuram.categories.map((category, index) => ({
    ...category,
    name: [
      'Tourism & Heritage',
      'Local Business',
      'Community Health',
      'Sustainability',
      'Education',
    ][index],
    icon: CATEGORY_ICONS[index],
  })),
}
