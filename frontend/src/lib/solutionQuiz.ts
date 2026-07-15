import type { SolutionAnswer, SolutionQuestion, SolutionSummary } from '@/types'

export type QuizDraftAnswer = {
  selectedOption: string
  wasCustom: boolean
}

export type QuizDraft = Record<string, QuizDraftAnswer>

/** Collapse per-question draft answers into Grok payload + history array. */
export function buildSolutionPayload(
  questions: SolutionQuestion[],
  draft: QuizDraft,
): { summary: SolutionSummary; answers: SolutionAnswer[] } {
  const answers: SolutionAnswer[] = questions.map((question) => {
    const entry = draft[question.id]
    if (!entry?.selectedOption.trim()) {
      throw new Error(`Missing answer for question "${question.id}"`)
    }
    return {
      questionId: question.id,
      selectedOption: entry.selectedOption.trim(),
      wasCustom: entry.wasCustom,
    }
  })

  const summary: SolutionSummary = {
    approach: draft.approach?.selectedOption.trim() ?? '',
    customer: draft.customer?.selectedOption.trim() ?? '',
    revenue: draft.revenue?.selectedOption.trim() ?? '',
    pricing: draft.pricing?.selectedOption.trim() ?? '',
    edge: draft.edge?.selectedOption.trim() ?? '',
  }

  return { summary, answers }
}

export function isDraftComplete(
  questions: SolutionQuestion[],
  draft: QuizDraft,
): boolean {
  return questions.every((question) => {
    const text = draft[question.id]?.selectedOption.trim()
    return Boolean(text)
  })
}

export function isCurrentAnswerValid(
  selectedPreset: string | null,
  otherActive: boolean,
  customText: string,
): boolean {
  if (otherActive) {
    return customText.trim().length > 0
  }
  return selectedPreset !== null
}

/** Hard cap for "Other" input — enforced in UI via maxLength + slice. */
export const OTHER_ANSWER_MAX_LENGTH = 100

export function clampOtherInput(value: string): string {
  return value.slice(0, OTHER_ANSWER_MAX_LENGTH)
}
