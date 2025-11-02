import { useState } from "react";
import { Card, Button, Tag, Divider, Spin, message, Typography } from "antd";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CarOutlined,
  ThunderboltOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

const { Title, Text } = Typography;

const ManageConfirmBill = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [chargeData] = useState(state?.chargeData || null);
  const [loading, setLoading] = useState(false);

  if (!state || !chargeData) {
    return (
      <div className="flex flex-col items-center mt-20 text-center">
        <p className="text-red-500 text-lg">❌ Không có dữ liệu phiên sạc.</p>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/driver/start")}
          className="mt-4 rounded-lg"
        >
          Quay lại chọn trạm
        </Button>
      </div>
    );
  }

  const { station, selectedCharger } = state;
  const { brand: carName } = state.selectedCar || {};
  const {
    point,
    paymentMethod: method,
    minute,
    fee,
    initBattery,
    goalBattery,
  } = chargeData;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const sessionId = chargeData?.id;
      if (!sessionId) {
        message.warning("⚠️ Không tìm thấy ID phiên sạc!");
        return;
      }

      const res = await api.post(`/charging/${sessionId}`);
      console.log("📦 Response:", res.data);
      navigate("/driver/chargingSession");
    } catch (error) {
      const errMsg =
        error.response?.data || "Không thể bắt đầu sạc! Vui lòng thử lại.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-32">
        <Spin size="large" />
        <p className="mt-2 text-gray-500">Đang tải dữ liệu phiên sạc...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-sm">
      <Title level={3} className="!text-blue-600 !font-semibold mb-2">
        Xác nhận thông tin sạc
      </Title>
      <Text type="secondary" className="block mb-6">
        Kiểm tra chi tiết trước khi bắt đầu quá trình sạc.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- Cột trái: Tóm tắt phiên sạc --- */}
        <Card
          title={
            <span className="flex items-center gap-2 text-blue-600 font-semibold">
              <CheckCircleOutlined /> Tóm tắt phiên sạc
            </span>
          }
          className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="space-y-2">
            <p>
              <CarOutlined className="text-blue-500 mr-2" />
              <strong>Xe:</strong> {carName}
            </p>
            <p>
              <ThunderboltOutlined className="text-yellow-500 mr-2" />
              <strong>Trụ sạc:</strong> {point.name} • {point.capacity}kW
            </p>
            <p>
              <strong>Trạm:</strong> {station.name}
            </p>
            <p>
              <strong>Pin ban đầu:</strong> {initBattery}% →{" "}
              <strong>Mục tiêu:</strong> {goalBattery}%
            </p>
            <p>
              <strong>Thanh toán:</strong>{" "}
              {method === "BALANCE" ? "Số dư tài khoản" : "Tiền mặt"}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
            <p>
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <strong>Thời gian ước tính:</strong>{" "}
              <span className="text-blue-600 font-semibold">{minute} phút</span>
            </p>
            <p>
              <DollarOutlined className="text-green-500 mr-2" />
              <strong>Chi phí ước tính:</strong>{" "}
              <span className="text-green-600 font-semibold">
                {fee.toLocaleString("vi-VN")}đ
              </span>
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="rounded-lg"
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleConfirm}
              className="rounded-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              Xác nhận
            </Button>
          </div>
        </Card>

        {/* --- Cột phải: Chi tiết trạm --- */}
        <Card
          title={
            <span className="flex items-center gap-2 text-blue-600 font-semibold">
              <EnvironmentOutlined /> Chi tiết trạm sạc
            </span>
          }
          className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-1">
            {station.name}
          </h3>
          <p className="text-gray-600 mb-4">{station.address}</p>

          <Divider />

          <div className="space-y-2">
            <p>
              <strong>💡 Giá điện:</strong>{" "}
              {selectedCharger.chargerCost?.cost?.toLocaleString("vi-VN") ||
                "—"}
              đ/kWh
            </p>
            <p>
              <strong>🔌 Loại trụ:</strong>{" "}
              <Tag color="blue" className="rounded-full px-3">
                {selectedCharger.chargerCost?.portType || "—"}
              </Tag>
            </p>
            <p>
              <strong>⚙️ Công suất:</strong> {point.capacity}kW
            </p>
            <Tag color="green" className="rounded-full mt-2">
              ⚡ Sạc nhanh
            </Tag>
          </div>

          <Divider />

          <p className="text-gray-500 text-sm leading-relaxed">
            ⚠️ <strong>Lưu ý:</strong>
            <br />• Thời gian & chi phí chỉ là ước tính
            <br />• Đảm bảo xe đã kết nối với trụ sạc trước khi bắt đầu
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ManageConfirmBill;
