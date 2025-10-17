"use client"

import { useState } from "react"
import { Card, Input, Button } from "antd"
import { SearchOutlined, WarningOutlined } from "@ant-design/icons"
import { ProblemCard } from "../ProblemCard"
import { StatusBadges } from "../StatusBadges"
import { getStatusCounts } from "../../utils/problemHelpers"

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

interface IssuesTabProps {
  problems: Problem[]
  isLoading: boolean
  onSearch: (stationId: string) => void
}

export const IssuesTab = ({ problems, isLoading, onSearch }: IssuesTabProps) => {
  const [stationId, setStationId] = useState("")
  const statusCounts = getStatusCounts(problems)

  const handleSearch = () => {
    onSearch(stationId)
  }

  return (
    <div className="space-y-6">
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

      <Card
        className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Nhập Station ID (ví dụ: 1)"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            size="large"
            className="flex-1 max-w-md"
            style={{
              borderRadius: "8px",
            }}
          />
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={isLoading}
            className="shadow-md hover:shadow-lg transition-all duration-300"
            style={{
              background: "white",
              color: "#667eea",
              borderColor: "white",
              fontWeight: "600",
            }}
          >
            Xem danh sách sự cố
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {problems.length === 0 ? (
          <Card className="text-center py-12 shadow-sm border-dashed">
            <WarningOutlined className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chưa có sự cố nào được ghi nhận</p>
          </Card>
        ) : (
          problems.map((problem) => <ProblemCard key={problem.id} problem={problem} />)
        )}
      </div>
    </div>
  )
}
