import { useEffect, useState } from "react";
import { Card, Button, Tag, Divider, Spin, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const ManageConfirmBill = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [chargeData, setChargeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Nếu người dùng vào trực tiếp mà không có state từ trang trước
  if (!state) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <p>❌ Không có dữ liệu phiên sạc.</p>
        <Button type="primary" onClick={() => navigate("/driver/start")}>
          Quay lại chọn trạm
        </Button>
      </div>
    );
  }

  const { selectedCar, selectedCharger, targetBattery, paymentMethod } = state;

  // 🔐 Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // Gửi API khi vào trang
  useEffect(() => {
    const fetchCharge = async () => {
      try {
        const payload = {
          carId: selectedCar.id,
          pointId: selectedCharger.id,
          goalBattery: targetBattery,
          paymentMethod,
        };
        console.log("📦 Payload gửi lên:", payload);
        const response = await api.post("/charge", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChargeData(response.data);
      } catch (err) {
        console.error("❌ Lỗi khi tạo phiên sạc:", err);
        message.error("Không thể tạo phiên sạc. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchCharge();
  }, [selectedCar, selectedCharger, targetBattery, paymentMethod, token]);

  const handleConfirm = async () => {
    try {
      if (!selectedCar?.id || !selectedCharger?.id) {
        return message.warning(
          "⚠️ Vui lòng chọn xe và trụ sạc trước khi xác nhận!"
        );
      }

      const payload = {
        carId: Number(selectedCar.id),
        pointId: Number(selectedCharger.id),
        goalBattery: Number(targetBattery),
        paymentMethod: paymentMethod || "CASH",
      };

      console.log("🚗 Payload gửi đi:", payload);

      const res = await api.post("/charge", payload);
      console.log("📦 Response từ server:", res.data);
      navigate("/driver/chargingSession", {
        state: {
          id: res.data.id,
          carName: selectedCar.brand,
          currentBattery: selectedCar.initBattery,
          targetBattery,
          stationName: station.name,
          chargerName: selectedCharger.name,
          chargerCost: selectedCharger.chargerCost?.cost,
          paymentMethod,
          status: "Đang sạc",
        },
      });
    } catch (error) {
      message.error("❌ Lỗi khi bắt đầu sạc!");
      console.error("Chi tiết lỗi:", error.response?.data || error);
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

  // 🧩 Giải nén dữ liệu từ API
  const {
    point,
    carName,
    paymentMethod: method,
    minute,
    fee,
    initBattery,
    goalBattery,
  } = chargeData;

  const station = point.station;
  const chargerCost = point.chargerCost;

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
              {chargerCost.cost.toLocaleString("vi-VN")}đ/kWh
            </p>
            <p>
              <strong>🔌 Loại trụ:</strong>{" "}
              <Tag color="blue">{chargerCost.portType}</Tag>
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
