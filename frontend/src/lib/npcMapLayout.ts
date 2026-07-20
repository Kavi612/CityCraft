/** Static dashboard map pin positions for 20 NPCs (percent of panel). */
export const NPC_MAP_PINS: Record<string, { x: number; y: number }> = {
  'ananya-ravi': { x: 14, y: 20 },
  'anirudh-prakash': { x: 32, y: 16 },
  'arul-prakash': { x: 50, y: 18 },
  'divya-shankar': { x: 68, y: 16 },
  'gopinath-krishnan': { x: 86, y: 20 },
  'harish-kumar': { x: 10, y: 38 },
  'karthik-rajan': { x: 28, y: 36 },
  'keerthana-mani': { x: 46, y: 34 },
  'kavitha-anand': { x: 64, y: 36 },
  'lakshmi-devi': { x: 82, y: 38 },
  'meenakshi-devi': { x: 18, y: 54 },
  'muthuvel': { x: 36, y: 52 },
  'murugan-ravi': { x: 54, y: 50 },
  'nila-kannan': { x: 72, y: 52 },
  'perumal-selvan': { x: 90, y: 54 },
  'pradeep-arun': { x: 14, y: 70 },
  'revathi-priya': { x: 32, y: 68 },
  'selvaraj': { x: 50, y: 66 },
  'senthil-velan': { x: 68, y: 68 },
  'suresh-kumar': { x: 86, y: 70 },
}

/** Fallback grid when an NPC has no preset pin. */
export function fallbackNpcPin(index: number): { x: number; y: number } {
  const col = index % 5
  const row = Math.floor(index / 5)
  return {
    x: 12 + col * 19,
    y: 18 + row * 17,
  }
}
