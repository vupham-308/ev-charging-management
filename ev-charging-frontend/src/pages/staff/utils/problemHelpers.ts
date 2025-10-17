import { STATUS_KEYWORDS } from "../constants/status"

export interface ProblemCounts {
  pending: number
  inProgress: number
  solved: number
}

export const getStatusCounts = (problems: any[]): ProblemCounts => {
  const counts: ProblemCounts = {
    pending: 0,
    inProgress: 0,
    solved: 0,
  }

  problems.forEach((problem) => {
    const statusLower = (problem.status || "").toLowerCase()

    if (STATUS_KEYWORDS.solved.some((keyword) => statusLower.includes(keyword))) {
      counts.solved++
    } else if (STATUS_KEYWORDS.inProgress.some((keyword) => statusLower.includes(keyword))) {
      counts.inProgress++
    } else if (STATUS_KEYWORDS.pending.some((keyword) => statusLower.includes(keyword))) {
      counts.pending++
    }
  })

  return counts
}
