/**
 * Throwaway quiz collapse verification — delete before Phase 11.
 * Run: npx tsx --tsconfig tsconfig.app.json scratch-quiz-test.ts
 */

import { maruthapuram } from './src/data/cities/maruthapuram'
import { buildSolutionPayload } from './src/lib/solutionQuiz'

function findProblem(problemId: string) {
  for (const category of maruthapuram.categories) {
    const problem = category.problems.find((item) => item.id === problemId)
    if (problem) return { city: maruthapuram.name, category: category.name, problem }
  }
  return null
}

function runQuizTest(problemId: string, choices: string[]) {
  const match = findProblem(problemId)
  if (!match) throw new Error(`Problem not found: ${problemId}`)

  const draft = Object.fromEntries(
    match.problem.questions.map((question, index) => [
      question.id,
      {
        selectedOption: choices[index] ?? question.options[0],
        wasCustom: index === 4,
      },
    ]),
  )

  const { summary, answers } = buildSolutionPayload(match.problem.questions, draft)

  console.log(`\n=== ${match.city} → ${match.category} → ${match.problem.name} ===`)
  console.log('Summary (Grok payload):')
  console.log(JSON.stringify(summary, null, 2))
  console.log('Answers array:')
  console.log(JSON.stringify(answers, null, 2))
}

// Run 1 — Maruthapuram / Mobility & Transport / Traffic Congestion
runQuizTest('traffic-congestion', [
  'AI signal timing using live camera and GPS feeds across 200 junctions',
  'Maruthapuram Municipal Corporation transport wing',
  'Annual SaaS license per junction zone to the city corporation',
  '₹18 lakh/year per 50-junction zone (government tier)',
  'Custom edge: ward-level Tamil alerts for auto unions',
])

// Run 2 — Maruthapuram / Healthcare / Digital Health Records
runQuizTest('digital-health-records', [
  'ABHA-linked unified patient record across clinics and labs',
  'Private multi-specialty clinics with 5–20 doctors',
  'Monthly SaaS subscription per clinic location',
  '₹999/month per clinic (up to 3 doctors)',
  'Offline-first OPD sync for low-bandwidth clinics',
])

console.log('\nNote: Velanagar / Thenmozhil Nagar city files are not authored yet — both runs use Maruthapuram problems from different categories.')
