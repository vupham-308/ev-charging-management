import { Card } from "antd"
import { WarningOutlined } from "@ant-design/icons"
import { ProblemCard } from "../ProblemCard."
import { StatusBadges } from "../StatusBadges."
import { getStatusCounts } from "../../utils/problemHelpers"

export const IssuesTab = ({ problems, isLoading }) => {
  const statusCounts = getStatusCounts(problems)

  return (
    // 👉 căn giữa toàn bộ nội dung, giống độ rộng của thanh tab
    <div className="flex justify-center bg-gray-50 py-10 min-h-[70vh]">
      <div className="w-[80%] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <WarningOutlined className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Danh sách sự cố khách hàng
            </h2>
          </div>

          {problems.length > 0 && <StatusBadges counts={statusCounts} />}
        </div>

        {/* Nội dung */}
        {isLoading ? (
          <Card className="text-center py-12 shadow-sm border-dashed">
            <p className="text-gray-500 text-lg">Đang tải danh sách sự cố...</p>
          </Card>
        ) : problems.length === 0 ? (
          <Card className="text-center py-12 shadow-sm border-dashed">
            <WarningOutlined className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Chưa có sự cố nào được ghi nhận
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
