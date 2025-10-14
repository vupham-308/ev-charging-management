import { useState } from "react";
import { Button, Input, message, Card, Badge, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DashboardOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  WarningOutlined,
  BarChartOutlined,
  ToolOutlined,
  LogoutOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const tabs = [
  { key: "Giám sát", icon: <DashboardOutlined /> },
  { key: "Thanh toán", icon: <CreditCardOutlined /> },
  { key: "Sự cố KH", icon: <WarningOutlined /> },
  { key: "Báo cáo", icon: <BarChartOutlined /> },
  { key: "Bảo trì", icon: <ToolOutlined /> },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Giám sát");
  const [stationId, setStationId] = useState("");
  const [problems, setProblems] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.clear();
    toast.success("Đăng xuất thành công!");
    navigate("/", { replace: true });
  };

  const handleGetProblems = async () => {
    if (!stationId) {
      toast.warning("Vui lòng nhập Station ID trước!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://222.255.214.35:8080/api/problem/get-all-by-staff`,
        {
          params: { stationId },
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      setProblems(res.data);
      toast.success("Lấy danh sách sự cố thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách sự cố:", err);
      toast.error("Không thể tải danh sách sự cố!");
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (
      statusLower.includes("solved") ||
      statusLower.includes("hoàn thành") ||
      statusLower.includes("resolved")
    )
      return "success";
    if (
      statusLower.includes("in_progress") ||
      statusLower.includes("đang xử lý") ||
      statusLower.includes("processing")
    )
      return "processing";
    if (
      statusLower.includes("pending") ||
      statusLower.includes("chờ xử lý") ||
      statusLower.includes("chưa xử lý")
    )
      return "warning";
    if (statusLower.includes("khẩn cấp") || statusLower.includes("urgent"))
      return "error";
    return "default";
  };

  const getStatusBorderColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (
      statusLower.includes("solved") ||
      statusLower.includes("hoàn thành") ||
      statusLower.includes("resolved")
    )
      return "#52c41a";
    if (
      statusLower.includes("in-progress") ||
      statusLower.includes("đang xử lý") ||
      statusLower.includes("processing")
    )
      return "#1890ff";
    if (
      statusLower.includes("pending") ||
      statusLower.includes("chờ xử lý") ||
      statusLower.includes("chưa xử lý")
    )
      return "#faad14";
    if (statusLower.includes("khẩn cấp") || statusLower.includes("urgent"))
      return "#ff4d4f";
    return "#d9d9d9";
  };

  const getStatusBgColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (
      statusLower.includes("solved") ||
      statusLower.includes("hoàn thành") ||
      statusLower.includes("resolved")
    )
      return "#f6ffed";
    if (
      statusLower.includes("in-progress") ||
      statusLower.includes("đang xử lý") ||
      statusLower.includes("processing")
    )
      return "#e6f7ff";
    if (
      statusLower.includes("pending") ||
      statusLower.includes("chờ xử lý") ||
      statusLower.includes("chưa xử lý")
    )
      return "#fffbe6";
    if (statusLower.includes("khẩn cấp") || statusLower.includes("urgent"))
      return "#fff1f0";
    return "#ffffff";
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      inProgress: 0,
      solved: 0,
    };

    problems.forEach((problem) => {
      const statusLower = (problem.status || "").toLowerCase();
      if (
        statusLower.includes("solved") ||
        statusLower.includes("hoàn thành") ||
        statusLower.includes("resolved")
      ) {
        counts.solved++;
      } else if (
        statusLower.includes("in_progress") ||
        statusLower.includes("đang xử lý") ||
        statusLower.includes("processing")
      ) {
        counts.inProgress++;
      } else if (
        statusLower.includes("pending") ||
        statusLower.includes("chờ xử lý") ||
        statusLower.includes("chưa xử lý")
      ) {
        counts.pending++;
      }
    });

    return counts;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa cập nhật";

    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return "Không hợp lệ";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Sự cố KH":
        const statusCounts = getStatusCounts();

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

              {problems.length > 0 && (
                <div className="flex items-center gap-3">
                  {statusCounts.pending > 0 && (
                    <div className="px-4 py-2 rounded-lg bg-yellow-100 border border-yellow-300 flex items-center gap-2 shadow-sm">
                      <span className="font-semibold text-yellow-800">
                        {statusCounts.pending}
                      </span>
                      <span className="text-yellow-700 text-sm">Chờ xử lý</span>
                    </div>
                  )}
                  {statusCounts.inProgress > 0 && (
                    <div className="px-4 py-2 rounded-lg bg-blue-100 border border-blue-300 flex items-center gap-2 shadow-sm">
                      <span className="font-semibold text-blue-800">
                        {statusCounts.inProgress}
                      </span>
                      <span className="text-blue-700 text-sm">Đang xử lý</span>
                    </div>
                  )}
                  {statusCounts.solved > 0 && (
                    <div className="px-4 py-2 rounded-lg bg-green-100 border border-green-300 flex items-center gap-2 shadow-sm">
                      <span className="font-semibold text-green-800">
                        {statusCounts.solved}
                      </span>
                      <span className="text-green-700 text-sm">
                        Đã giải quyết
                      </span>
                    </div>
                  )}
                </div>
              )}
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
                  onClick={handleGetProblems}
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
                  <p className="text-gray-500 text-lg">
                    Chưa có sự cố nào được ghi nhận
                  </p>
                </Card>
              ) : (
                problems.map((item, index) => (
                  <Card
                    key={index}
                    className="shadow-md hover:shadow-xl transition-all duration-300 border-0 hover:-translate-y-1"
                    style={{
                      borderLeft: `4px solid ${getStatusBorderColor(
                        item.status
                      )}`,
                      backgroundColor: getStatusBgColor(item.status),
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ThunderboltOutlined className="text-yellow-500" />
                        <span className="text-gray-500">#{item.id}</span>
                        <span>{item.title || "Không có tiêu đề"}</span>
                      </h3>
                      <Badge
                        status={
                          getStatusColor(item.status) === "success"
                            ? "success"
                            : getStatusColor(item.status) === "processing"
                            ? "processing"
                            : getStatusColor(item.status) === "error"
                            ? "error"
                            : getStatusColor(item.status) === "warning"
                            ? "warning"
                            : "default"
                        }
                        text={
                          <Tag color={getStatusColor(item.status)}>
                            {item.status || "Chưa cập nhật"}
                          </Tag>
                        }
                      />
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-700 min-w-[120px]">
                          Mô tả:
                        </span>
                        <span>{item.description || "Không có mô tả"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 min-w-[120px]">
                          Charger Point:
                        </span>
                        <Tag color="blue">{item.chargerPoint || "N/A"}</Tag>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 min-w-[120px]">
                          Thời gian báo cáo:
                        </span>
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-md">
                          {formatDateTime(
                            item.createdAt || item.reportedAt || item.timestamp
                          )}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 min-w-[120px]">
                          Báo cáo bởi:
                        </span>
                        <Tag color="purple">
                          {item.reportedBy ||
                            item.customerName ||
                            item.userName ||
                            item.fullName ||
                            "Khách hàng"}
                        </Tag>
                      </p>

                      {item.status === "SOLVED" && (
                        <div className="mt-3 space-y-2">
                          {/* Dòng hiển thị thời gian giải quyết */}
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md text-sm font-medium">
                            <CheckCircleOutlined className="text-green-600" />
                            <span>
                              Đã giải quyết:{" "}
                              {item.solvedAt
                                ? new Date(item.solvedAt).toLocaleString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "Chưa có thời gian"}
                            </span>
                          </div>

                          {/* Hiển thị phản hồi nếu có */}
                          {item.response && (
                            <div className="ml-6 bg-gray-50 border-l-4 border-green-400 px-3 py-2 rounded-md text-gray-800 italic">
                              {item.response}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      case "Giám sát":
        return (
          <div className="text-center py-12">
            <DashboardOutlined className="text-6xl text-blue-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Theo dõi tình trạng điểm sạc (online/offline, công suất, ...)
            </p>
          </div>
        );
      case "Thanh toán":
        return (
          <div className="text-center py-12">
            <CreditCardOutlined className="text-6xl text-green-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Quản lý việc khởi động/dừng phiên sạc, ghi nhận thanh toán tại chỗ
              phí sạc xe.
            </p>
          </div>
        );
      case "Báo cáo":
        return (
          <div className="text-center py-12">
            <BarChartOutlined className="text-6xl text-purple-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Xem thống kê và báo cáo tổng hợp.
            </p>
          </div>
        );
      case "Bảo trì":
        return (
          <div className="text-center py-12">
            <ToolOutlined className="text-6xl text-orange-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Lên lịch và ghi nhận bảo trì trạm sạc.
            </p>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <ThunderboltOutlined className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Staff Dashboard
              </h1>
              <p className="text-xs text-gray-500">Quản lý trạm sạc điện</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">Trần Thị Bình</p>
              <p className="text-sm text-gray-500">Nhân viên trạm sạc</p>
            </div>
            <Button
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              size="large"
              className="shadow-md hover:shadow-lg transition-all duration-300"
              danger
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 px-4 font-medium border-b-3 transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600 bg-blue-50 shadow-inner"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              style={{
                borderBottomWidth: activeTab === tab.key ? "3px" : "0px",
              }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.key}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg text-gray-700 min-h-[500px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
