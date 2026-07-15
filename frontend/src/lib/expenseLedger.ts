import type { ActionId } from '@/lib/actionsEngine'
import type { ExpenseCategory, ExpenseLineItem } from '@/types'

export const EXPENSE_CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; color: string }
> = {
  team: { label: 'Team & Salaries', color: '#D97706' },
  product: { label: 'Product & Tech', color: '#0EA5E9' },
  operations: { label: 'Operations', color: '#10B981' },
  marketing: { label: 'Marketing', color: '#8B5CF6' },
  government: { label: 'Gov & Compliance', color: '#64748B' },
}

export function mergeExpenseBreakdown(
  current: ExpenseLineItem[],
  incoming: ExpenseLineItem[],
): ExpenseLineItem[] {
  const map = new Map<string, ExpenseLineItem>()

  for (const item of current) {
    map.set(item.label, { ...item })
  }

  for (const item of incoming) {
    const existing = map.get(item.label)
    if (existing) {
      map.set(item.label, {
        ...existing,
        amount: existing.amount + item.amount,
      })
    } else {
      map.set(item.label, { ...item })
    }
  }

  return [...map.values()].filter((item) => item.amount > 0)
}

export function groupExpensesByCategory(
  items: ExpenseLineItem[],
): { category: ExpenseCategory; label: string; amount: number; color: string }[] {
  const totals = new Map<ExpenseCategory, number>()

  for (const item of items) {
    totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount)
  }

  return [...totals.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      label: EXPENSE_CATEGORY_META[category].label,
      color: EXPENSE_CATEGORY_META[category].color,
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
}

export function expenseItemForAction(
  actionId: ActionId,
  amount: number,
): ExpenseLineItem {
  const map: Record<ActionId, ExpenseLineItem> = {
    hire: { category: 'team', label: 'Hiring — sales & support pod', amount },
    develop: { category: 'product', label: 'Product sprint — design & engineering', amount },
    adjustPricing: { category: 'operations', label: 'Pricing rollout & billing ops', amount: 0 },
    runMarketing: { category: 'marketing', label: 'Paid acquisition campaign', amount },
    lobbyGovernment: {
      category: 'government',
      label: 'Government liaison & filings',
      amount,
    },
  }

  return map[actionId]
}
