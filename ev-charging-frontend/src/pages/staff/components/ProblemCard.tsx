import { Badge, Tag, Card } from "antd"
import { ThunderboltOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { getStatusColor, getStatusBorderColor, getStatusBgColor } from "../utils/statusHelpers"
import { formatDateTime } from "../utils/dateHelpers"

interface Problem {
  id: string
  title: string
  description: string
  status: string
  chargerPoint: string
  reportedBy: string
  createdAt: string
  solvedAt?: string
  response?: string
}

interface ProblemCardProps {
  problem: Problem
}

export const ProblemCard = ({ problem }: ProblemCardProps) => {
  const statusColor = getStatusColor(problem.status)

  return (
    <Card
      className="shadow-md hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1"
      style={{
        borderLeft: `4px solid ${getStatusBorderColor(problem.status)}`,
        backgroundColor: getStatusBgColor(problem.status),
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ThunderboltOutlined className="text-yellow-500" />
          <span className="text-gray-500">#{problem.id}</span>
          <span>{problem.title || "Không có tiêu đề"}</span>
        </h3>
        <Badge
          status={
            statusColor === "success"
              ? "success"
              : statusColor === "processing"
                ? "processing"
                : statusColor === "error"
                  ? "error"
                  : statusColor === "warning"
                    ? "warning"
                    : "default"
          }
          text={<Tag color={statusColor}>{problem.status || "Chưa cập nhật"}</Tag>}
        />
      </div>

      <div className="space-y-2 text-gray-600">
        <p className="flex items-start gap-2">
          <span className="font-medium text-gray-700 min-w-[120px]">Mô tả:</span>
          <span>{problem.description || "Không có mô tả"}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-gray-700 min-w-[120px]">Charger Point:</span>
          <Tag color="blue">{problem.chargerPoint || "N/A"}</Tag>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-gray-700 min-w-[120px]">Thời gian báo cáo:</span>
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-md">{formatDateTime(problem.createdAt)}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium text-gray-700 min-w-[120px]">Báo cáo bởi:</span>
          <Tag color="purple">{problem.reportedBy || "Khách hàng"}</Tag>
        </p>

        {problem.status === "SOLVED" && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md text-sm font-medium">
              <CheckCircleOutlined className="text-green-600" />
              <span>
                Đã giải quyết:{" "}
                {problem.solvedAt
                  ? new Date(problem.solvedAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Chưa có thời gian"}
              </span>
            </div>

            {problem.response && (
              <div className="ml-6 bg-gray-50 border-l-4 border-green-400 px-3 py-2 rounded-md text-gray-800 italic">
                {problem.response}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
