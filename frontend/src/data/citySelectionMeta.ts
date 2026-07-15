export type CityAccent = 'orange' | 'blue' | 'purple'

export type FocusAreaTag = {
  label: string
  accent: 'orange' | 'green' | 'blue' | 'yellow' | 'purple' | 'red'
}

export type CitySelectionMeta = {
  id: string
  motto: string
  population: string
  growth: string
  innovation: string
  accent: CityAccent
  focusAreas: FocusAreaTag[]
}

export const CITY_SELECTION_META: Record<string, CitySelectionMeta> = {
  maruthapuram: {
    id: 'maruthapuram',
    motto: 'The Modern Metropolitan City',
    population: '48 Lakhs',
    growth: '12.4%',
    innovation: 'High',
    accent: 'orange',
    focusAreas: [
      { label: 'Mobility', accent: 'orange' },
      { label: 'Environment', accent: 'green' },
      { label: 'Healthcare', accent: 'green' },
      { label: 'Food & Commerce', accent: 'orange' },
      { label: 'Smart Civic', accent: 'blue' },
    ],
  },
  velanagar: {
    id: 'velanagar',
    motto: 'The Industrial & Innovation City',
    population: '32 Lakhs',
    growth: '9.8%',
    innovation: 'Very High',
    accent: 'blue',
    focusAreas: [
      { label: 'Manufacturing', accent: 'blue' },
      { label: 'Agriculture', accent: 'green' },
      { label: 'Energy', accent: 'yellow' },
      { label: 'Small Business', accent: 'blue' },
      { label: 'Logistics', accent: 'orange' },
    ],
  },
  'thenmozhil-nagar': {
    id: 'thenmozhil-nagar',
    motto: 'The Cultural & Community City',
    population: '28 Lakhs',
    growth: '8.6%',
    innovation: 'High',
    accent: 'purple',
    focusAreas: [
      { label: 'Tourism & Heritage', accent: 'purple' },
      { label: 'Local Business', accent: 'red' },
      { label: 'Community Health', accent: 'purple' },
      { label: 'Sustainability', accent: 'green' },
      { label: 'Education', accent: 'blue' },
    ],
  },
}

export const FOCUS_TAG_STYLES: Record<
  FocusAreaTag['accent'],
  string
> = {
  orange: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  green: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  blue: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  yellow: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  purple: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  red: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
}

export const CITY_ACCENT_STYLES: Record<
  CityAccent,
  { border: string; glow: string; stat: string }
> = {
  orange: {
    border: 'border-primary',
    glow: 'shadow-[0_0_0_1px_#D97706,0_0_32px_rgba(217,119,6,0.45)]',
    stat: 'text-primary',
  },
  blue: {
    border: 'border-sky-400',
    glow: 'shadow-[0_0_0_1px_#38bdf8,0_0_32px_rgba(56,189,248,0.4)]',
    stat: 'text-sky-400',
  },
  purple: {
    border: 'border-violet-400',
    glow: 'shadow-[0_0_0_1px_#a78bfa,0_0_32px_rgba(167,139,250,0.4)]',
    stat: 'text-violet-400',
  },
}
