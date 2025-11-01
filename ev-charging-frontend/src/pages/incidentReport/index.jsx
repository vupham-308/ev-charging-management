import { useEffect, useState } from "react";
import { Card, Tag, Spin, message, Tooltip } from "antd";
import {
  FaTools,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaComments,
} from "react-icons/fa";
import api from "../../config/axios";

const ManageIncidentReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/problem/getAll");
        setReports(res.data || []);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải danh sách sự cố!");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case "SOLVED":
        return (
          <Tag
            color="green"
            className="flex items-center gap-1 font-medium px-2 py-1 rounded-md"
          >
            <FaCheckCircle /> Đã giải quyết
          </Tag>
        );
      case "IN_PROGRESS":
        return (
          <Tag
            color="blue"
            className="flex items-center gap-1 font-medium px-2 py-1 rounded-md"
          >
            <FaTools /> Đang xử lý
          </Tag>
        );
      case "PENDING":
        return (
          <Tag
            color="orange"
            className="flex items-center gap-1 font-medium px-2 py-1 rounded-md"
          >
            <FaClock /> Đang chờ
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          Báo cáo sự cố
        </h1>
        <p className="text-gray-500 mt-2">
          Theo dõi và quản lý các sự cố trong hệ thống
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center mt-20">
          <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Hiện chưa có báo cáo nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 bg-white"
              title={
                <div className="flex items-center gap-2 text-gray-800">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span className="font-semibold">
                    {report.station?.name || "Không xác định"}
                  </span>
                </div>
              }
              extra={getStatusTag(report.status)}
            >
              <div className="text-gray-800">
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-500" />
                  {report.title}
                </h2>
                <p className="text-gray-600 mb-3">{report.description}</p>

                <div className="space-y-1 text-sm text-gray-700">
                  {report.response && (
                    <Tooltip title="Phản hồi từ bộ phận kỹ thuật">
                      <p className="flex items-start gap-2">
                        <FaComments className="text-indigo-500 mt-1" />
                        <span>
                          <b>Phản hồi:</b> {report.response}
                        </span>
                      </p>
                    </Tooltip>
                  )}
                  <p className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <span>
                      <b>Báo cáo lúc:</b> {formatDate(report.createdAt)}
                    </span>
                  </p>
                  {report.solvedAt && (
                    <p className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>
                        <b>Giải quyết lúc:</b> {formatDate(report.solvedAt)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageIncidentReport;
