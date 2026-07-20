import {
  buildCustomProblemTestRequest,
  fetchLaunchProductVerification,
  type CustomProblemDraft,
  type LaunchProductResponse,
} from '@/lib/launchProductClient'
import type { City, NPC, SolutionSummary } from '@/types'

export type { CustomProblemDraft, LaunchProductResponse }

export function buildTestSolutionRequest(
  city: City,
  customProblem: CustomProblemDraft,
  solution: SolutionSummary,
  npcs: NPC[],
) {
  return buildCustomProblemTestRequest(city, customProblem, solution, npcs)
}

export async function fetchTestSolutionValidation(
  city: City,
  customProblem: CustomProblemDraft,
  solution: SolutionSummary,
  npcs: NPC[],
): Promise<LaunchProductResponse> {
  return fetchLaunchProductVerification(
    buildTestSolutionRequest(city, customProblem, solution, npcs),
  )
}

/** Sandbox economics use mid-tier assumptions for custom problems. */
export function createSandboxProblem(
  customProblem: CustomProblemDraft,
): {
  id: string
  name: string
  description: string
  difficulty: number
  opportunitySize: number
  questions: []
} {
  return {
    id: 'custom-test',
    name: customProblem.name.trim(),
    description: customProblem.description.trim(),
    difficulty: 3,
    opportunitySize: 3,
    questions: [],
  }
}
