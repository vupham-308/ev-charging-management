import { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, message, Progress } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { AlertTriangle } from "lucide-react";
import api from "../../config/axios";

const ManageChargingSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sessionData = location.state;
  const [chargingSession, setChargingSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (sessionData) {
          setChargingSession(sessionData);
        } else {
          const res = await api.get("/chargingsessions");
          setChargingSession(res.data);
        }
        setTime(new Date().toLocaleTimeString("vi-VN"));
      } catch (error) {
        message.error("❌ Lỗi khi tải thông tin phiên sạc!");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionData]);

  useEffect(() => {
    if (sessionData) {
      setChargingSession(sessionData);
    }
  }, [sessionData]);

  const handleStopCharging = async () => {
    try {
      const res = await api.post(`stop/${chargingSession.id}`);
      console.log("Response stop:", res.data);
      message.success("🛑 Đã dừng sạc!");
      navigate("/driver/chargingSession");
    } catch (error) {
      console.error("❌ Lỗi khi dừng sạc:", error);
      message.error("Không thể dừng sạc!");
    }
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin tip="Đang tải thông tin..." size="large" />
      </div>
    );

  if (!chargingSession)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Không có phiên sạc đang hoạt động
      </p>
    );

  const {
    carName,
    currentBattery,
    targetBattery,
    stationName,
    chargerName,
    chargerCost,
    paymentMethod,
    status,
  } = chargingSession;

  return (
    <div style={{ padding: "40px 80px" }}>
      <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 20 }}>
        Phiên sạc hiện tại
      </h2>

      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          padding: 32,
          maxWidth: 950,
          margin: "0 auto",
        }}
      >
        {/* --- Header --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <p style={{ color: "#666", marginBottom: 4 }}>Xe đang sạc</p>
            <h2 style={{ fontWeight: 600, fontSize: 22 }}>{carName}</h2>
          </div>

          <div style={{ textAlign: "right", lineHeight: "1.8em" }}>
            <div>
              <b>Trạm:</b> {stationName}
            </div>
            <div>
              <b>Trụ sạc:</b> {chargerName}
            </div>
            <div>
              <b>Giá điện:</b>{" "}
              {chargerCost ? chargerCost.toLocaleString("vi-VN") : "N/A"} đ/phút
            </div>
            <div>
              <b>Bắt đầu:</b> {time}
            </div>
            <div>
              <b>Thanh toán:</b>{" "}
              {paymentMethod === "BALANCE" ? "Số dư tài khoản" : "Tiền mặt"}
            </div>
          </div>
        </div>

        {/* --- Battery Info --- */}
        <div style={{ textAlign: "center", marginTop: 20, marginBottom: 30 }}>
          <h1 style={{ fontSize: 56, color: "#14b814", marginBottom: 4 }}>
            {currentBattery}%
          </h1>
          <p style={{ color: "#666" }}>Mức pin hiện tại</p>

          <Progress
            percent={(currentBattery / targetBattery) * 100}
            showInfo={false}
            strokeColor="#000"
            trailColor="#ddd"
            style={{ maxWidth: 600, margin: "16px auto" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 100,
              marginTop: 10,
            }}
          >
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 600 }}>
                {targetBattery}%
              </h3>
              <p style={{ color: "#666" }}>Mục tiêu</p>
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 600 }}>{status}</h3>
              <p style={{ color: "#666" }}>Trạng thái</p>
            </div>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginTop: 20,
          }}
        >
          <Button
            danger
            block
            size="large"
            onClick={handleStopCharging}
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: "#c70024",
              border: "none",
              flex: 1,
            }}
          >
            Dừng sạc
          </Button>

          <Button
            type="default"
            size="large"
            icon={<AlertTriangle size={18} color="#c96a0c" />}
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#c96a0c",
              borderColor: "#c96a0c",
              flex: 1,
            }}
          >
            Báo cáo sự cố
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ManageChargingSession;
