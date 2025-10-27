import { useEffect, useState } from "react";
import { Card, Button, Tag, Spin, message, Progress } from "antd";
import { useLocation } from "react-router-dom";

import api from "../../config/axios";
import { toast } from "react-toastify";

const ManageChargingSession = () => {
  const location = useLocation();

  const sessionData = location.state;
  const [chargingSessions, setChargingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (sessionData) {
          setChargingSessions(sessionData);
        } else {
          const res = await api.get("/chargingsessions");
          setChargingSessions(res.data);
        }
      } catch (err) {
        message.error("❌ Lỗi khi tải thông tin phiên sạc!");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionData]);

  useEffect(() => {
    if (sessionData) {
      setChargingSessions(sessionData);
    }
  }, [sessionData]);

  const handleStopCharging = async (id) => {
    try {
      await api.post(`/stop/${id}`);
      message.success("🛑 Đã dừng sạc!");
      // Cập nhật lại danh sách sau khi dừng
      setChargingSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Dừng sạc thành công");
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

  if (!chargingSessions)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Không có phiên sạc đang hoạt động
      </p>
    );

  return (
    <div style={{ padding: "40px 80px" }}>
      <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 20 }}>
        Tất cả phiên sạc
      </h2>

      {Array.isArray(chargingSessions) ? (
        chargingSessions.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 50 }}>
            Không có phiên sạc nào đang hoạt động
          </p>
        ) : (
          chargingSessions.map((session) => (
            <Card
              key={session.id}
              style={{
                borderRadius: 16,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                padding: 32,
                maxWidth: 950,
                margin: "20px auto",
              }}
            >
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
                  <h2 style={{ fontWeight: 600, fontSize: 22 }}>
                    {session.car.licensePlate}
                  </h2>
                </div>

                <div style={{ textAlign: "right", lineHeight: "1.8em" }}>
                  <div>
                    <b>Trạm:</b> {session.point.station.name}
                  </div>
                  <div>
                    <b>Trụ sạc:</b> {session.point.name}
                  </div>
                  <div>
                    <b>Giá điện:</b>{" "}
                    {session.point.chargerCost.cost.toLocaleString("vi-VN")}{" "}
                    đ/phút
                  </div>
                  <div>
                    <b>Thanh toán:</b>{" "}
                    {session.paymentMethod === "BALANCE"
                      ? "Số dư tài khoản"
                      : "Tiền mặt"}
                  </div>
                  <b>Trạng thái:</b>{" "}
                  {session.status === "ONGOING"
                    ? "Đang sạc"
                    : session.status === "COMPLETED"
                    ? "Hoàn tất"
                    : session.status === "PENDING"
                    ? "Đang khởi tạo"
                    : session.status}
                </div>
              </div>

              <Progress
                percent={(session.initBattery / session.goalBattery) * 100}
                showInfo={false}
                strokeColor="#000"
                trailColor="#ddd"
                style={{ maxWidth: 600, margin: "16px auto" }}
              />

              <div style={{ textAlign: "center", marginTop: 10 }}>
                <h3 style={{ fontSize: 22, fontWeight: 600 }}>
                  {session.initBattery}% → {session.goalBattery}%
                </h3>
                <p style={{ color: "#666" }}>Dung lượng pin</p>
              </div>

              <Button
                danger
                block
                size="large"
                onClick={() => handleStopCharging(session.id)}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  backgroundColor: "#c70024",
                  border: "none",
                  marginTop: 20,
                }}
              >
                Dừng sạc
              </Button>
            </Card>
          ))
        )
      ) : (
        <p style={{ textAlign: "center", marginTop: 50 }}>
          {chargingSessions || "Không có dữ liệu phiên sạc"}
        </p>
      )}
    </div>
  );
};

export default ManageChargingSession;
