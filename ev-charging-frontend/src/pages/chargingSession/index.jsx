import { useEffect, useState } from "react";
import { Card, Button, Spin, Progress, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../config/axios";
import {
  WarningOutlined,
  ThunderboltOutlined,
  CarOutlined,
} from "@ant-design/icons";

const ManageChargingSession = () => {
  const navigate = useNavigate();
  const [chargingSessions, setChargingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.defaultFilter || "ALL");
  useEffect(() => {
    let intervalId;

    const fetchSession = async () => {
      try {
        const res = await api.get("/chargingsessions");
        setChargingSessions(res.data || []);
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi tải phiên sạc:", error);
        setLoading(false);
      }
    };

    fetchSession();
    intervalId = setInterval(fetchSession, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStopCharging = async (id) => {
    try {
      await api.post(`/stop/${id}`);
      message.success("🛑 Đã dừng sạc!");
      setChargingSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("❌ Lỗi khi dừng sạc:", error);
      message.error("Không thể dừng sạc!");
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Spin tip="Đang tải thông tin..." size="large" />
      </div>
    );

  const filteredSessions = chargingSessions
    .filter((session) => {
      if (filter === "CHARGING") return session.status !== "COMPLETED";
      if (filter === "COMPLETED") return session.status === "COMPLETED";
      return true;
    })
    .sort((a, b) => {
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
      return 0;
    });

  return (
    <div
      style={{
        padding: "50px 120px",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: 24,
          color: "#00021f",
          marginBottom: 30,
        }}
      >
        Phiên sạc của tôi
      </h2>

      {/* NÚT LỌC */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <Button
          type={filter === "CHARGING" ? "primary" : "default"}
          onClick={() => setFilter("CHARGING")}
        >
          Đang sạc
        </Button>
        <Button
          type={filter === "COMPLETED" ? "primary" : "default"}
          onClick={() => setFilter("COMPLETED")}
        >
          Đã sạc xong
        </Button>
      </div>

      {/* Trường hợp không có phiên sạc */}
      {filteredSessions.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: 50,
            color: "#000",
            fontSize: 22,
          }}
        >
          Hiện tại không có phiên sạc nào.
        </p>
      )}

      {filteredSessions.map((session) => (
        <Card
          key={session.id}
          style={{
            borderRadius: 16,
            border: "1px solid #eee",
            padding: 28,
            maxWidth: 1000,
            margin: "0 auto 40px",
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f8f9fa",
              borderRadius: 12,
              padding: "20px 28px",
              marginBottom: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CarOutlined style={{ fontSize: 28 }} />
              <div>
                <p style={{ color: "#64748b", marginBottom: 4 }}>
                  {session.status === "COMPLETED"
                    ? "Xe đã sạc xong"
                    : "Xe đang sạc"}
                </p>
                <h2 style={{ fontWeight: 700, fontSize: 20 }}>
                  {session.car.licensePlate}
                </h2>
              </div>
            </div>
          </div>

          {/* Charging Status */}
          {session.status === "COMPLETED" ? (
            <div style={{ padding: "0 30px 30px" }}>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#0ea5e9",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Phiên sạc đã hoàn thành
              </h1>
              <div
                style={{
                  borderTop: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                  padding: "20px 10px",
                  fontSize: 16,
                  color: "#000",
                  lineHeight: "1.9em",
                }}
              >
                <div>
                  <b>Mức pin:</b> {session.initBattery}% → {session.goalBattery}
                  %
                </div>
                <div>
                  <b>Năng lượng đã nạp:</b> {session.energyDelivered.toFixed(2)}{" "}
                  kWh
                </div>
                <div>
                  <b>Thời gian sạc:</b> {session.duration} phút
                </div>
                <div>
                  <b>Bắt đầu:</b>{" "}
                  {new Date(session.startDate).toLocaleString("vi-VN")}
                </div>
                <div>
                  <b>Kết thúc:</b>{" "}
                  {new Date(session.endDate).toLocaleString("vi-VN")}
                </div>
                <div>
                  <b>Chi phí:</b> {session.fee.toLocaleString("vi-VN")} đ
                </div>
              </div>
              <div style={{ marginTop: 20, color: "#000", fontSize: 16 }}>
                <div>
                  <b>Trạm:</b> {session.point.station.name} –{" "}
                  {session.point.name} – {session.point.chargerCost.power} kW
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 40,
                marginBottom: 40,
              }}
            >
              <div style={{ flex: 1, textAlign: "center" }}>
                <h1
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: "#16a34a",
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <ThunderboltOutlined
                    style={{ fontSize: 34, color: "#facc15" }}
                  />
                  Đang sạc {session.currentBattery}%
                </h1>
                <Progress
                  percent={session.currentBattery}
                  strokeColor="#16a34a"
                  trailColor="#e5e7eb"
                  style={{ maxWidth: 300, margin: "20px auto" }}
                  showInfo={false}
                />
                <div
                  style={{ color: "#000", fontSize: 15, lineHeight: "1.9em" }}
                >
                  <div>
                    <b>Công suất hiện tại:</b> {session.point.powerRealTime} kW
                  </div>
                  <div>
                    <b>Năng lượng đã nhận:</b>{" "}
                    {session.energyDelivered.toFixed(2)} kWh
                  </div>
                  <div>
                    <b>Thời gian bắt đầu:</b>{" "}
                    {new Date(session.startDate).toLocaleString("vi-VN")}
                  </div>
                  <div>
                    <b>Thời gian đã sạc:</b> {session.duration} phút
                  </div>
                  <div>
                    <b>Thời gian còn lại:</b> {session.minute} phút
                  </div>
                  <div>
                    <b>Chi phí:</b> {session.fee.toLocaleString("vi-VN")} đ
                  </div>
                  <div>
                    <b>Mục tiêu:</b> {session.goalBattery}%
                  </div>
                  <div>
                    <b>Trạm:</b> {session.point.station.name} –{" "}
                    {session.point.name} – {session.point.chargerCost.power} kW
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS CHỈ HIỂN THỊ KHI ĐANG SẠC */}
          {session.status !== "COMPLETED" && (
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                paddingBottom: 10,
              }}
            >
              <Button
                danger
                size="large"
                style={{
                  flex: 1,
                  borderRadius: 8,
                  fontWeight: 700,
                  backgroundColor: "#c70024",
                  color: "#fff",
                  height: 50,
                }}
                onClick={() => handleStopCharging(session.id)}
              >
                Dừng sạc
              </Button>

              <Button
                size="large"
                style={{
                  flex: 1,
                  borderRadius: 8,
                  fontWeight: 700,
                  backgroundColor: "#fff7e6",
                  border: "1px solid #faad14",
                  color: "#fa8c16",
                  height: 50,
                }}
                icon={<WarningOutlined />}
                onClick={() =>
                  navigate(
                    `/driver/chargingSession/stationReport/${session.point.station.id}`
                  )
                }
              >
                Báo cáo sự cố
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ManageChargingSession;
