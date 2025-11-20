import { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, message, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import {
  WarningOutlined,
  ThunderboltOutlined,
  CarOutlined,
} from "@ant-design/icons";

const ManageChargingSession = () => {
  const navigate = useNavigate();
  const [chargingSessions, setChargingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const fetchSession = async () => {
      try {
        const res = await api.get("/chargingsessions");

        // 🕒 Sắp xếp theo thời gian bắt đầu (phiên mới nhất lên đầu)
        const sortedSessions = [...res.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setChargingSessions(sortedSessions);
        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi tải phiên sạc:", error);
        setLoading(false);
      }
    };

    // Gọi lần đầu tiên khi mở trang
    fetchSession();

    // Cập nhật mỗi giây
    intervalId = setInterval(fetchSession, 1000);

    // Dọn dẹp interval khi rời trang
    return () => clearInterval(intervalId);
  }, []);

  const handleStopCharging = async (id) => {
    try {
      await api.post(`/stop/${id}`);
      message.success("🛑 Đã dừng sạc!");
      setChargingSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Dừng sạc thành công");
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

  if (!chargingSessions || chargingSessions.length === 0)
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: 100,
          color: "#ffffffff",
          fontSize: 22,
        }}
      >
        Hiện tại không có phiên sạc nào đang hoạt động
      </p>
    );

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

      {chargingSessions.map((session) => (
        <Card
          key={session.id}
          style={{
            borderRadius: 16,
            border: "1px solid #eee",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            padding: 28,
            maxWidth: 1000,
            margin: "0 auto",
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
              <CarOutlined style={{ fontSize: 28, color: "#0f172a" }} />
              <div>
                <p style={{ color: "#64748b", marginBottom: 4 }}>Xe đang sạc</p>
                <h2 style={{ fontWeight: 700, fontSize: 20 }}>
                  {session.car.licensePlate}
                </h2>
              </div>
            </div>
          </div>

          {/* Pin + Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 40,
              marginBottom: 40,
            }}
          >
            {/* ✅ Chỉ hiển thị phần pin khi đang sạc */}
            {session.status === "ONGOING" && (
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <h1
                  style={{
                    fontSize: 42,
                    color: "#16a34a",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <ThunderboltOutlined
                    style={{
                      color: "#facc15",
                      fontSize: 36,
                      filter: "drop-shadow(0 0 6px rgba(250, 204, 21, 0.6))",
                    }}
                  />
                  {session.initBattery}%
                </h1>

                <p style={{ color: "#64748b", fontSize: 15 }}>
                  Mức pin hiện tại
                </p>

                <Progress
                  percent={(session.initBattery / 100) * 100}
                  showInfo={false}
                  strokeColor="#16a34a"
                  trailColor="#e5e7eb"
                  style={{ maxWidth: 300, margin: "20px auto" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: 300,
                    margin: "0 auto",
                    color: "#000",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {/* Cột Mục tiêu */}
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 20,
                          color: "#0f172a",
                          background:
                            "linear-gradient(90deg, #e0f7e9 0%, #b9f0c1 100%)",
                          borderRadius: 8,
                          padding: "6px 14px",
                          display: "inline-block",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                        }}
                      >
                        {session.goalBattery}%
                      </div>
                      <p
                        style={{
                          color: "#64748b",
                          marginTop: 6,
                          fontSize: 14,
                          textAlign: "center",
                        }}
                      >
                        Mục tiêu
                      </p>
                    </div>

                    {/* Cột Trạng thái */}
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 20,
                          color:
                            session.status === "ONGOING"
                              ? "#1677ff"
                              : session.status === "COMPLETED"
                              ? "#16a34a"
                              : "#faad14",
                          background:
                            session.status === "ONGOING"
                              ? "linear-gradient(90deg, #e6f0ff 0%, #cce0ff 100%)"
                              : session.status === "COMPLETED"
                              ? "linear-gradient(90deg, #e6f8ed 0%, #baf7c5 100%)"
                              : "linear-gradient(90deg, #fffbe6 0%, #fff2cc 100%)",
                          borderRadius: 8,
                          padding: "6px 14px",
                          display: "inline-block",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          minWidth: 100,
                        }}
                      >
                        {session.status === "ONGOING"
                          ? "Đang sạc"
                          : session.status === "COMPLETED"
                          ? "Hoàn tất"
                          : "Khởi tạo"}
                      </div>
                      <p
                        style={{
                          color: "#64748b",
                          marginTop: 6,
                          fontSize: 14,
                          textAlign: "center",
                        }}
                      >
                        Trạng thái
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cột phải - Info */}
            <div
              style={{
                flex: 1,
                color: "#1e293b",
                fontSize: 15,
                lineHeight: "1.9em",
                paddingLeft: 40,
                borderLeft: "2px solid #f0f0f0",
              }}
            >
              <div>
                <b>Trạm:</b> {session.point.station.name}
              </div>
              <div>
                <b>Trụ sạc:</b> {session.point.name}
              </div>
              <div>
                <b>Giá điện:</b>{" "}
                {session.point.chargerCost.cost.toLocaleString("vi-VN")} đ/phút
              </div>
              <p style={{ fontSize: 15, color: "#475569", marginTop: 4 }}>
                <b>Bắt đầu lúc:</b>{" "}
                {new Date(session.date).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>

              <div>
                <b>Thanh toán:</b>{" "}
                {session.paymentMethod === "BALANCE"
                  ? "Số dư tài khoản"
                  : "Tiền mặt"}
              </div>
            </div>
          </div>

          {/* ✅ Nút chỉ hiện khi đang sạc */}
          {session.status === "ONGOING" && (
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                alignItems: "center",
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
                  border: "none",
                  height: 50,
                  fontSize: 17,
                  color: "#fff",
                  textShadow: "0 1px 3px rgba(0,0,0,0.2)",
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
                  fontSize: 16,
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

          {session.status === "COMPLETED" && (
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                marginTop: 16,
                paddingTop: 12,
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#16a34a",
                  marginBottom: 10,
                }}
              >
                ✅ Phiên sạc đã hoàn tất
              </h3>

              <p style={{ fontSize: 16, marginBottom: 6 }}>
                <b>Trạng thái:</b>{" "}
                <span style={{ color: "#16a34a", fontWeight: 600 }}>
                  Hoàn tất
                </span>
              </p>

              <p style={{ fontSize: 16, marginBottom: 6 }}>
                <b>Tổng phí:</b>{" "}
                <span style={{ color: "#dc2626", fontWeight: 700 }}>
                  {session.fee.toLocaleString("vi-VN")} đ
                </span>
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ManageChargingSession;
