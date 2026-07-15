/**
 * Throwaway store sanity checks — delete before Phase 7.
 * Run: npx tsx --tsconfig tsconfig.app.json scratch-store-test.ts
 */

import { createStore } from 'zustand'
import {
  computeCompanyValue,
  createInitialState,
  mergeStatDelta,
  STARTING_CASH,
} from './src/store/gameStore'
import type { Founder, GameState, PlayerStats } from './src/types'

type TestStore = GameState & {
  setFounder: (founder: Founder) => void
  applyStatDelta: (delta: Partial<PlayerStats>) => void
  investCapital: (amount: number) => void
  resetGame: () => void
}

function createTestStore() {
  return createStore<TestStore>((set, get) => ({
    ...createInitialState(),
    setFounder: (founder) => set({ founder }),
    applyStatDelta: (delta) =>
      set((state) => ({ stats: mergeStatDelta(state.stats, delta) })),
    investCapital: (amount) => {
      if (amount <= 0) return
      const { stats } = get()
      if (amount > stats.cash) return
      get().applyStatDelta({ cash: -amount, investedCapital: amount })
    },
    resetGame: () => set(createInitialState()),
  }))
}

function snapshot(label: string, state: GameState) {
  console.log(`\n=== ${label} ===`)
  console.log(
    JSON.stringify(
      {
        founder: state.founder,
        turn: state.turn,
        stats: state.stats,
        npcCount: state.npcs.length,
        eventHistory: state.eventHistory,
      },
      null,
      2,
    ),
  )
}

const store = createTestStore()

snapshot('1. Initial state', store.getState())

store.getState().setFounder({
  name: 'Priya Raman',
  startupName: 'MetroPulse',
  avatarId: 'strategist',
})
snapshot('2. After setFounder', store.getState())

store.getState().applyStatDelta({
  cash: -150_000,
  expenses: 150_000,
  customers: 42,
  reputation: 6,
  investorConfidence: -2,
})
snapshot('3. After applyStatDelta (marketing)', store.getState())

store.getState().investCapital(1_000_000)
snapshot('4. After investCapital (₹10L)', store.getState())

console.log('\n--- Formula check ---')
console.log(
  'computeCompanyValue manual:',
  computeCompanyValue(store.getState().stats),
)
console.log('store companyValue:', store.getState().stats.companyValue)

store.getState().resetGame()
snapshot('5. After resetGame', store.getState())

console.log('\nStarting cash constant:', STARTING_CASH)
