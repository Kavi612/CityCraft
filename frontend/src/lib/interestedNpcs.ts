import { ALWAYS_RELEVANT_NPC_IDS, npcs } from '@/data/npcs'
import type { NPC } from '@/types'

function categoryMatchesNpc(npc: NPC, categoryName: string): boolean {
  const normalized = categoryName.toLowerCase()
  return npc.preferredCategories.some((pref) => {
    const p = pref.toLowerCase()
    return normalized.includes(p) || p.includes(normalized.split(' ')[0])
  })
}

/** NPCs to show on the problem detail card — trio + category-matched. */
export function getInterestedNpcs(categoryName: string, limit = 4): NPC[] {
  const always = npcs.filter((npc) =>
    (ALWAYS_RELEVANT_NPC_IDS as readonly string[]).includes(npc.id),
  )
  const matched = npcs.filter(
    (npc) =>
      !(ALWAYS_RELEVANT_NPC_IDS as readonly string[]).includes(npc.id) &&
      categoryMatchesNpc(npc, categoryName),
  )

  const combined = [...always, ...matched]
  const seen = new Set<string>()
  return combined.filter((npc) => {
    if (seen.has(npc.id)) return false
    seen.add(npc.id)
    return true
  }).slice(0, limit)
}
