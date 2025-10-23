import { Card, Button, Tag,Select  } from "antd";

export const MaintenanceTab = ({ chargerPoints = [], isLoading }) => {
  const translateStatus = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Có sẵn";
      case "RESERVED":
        return "Đã đặt";
      case "OCCUPIED":
        return "Đang sử dụng";
      case "OUT_OF_SERVICE":
        return "Ngưng hoạt động";
      default:
        return "Không xác định";
    }
  };

  // Hàm chọn màu tag tương ứng
  const getTagStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return {
          color: "#156432ff",
          backgroundColor: "#c3f0d5ff",
          borderColor: "#a6f4c5",
        };
      case "OCCUPIED":
        return {
          color: "#b54708",
          backgroundColor: "#fef3c7",
          borderColor: "#fde68a",
        };
      case "OUT_OF_SERVICE":
        return {
          color: "#b42318",
          backgroundColor: "#fee2e2",
          borderColor: "#fecaca",
        };
      default:
        return {
          color: "#374151",
          backgroundColor: "#f3f4f6",
          borderColor: "#e5e7eb",
        };
    }
  };

  const statusOptions = [
    { value: "AVAILABLE", label: "Có sẵn" },
    { value: "OCCUPIED", label: "Đang sử dụng" },
    { value: "OUT_OF_SERVICE", label: "Ngừng hoạt động" },
  ];


  return (
    <div className="w-full bg-gray-50 min-h-screen flex justify-center py-5">
      {/* Container chính */}
      <div className="w-[80%] max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800">Quản lí trụ sạc</h2>
        <p className="text-gray-500 mt-1 mb-6">Giám sát tình trạng và thay đổi trạng thái trụ sạc</p>

        {isLoading ? (
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {chargerPoints.map((point, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all"
                styles={{ body: { padding: "16px 20px" } }} //
              >
                <div className="flex justify-between items-center">
                    {/* Thông tin trụ sạc */}
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800 text-base">
                          {point.id || "Mã trụ không xác định"}
                        </span>
                      <Tag
                        style={{
                          ...getTagStyle(point.status),
                          fontSize: "13px",
                          padding: "2px 10px",
                          borderRadius: "9999px",
                          borderWidth: "1px",
                        }}
                      >
                        {translateStatus(point.status)}
                      </Tag>
                      </div>

                      <p className="text-gray-500 text-sm mt-1">
                        {point.capacity || "?"} kW • {point.portType || "Không rõ"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                    <span className="text-sm text-gray-500">Trạng thái</span>
                    <Select
                      size="small"
                      style={{ width: 150 }}
                      value={point.status}
                      options={statusOptions}
                    />
                  </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};