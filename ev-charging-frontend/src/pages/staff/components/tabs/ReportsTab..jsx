import {
  BarChartOutlined,
  UserOutlined,
  ThunderboltOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useReport } from "../../hooks/useReport";

export const ReportsTab = () => {
  const { report, isLoading } = useReport();

  if (isLoading || !report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  const topStats = [
    {
      label: "Doanh thu hôm nay",
      value: `${report.revenueToday.toLocaleString("vi-VN")} VND`,
      icon: DollarOutlined,
      colorClass: "text-green-500",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      label: "Khách hàng hôm nay",
      value: report.customersToday,
      icon: UserOutlined,
      colorClass: "text-blue-500",
    },
    {
      label: "Tổng phiên sạc hôm nay",
      value: report.chargingSessionsToday,
      icon: ThunderboltOutlined,
      colorClass: "text-yellow-500",
    },
  ];

  return (
    // ✅ CHỈ SỬA DÒNG NÀY
    <div className="w-[80%] mx-auto px-10 py-6 space-y-8">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topStats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center"
            >
              <Icon className={`text-4xl ${item.colorClass}`} />
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
              <span className="text-gray-500 text-sm">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Performance Box */}
      <div className="bg-white rounded-xl shadow p-6 w-full">
        <h3 className="font-semibold text-lg">Hiệu suất trạm sạc</h3>
        <p className="text-gray-500 text-sm mb-4">
          Thống kê sử dụng và doanh thu hàng ngày
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Left */}
          <div className="space-y-3">
            <p>Giờ cao điểm</p>
            <p>Thời gian sạc trung bình</p>
            <p>Trụ sạc phổ biến nhất</p>
          </div>

          {/* Right */}
          <div className="text-right space-y-3 text-gray-700">
            <p>--:-- (chưa có dữ liệu)</p>
            <p>{report.averageChargingTime} phút</p>
            <p>{report.mostUsedChargerPoint}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
