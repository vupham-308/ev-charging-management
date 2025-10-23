import {
  ThunderboltOutlined,
  ClockCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { FaHeartbeat } from "react-icons/fa";
import React from "react";
import { Button, Card } from "antd";

const statusStyles = {
  AVAILABLE: {
    tagColor: "green",
    tagText: "Có sẵn",
    btnType: "default",
    btnText: "Khởi động thủ công",
    btnClass: "!bg-black !text-white hover:bg-gray-800 border-none",
  },
  RESERVED: {
    tagColor: "blue",
    tagText: "Đã đặt",
    btnType: "default",
    btnText: "Hủy đặt chỗ",
    btnClass: "border-gray-300",
  },
  OCCUPIED: {
    tagColor: "gold",
    tagText: "Đang sử dụng",
    btnType: "primary",
    btnText: "Dừng phiên sạc",
    btnClass: "bg-red-500 hover:bg-red-600 border-none",
  },
  OUT_OF_SERVICE: {
    tagColor: "red",
    tagText: "Ngừng hoạt động",
    btnType: "default",
    btnText: "Đánh dấu khả dụng",
    btnClass: "border-gray-300",
  },
};

export const MonitoringTab = ({
  available,
  occupied,
  reserved,
  outOfService,
  chargerPoints = [],
}) => {
  const stats = [
    {
      label: "Có sẵn",
      value: available,
      icon: <FaHeartbeat />,
      colorClass: "text-green-500",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      label: "Đang sử dụng",
      value: occupied,
      icon: <ThunderboltOutlined />,
      colorClass: "text-yellow-500",
      bg: "bg-yellow-50 hover:bg-yellow-100",
    },
    {
      label: "Đã đặt chỗ",
      value: reserved,
      icon: <ClockCircleOutlined />,
      colorClass: "text-blue-500",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "Bảo trì",
      value: outOfService,
      icon: <ToolOutlined />,
      colorClass: "text-red-500",
      bg: "bg-red-50 hover:bg-red-100",
    },
  ];

  return (
    <div className="px-12 py-8 bg-gray-50 min-h-[70vh]">
      <div className="w-4/5 mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-sm ${item.bg} transition-all duration-200 text-center py-2 px-6 hover:shadow-md`}
            >
              <div
                className={`w-10 h-10 mx-auto flex items-center justify-center ${item.colorClass}`}
              >
                {React.isValidElement(item.icon) &&
                  React.cloneElement(item.icon, {
                    style: { fontSize: 28, lineHeight: 0 },
                  })}
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
          {chargerPoints.length === 0 ? (
            <div className="text-center py-12 text-gray-500 ">
              Không có điểm sạc nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {chargerPoints.map((point) => {
                const style =
                  statusStyles[point.status] || statusStyles.AVAILABLE;

                return (
                  <Card
                    key={point.id}
                    className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    style={{
                      borderTop: `4px solid ${
                        style.tagColor === "gold" ? "#facc15" : style.tagColor
                      }`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          CH{String(point.id).padStart(3, "0")}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {point.capacity} kW • {point.portType}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                            style.tagColor === "green"
                              ? "bg-green-100 text-green-700"
                              : style.tagColor === "gold"
                              ? "bg-yellow-100 text-yellow-700"
                              : style.tagColor === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full mr-2 ${
                              style.tagColor === "green"
                                ? "bg-green-500"
                                : style.tagColor === "gold"
                                ? "bg-yellow-500"
                                : style.tagColor === "blue"
                                ? "bg-blue-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {style.tagText}
                        </div>

                        <p className="text-gray-500 text-sm mt-1">
                          {point.price?.toLocaleString("vi-VN")} VND/kWh
                        </p>
                      </div>
                    </div>

                    {/* Hiển thị status message */}
                    <div className="mt-6 text-center text-gray-600">
                      {point.status === "AVAILABLE" && (
                        <p>Sẵn sàng cho khách hàng tiếp theo</p>
                      )}
                      {point.status === "RESERVED" && <p>Đã được đặt chỗ</p>}
                      {point.status === "OCCUPIED" && <p>Đang sạc</p>}
                      {point.status === "OUT_OF_SERVICE" && (
                        <p className="text-red-600 font-medium">Đang bảo trì</p>  
                      )}
                    </div>

                    {/* Button */}
                    <Button
                      className={`w-full mt-4 font-medium ${style.btnClass}`}
                    >
                      {style.btnText}
                    </Button>
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
