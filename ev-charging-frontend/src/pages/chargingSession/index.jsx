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
  const location = useLocation();

  const [chargingSessions, setChargingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "BALANCE":
        return "Số dư tài khoản";
      case "CASH":
        return "Tiền mặt";
      default:
        return "Chưa xác định";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-white">
        <Spin tip="Đang tải thông tin..." size="large" />
      </div>
    );
  }

  const filteredSessions = chargingSessions
    .filter((session) => {
      if (filter === "CHARGING") return session.status !== "COMPLETED";
      if (filter === "COMPLETED") return session.status === "COMPLETED";
      return true; // ALL
    })
    .sort((a, b) => {
      // Đặt phiên đang sạc lên trước
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;

      // Nếu đều là COMPLETED, sắp xếp theo startDate gần nhất lên đầu
      if (a.status === "COMPLETED" && b.status === "COMPLETED") {
        return new Date(b.startDate) - new Date(a.startDate); // mới -> cũ
      }

      return 0;
    });

  const renderEmptyText = () => {
    if (filter === "CHARGING")
      return "Hiện tại bạn không có phiên sạc đang hoạt động.";
    if (filter === "COMPLETED")
      return "Hiện tại bạn chưa có phiên sạc nào đã hoàn thành.";
    return "Hiện tại không có phiên sạc nào.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <CarOutlined className="text-blue-600" />
            Phiên sạc của tôi
          </h2>
          <p className="text-slate-500 mt-1">
            Theo dõi trạng thái các phiên sạc đang hoạt động và đã hoàn tất.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <Button
            type={filter === "ALL" ? "primary" : "default"}
            onClick={() => setFilter("ALL")}
            className="rounded-full"
          >
            Tất cả
          </Button>
          <Button
            type={filter === "CHARGING" ? "primary" : "default"}
            onClick={() => setFilter("CHARGING")}
            className="rounded-full"
          >
            Đang sạc
          </Button>
          <Button
            type={filter === "COMPLETED" ? "primary" : "default"}
            onClick={() => setFilter("COMPLETED")}
            className="rounded-full"
          >
            Đã sạc xong
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {filteredSessions.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <ThunderboltOutlined className="text-5xl text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">{renderEmptyText()}</p>
        </div>
      )}

      {/* List sessions */}
      <div className="max-w-6xl mx-auto space-y-6">
        {filteredSessions.map((session) => (
          <Card
            key={session.id}
            className="shadow-sm rounded-2xl border border-slate-100 hover:shadow-md transition"
            bodyStyle={{ padding: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-slate-50 rounded-t-2xl px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-900 text-white">
                  <CarOutlined />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {session.status === "COMPLETED"
                      ? "Xe đã sạc xong"
                      : "Xe đang sạc"}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {session.car?.licensePlate}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            {session.status === "COMPLETED" ? (
              // ========== PHIÊN ĐÃ HOÀN THÀNH ==========
              <div className="px-8 py-6 space-y-5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-sky-500 text-center">
                  Phiên sạc đã hoàn thành
                </h1>

                <div className="border-y border-slate-200 py-4 text-[15px] leading-relaxed text-slate-900 space-y-1">
                  <div>
                    <b>Mức pin:</b> {session.initBattery}% →{" "}
                    {session.goalBattery}%
                  </div>
                  <div>
                    <b>Năng lượng đã nạp:</b>{" "}
                    {session.energyDelivered.toFixed(2)} kWh
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
                    <b>Chi phí tổng:</b>{" "}
                    {Math.round(session.fee).toLocaleString("vi-VN")} đ
                  </div>
                  <div>
                    <b>Phương thức thanh toán:</b>{" "}
                    {getPaymentMethodText(session.paymentMethod)}
                  </div>
                </div>

                <div className="text-[15px] text-slate-900">
                  <div>
                    <b>Trạm:</b> {session.point?.station?.name} –{" "}
                    {session.point?.name} – {session.point?.chargerCost?.power}{" "}
                    kW
                  </div>
                </div>
              </div>
            ) : (
              // ========== PHIÊN ĐANG SẠC ==========
              <div className="px-8 py-6 flex flex-col lg:flex-row gap-8 justify-between">
                <div className="flex-1 text-center">
                  <h1 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-extrabold text-emerald-600">
                    <ThunderboltOutlined className="text-yellow-400 text-3xl" />
                    Đang sạc {session.currentBattery}%
                  </h1>

                  <div className="max-w-xs mx-auto mt-5">
                    <Progress
                      percent={session.currentBattery}
                      strokeColor="#16a34a"
                      trailColor="#e5e7eb"
                      showInfo={false}
                    />
                  </div>

                  <div className="mt-4 text-[15px] text-slate-900 space-y-1 leading-relaxed">
                    <div>
                      <b>Công suất hiện tại:</b> {session.point?.powerRealTime}{" "}
                      kW
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
                      <b>Thời gian ước tính còn lại:</b> {session.minute} phút
                    </div>
                    <div>
                      <b>Chi phí hiện tại:</b>{" "}
                      {Math.round(session.fee).toLocaleString("vi-VN")} đ
                    </div>
                    <div>
                      <b>Chi phí ước tính:</b>{" "}
                      {Math.round(session.estimatedFee).toLocaleString("vi-VN")}{" "}
                      đ
                    </div>
                    <div>
                      <b>Phương thức thanh toán:</b>{" "}
                      {getPaymentMethodText(session.paymentMethod)}
                    </div>
                    <div>
                      <b>Mục tiêu:</b> {session.goalBattery}%
                    </div>
                    <div>
                      <b>Trạm:</b> {session.point?.station?.name} –{" "}
                      {session.point?.name} –{" "}
                      {session.point?.chargerCost?.power} kW
                      {session.paymentMethod === "CASH" && (
                        <div className="mt-2 text-[#c70024] font-semibold">
                          Thanh toán bằng tiền mặt, nếu rút sạc giữa chừng sẽ
                          không được hoàn tiền.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS – chỉ hiển thị khi đang sạc */}
            {session.status !== "COMPLETED" && (
              <div className="flex flex-col md:flex-row gap-4 md:gap-3 justify-center px-8 pb-6">
                <Button
                  danger
                  size="large"
                  className="flex-1 font-bold h-12 rounded-xl bg-[#c70024] text-white border-none hover:bg-red-700"
                  onClick={() => handleStopCharging(session.id)}
                >
                  Dừng sạc
                </Button>

                <Button
                  size="large"
                  className="flex-1 font-bold h-12 rounded-xl bg-amber-50 border border-amber-400 text-amber-600 flex items-center justify-center gap-2"
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
    </div>
  );
};

export default ManageChargingSession;
