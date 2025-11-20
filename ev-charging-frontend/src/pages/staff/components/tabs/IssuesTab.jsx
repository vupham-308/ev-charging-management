import { Card } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { ProblemCard } from "../ProblemCard.";
import { StatusBadges } from "../StatusBadges.";
import { getStatusCounts } from "../../utils/problemHelpers";
import { useProblems } from "./../../hooks/useProblems";
import { useState } from "react";

export const IssuesTab = () => {
  const { problems, isLoading } = useProblems();
  const statusCounts = getStatusCounts(problems);

  // Tab state
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="bg-gray-50 min-h-[70vh] flex justify-center py-8">
      <div className="w-[85%]">

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 p-1 rounded-full shadow-sm">
            {/* Tab: Từ khách hàng */}
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition 
              ${activeTab === "customers" 
                ? "bg-white shadow border border-gray-200" 
                : "text-gray-600 hover:bg-gray-200"}`}
              onClick={() => setActiveTab("customers")}
            >
              Từ khách hàng ({problems.length})
            </button>

            {/* Tab: Đã báo cáo */}
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition 
              ${activeTab === "reported" 
                ? "bg-white shadow border border-gray-200" 
                : "text-gray-600 hover:bg-gray-200"}`}
              onClick={() => setActiveTab("reported")}
            >
              Sự cố đã báo cáo (2)
            </button>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-2">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <WarningOutlined className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700">
                Danh sách sự cố khách hàng
              </h2>
            </div>

            {problems.length > 0 && <StatusBadges counts={statusCounts} />}
          </div>

          {/* Loading → Empty → List */}
          {isLoading ? (
            <Card className="text-center py-12 shadow-sm border-dashed">
              <p className="text-gray-500 text-lg">
                Đang tải danh sách sự cố...
              </p>
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
              {[...problems]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
