import { useEffect, useState } from "react";
import { Card, Tag, Spin, message } from "antd";
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
        return <Tag color="green">Đã giải quyết</Tag>;
      case "IN_PROGRESS":
        return <Tag color="blue">Đang xử lý</Tag>;
      case "PENDING":
        return <Tag color="orange">Đang chờ</Tag>;
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Báo cáo sự cố</h1>
      <p className="text-gray-600 mb-6">
        Báo cáo và theo dõi các sự cố gặp phải
      </p>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              title={report.station?.name || "Không xác định"}
              extra={getStatusTag(report.status)}
              className="shadow-md rounded-xl"
            >
              <h2 className="text-lg font-semibold">{report.title}</h2>
              <p className="text-gray-600 mt-1">{report.description}</p>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                {report.response && (
                  <p>
                    <b>Phản hồi:</b> {report.response}
                  </p>
                )}
                <p>
                  <b>Báo cáo lúc:</b> {formatDate(report.createdAt)}
                </p>
                {report.solvedAt && (
                  <p>
                    <b>Giải quyết lúc:</b> {formatDate(report.solvedAt)}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageIncidentReport;
