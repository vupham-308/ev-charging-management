import {
  ThunderboltOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { FaHeartbeat } from "react-icons/fa";
import React from "react";
import { Button, Card, message } from "antd";
import { useChargerPointsContext } from "../../contexts/ChargerPointsContext";
import { useStopSession } from "../../hooks/useStopSession";

const statusStyles = {
  AVAILABLE: {
    tagColor: "green",
    tagText: "Có sẵn",
    btnText: "Khởi động thủ công",
    btnClass: "!bg-black !text-white hover:bg-gray-800 border-none",
  },
  RESERVED: {
    tagColor: "blue",
    tagText: "Đã đặt",
    btnText: "Hủy đặt chỗ",
    btnClass: "border-gray-300",
  },
  OCCUPIED: {
    tagColor: "gold",
    tagText: "Đang sử dụng",
    btnText: "Dừng phiên sạc",
    btnClass: "border-gray-300",
  },
  OUT_OF_SERVICE: {
    tagColor: "red",
    tagText: "Ngừng hoạt động",
    btnText: "Đánh dấu trụ đã sẵn sàng",
    btnClass: "border-gray-300",
  },
};

export const MonitoringTab = () => {
  const { points, updatePointStatus, fetchChargerPoints } =
    useChargerPointsContext();
  const { stopSession, loading } = useStopSession();

  const available = points.filter((p) => p.status === "AVAILABLE").length;
  const occupied = points.filter((p) => p.status === "OCCUPIED").length;
  const reserved = points.filter((p) => p.status === "RESERVED").length;
  const outOfService = points.filter(
    (p) => p.status === "OUT_OF_SERVICE"
  ).length;

  const stats = [
    {
      label: "Có sẵn",
      value: available,
      icon: <FaHeartbeat />,
      colorClass: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Đang sử dụng",
      value: occupied,
      icon: <ThunderboltOutlined />,
      colorClass: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Đã đặt chỗ",
      value: reserved,
      icon: <ClockCircleOutlined />,
      colorClass: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Bảo trì",
      value: outOfService,
      icon: <ToolOutlined />,
      colorClass: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  const getStatusTagClasses = (tagColor) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-sm";

    const colorClasses = {
      green:
        "bg-green-100 text-green-700 shadow-green-200/60 hover:shadow-green-300/60",
      blue: "bg-blue-100 text-blue-700 shadow-blue-200/60 hover:shadow-blue-300/60",
      gold: "bg-yellow-100 text-yellow-700 shadow-yellow-200/60 hover:shadow-yellow-300/60",
      red: "bg-red-100 text-red-700 shadow-red-200/60 hover:shadow-red-300/60",
    };

    return `${baseClasses} ${colorClasses[tagColor] || colorClasses.green}`;
  };

  const handleMarkAvailable = async (point) => {
    try {
      await updatePointStatus(point.id, "AVAILABLE");
      message.success("Trụ sạc đã được đánh dấu khả dụng");
    } catch (error) {
      message.error("Cập nhật thất bại, thử lại sau");
    }
  };

  const handleStopSession = async (point) => {
    try {
      console.log("=== BẮT ĐẦU handleStopSession ===");
      console.log("Point data:", point);

      // Kiểm tra point có tồn tại không
      if (!point) {
        console.error("Point is undefined!");
        message.error("Không tìm thấy thông tin trụ sạc");
        return;
      }

      const sessionId = point?.chargingSession?.id;
      console.log("Session ID:", sessionId);

      if (!sessionId) {
        console.error("Không có sessionId");
        message.error("Không tìm thấy thông tin phiên sạc");
        return;
      }

      console.log("Bắt đầu dừng phiên sạc với ID:", sessionId);

      // Gọi API dừng phiên sạc
      await stopSession(sessionId);
      console.log("Stop session API thành công");

      // Cập nhật trạng thái sang AVAILABLE
      await updatePointStatus(point.id, "AVAILABLE");
      console.log("Update status thành công");

      message.success("Đã dừng phiên sạc thành công");
    } catch (error) {
      console.error("Lỗi trong handleStopSession:", error);
      message.error("Dừng phiên sạc thất bại: " + error.message);
    }
  };

  // Thêm useEffect để debug khi points thay đổi
  React.useEffect(() => {
    console.log("Points đã thay đổi:", points);
  }, [points]);

  return (
    <div className="px-12 py-8 bg-gray-50 min-h-[70vh]">
      <div className="w-4/5 mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-sm ${item.bg} transition-all text-center py-2 px-6`}
            >
              <div
                className={`w-10 h-10 mx-auto flex items-center justify-center ${item.colorClass}`}
              >
                {item.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {item.value}
              </h2>
              <p className="text-gray-600 text-base">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Danh sách điểm sạc */}
        <div>
          {points.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có điểm sạc nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {points.map((point) => {
                const style =
                  statusStyles[point.status] || statusStyles.AVAILABLE;

                return (
                  <Card
                    key={point.id}
                    className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    style={{ borderTop: `4px solid ${style.tagColor}` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {point?.id}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {point.capacity} kW • {point.portType}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={getStatusTagClasses(style.tagColor)}>
                          <span
                            className={`w-2.5 h-2.5 rounded-full mr-2 bg-${style.tagColor}-500`}
                          ></span>
                          {style.tagText}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          {point.price?.toLocaleString("vi-VN")} VND/kWh
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 text-center text-gray-600">
                      {point.status === "AVAILABLE" && (
                        <p>Sẵn sàng cho khách hàng tiếp theo</p>
                      )}
                      {point.status === "OUT_OF_SERVICE" && (
                        <p className="text-red-600 font-medium">Đang bảo trì</p>
                      )}
                      {point.status === "OCCUPIED" && (
                        <div className="text-left space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Người dùng:</span>
                            <span className="font-medium text-gray-800">
                              {point?.chargingSession?.car?.user?.fullName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phiên sạc:</span>
                            <span className="font-medium text-gray-800">
                              {point.chargingSession?.startTime
                                ? `${new Date(
                                    point.chargingSession.startTime
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })} - ${new Date(
                                    point.chargingSession.endTime
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}`
                                : "14:30 - 15:45"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pin:</span>
                            <span className="font-medium text-gray-800">
                              {point.chargingSession?.batteryStart &&
                              point.chargingSession?.batteryEnd
                                ? `${point.chargingSession.batteryStart}% → ${point.chargingSession.batteryEnd}%`
                                : "65% → 80%"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chi phí:</span>
                            <span className="font-medium text-gray-800">
                              {point.chargingSession?.totalCost
                                ? `${point.chargingSession.totalCost.toLocaleString(
                                    "vi-VN"
                                  )} VND`
                                : "56.250 VND"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Button cho OUT_OF_SERVICE */}
                    {point.status === "OUT_OF_SERVICE" && (
                      <Button
                        className={`w-full mt-4 font-medium ${style.btnClass}`}
                        onClick={() => handleMarkAvailable(point)}
                      >
                        {style.btnText}
                      </Button>
                    )}

                    {point.status === "OCCUPIED" && (
                      <Button
                        className={`w-full mt-4 font-medium ${style.btnClass}`}
                        onClick={() => handleStopSession(point)}
                        loading={loading}
                        danger
                        icon={<PoweroffOutlined />}
                      >
                        {loading ? "Đang dừng..." : style.btnText}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
