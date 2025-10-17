import type { ProblemCounts } from "../utils/problemHelpers"

interface StatusBadgesProps {
  counts: ProblemCounts
}

export const StatusBadges = ({ counts }: StatusBadgesProps) => {
  return (
    <div className="flex items-center gap-3">
      {counts.pending > 0 && (
        <div className="px-4 py-2 rounded-lg bg-yellow-100 border border-yellow-300 flex items-center gap-2 shadow-sm">
          <span className="font-semibold text-yellow-800">{counts.pending}</span>
          <span className="text-yellow-700 text-sm">Chờ xử lý</span>
        </div>
      )}
      {counts.inProgress > 0 && (
        <div className="px-4 py-2 rounded-lg bg-blue-100 border border-blue-300 flex items-center gap-2 shadow-sm">
          <span className="font-semibold text-blue-800">{counts.inProgress}</span>
          <span className="text-blue-700 text-sm">Đang xử lý</span>
        </div>
      )}
      {counts.solved > 0 && (
        <div className="px-4 py-2 rounded-lg bg-green-100 border border-green-300 flex items-center gap-2 shadow-sm">
          <span className="font-semibold text-green-800">{counts.solved}</span>
          <span className="text-green-700 text-sm">Đã giải quyết</span>
        </div>
      )}
    </div>
  )
}
