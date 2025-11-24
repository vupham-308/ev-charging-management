import React from "react";
import { CheckCircleOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";

export const ReportedProblemCard = ({ problem }) => {
  const reportedBy = problem.reportedBy || problem.user?.role || "staff";
  const isStaffReport = reportedBy === "staff" || reportedBy === "employee";
  const isSolved = problem.status === "SOLVED";

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* Header với ID và trạng thái */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-500">#{problem.id}</span>
          {isSolved ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              <CheckCircleOutlined className="text-xs" />
              Đã gửi Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              Đã gửi Admin
            </span>
          )}
          
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(problem.createdAt)}
        </span>
      </div>

      {/* Tiêu đề và địa điểm */}
      <h3 className="font-semibold text-gray-900 mb-2">
        {problem.title || "Không có tiêu đề"}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3">
        {problem?.station?.name || "N/A"} - {problem?.station.address || "Chưa có địa chỉ"}
      </p>

      {/* Mô tả sự cố */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-gray-700 text-sm leading-relaxed">
          {problem.description || "Không có mô tả"}
        </p>
      </div>


      {/* Hiển thị phản hồi từ admin nếu có */}
      {problem.response && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-2">
            <CheckCircleOutlined />
            <span>Phản hồi từ Admin</span>
          </div>
          <p className="text-blue-700 text-sm">
            {problem.response}
          </p>
          {problem.solvedAt && (
            <p className="text-xs text-blue-600 mt-2">
              Giải quyết lúc: {formatDate(problem.solvedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};