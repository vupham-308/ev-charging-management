import { useState } from "react";
import { Card, Button, Tag, Divider, Spin, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";
const ManageConfirmBill = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [chargeData] = useState(state?.chargeData || null);
  const [loading, setLoading] = useState(false);

  if (!state || !chargeData) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <p>❌ Không có dữ liệu phiên sạc.</p>
        <Button type="primary" onClick={() => navigate("/driver/start")}>
          Quay lại chọn trạm
        </Button>
      </div>
    );
  }

  const { station, selectedCharger } = state;
  const {
    point,
    carName,
    paymentMethod: method,
    minute,
    fee,
    initBattery,
    goalBattery,
  } = chargeData;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const sessionId = chargeData?.id; // ✅ lấy ID phiên sạc từ chargeData
      if (!sessionId) {
        message.warning("⚠️ Không tìm thấy ID phiên sạc!");
        return;
      }

      console.log("🔌 Bắt đầu sạc với sessionId:", sessionId);

      // ✅ Gọi API /charging/{sessionId}
      const res = await api.post(`/charging/${sessionId}`);

      console.log("📦 Response từ /charging:", res.data);

      // Nếu thành công → chuyển sang trang sạc
      navigate("/driver/chargingSession");
    } catch (error) {
      console.error("❌ Lỗi khi xác nhận bắt đầu sạc:", error);

      // ✅ BE trả về dạng text/plain nên chỉ cần lấy error.response.data
      const errMsg =
        error.response?.data || "Không thể bắt đầu sạc! Vui lòng thử lại sau.";

      // ✅ Hiện toast lỗi
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu phiên sạc...</p>
      </div>
    );
  }

  if (!chargeData) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <p>❌ Không có dữ liệu trả về từ API.</p>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2 style={{ fontWeight: 600, marginBottom: 8 }}>Xác nhận thông tin</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Kiểm tra và xác nhận để bắt đầu sạc
      </p>

      <div style={{ display: "flex", gap: 24 }}>
        {/* --- Cột trái: Tóm tắt phiên sạc --- */}
        <Card
          title={
            <>
              <CheckCircleOutlined style={{ color: "#52c41a" }} /> Tóm tắt phiên
              sạc
            </>
          }
          style={{ flex: 1, borderRadius: 12 }}
        >
          <p>
            <strong>Trạm sạc:</strong> {station.name}
          </p>
          <p>
            <strong>Trụ sạc:</strong> {point.name} • {point.capacity}kW
          </p>
          <p>
            <strong>Xe:</strong> {carName}
          </p>
          <p>
            <strong>Pin hiện tại:</strong> {initBattery}%
          </p>
          <p>
            <strong>Mục tiêu pin:</strong> {goalBattery}%
          </p>
          <p>
            <strong>Phương thức:</strong>{" "}
            {method === "BALANCE" ? "Số dư tài khoản" : "Tiền mặt"}
          </p>

          <div
            style={{
              background: "#f9fbff",
              padding: "12px 16px",
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <p>
              <strong>⏱️ Thời gian ước tính:</strong>{" "}
              <span style={{ color: "#1890ff" }}>{minute} phút</span>
            </p>
            <p>
              <strong>💰 Chi phí ước tính:</strong>{" "}
              <span style={{ color: "#1890ff" }}>
                {fee.toLocaleString("vi-VN")}đ
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
            <Button type="primary" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </Card>

        {/* --- Cột phải: Chi tiết trạm --- */}
        <Card
          title={
            <>
              <EnvironmentOutlined style={{ color: "#1890ff" }} /> Chi tiết trạm
              sạc
            </>
          }
          style={{ flex: 1, borderRadius: 12 }}
        >
          <h3 style={{ color: "#1890ff" }}>{station.name}</h3>
          <p style={{ color: "#555" }}>{station.address}</p>

          <Divider />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              <strong>💡 Giá điện:</strong>{" "}
              {selectedCharger.chargerCost?.cost?.toLocaleString("vi-VN") ||
                "—"}
              đ/kWh
            </p>
            <p>
              <strong>🔌 Loại trụ:</strong>{" "}
              <Tag color="blue">
                {selectedCharger.chargerCost?.portType || "—"}
              </Tag>
            </p>
          </div>
          <p>
            <strong>⚙️ Công suất:</strong> {point.capacity}kW
          </p>
          <Tag color="green">⚡ Sạc nhanh</Tag>

          <Divider />

          <p style={{ color: "#888", fontSize: 13 }}>
            ⚠️ <strong>Lưu ý:</strong>
            <br />• Thời gian và chi phí là ước tính
            <br />• Vui lòng đảm bảo xe đã kết nối với trụ sạc
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ManageConfirmBill;
