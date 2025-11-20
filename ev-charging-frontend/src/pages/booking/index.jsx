import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Card, Button, Spin, DatePicker, Modal, message, Tooltip } from "antd";
import api from "../../config/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const ManageBooking = () => {
  const navigate = useNavigate();
  const { stationId } = useParams();

  const [station, setStation] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reservations, setReservations] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const allTimes = Array.from({ length: 24 * 12 }, (_, i) => {
    const hour = Math.floor(i / 12);
    const minute = (i % 12) * 5;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  // 🧠 Gọi API lấy trạm + trụ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, chargerRes, reviewRes] = await Promise.all([
          api.get(`/station/get/${stationId}`),
          api.get(`/chargerPoint/getAll/${stationId}`),
          api.get(`/review/station/${stationId}`),
        ]);
        setStation(stationRes.data);
        setChargers(chargerRes.data);

        setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);

        if (Array.isArray(reviewRes.data) && reviewRes.data.length > 0) {
          const avg =
            reviewRes.data.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviewRes.data.length;
          setAverageRating(Number(avg.toFixed(1))); // 🟢 làm tròn 1 số thập phân
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stationId]);

  // ⚙️ Gọi API lấy các khung giờ đã được đặt
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/reservations/lock");
        setReservations(res.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
      }
    };
    fetchReservations();
  }, []);

  // 🔍 Lọc ra khung giờ đã bị đặt (theo ngày + trụ sạc)
  const bookedSlots = reservations.filter((r) => {
    return (
      selectedDate &&
      selectedCharger &&
      r.stationId === Number(stationId) &&
      r.chargerpointId === selectedCharger && // 🔹 Chỉ lấy slot của trụ đã chọn
      dayjs(r.startDate).isSame(selectedDate, "day")
    );
  });

  // Kiểm tra xem 1 khung giờ có bị trùng không
  const isTimeBooked = (time) => {
    const selectedStart = dayjs(
      `${selectedDate?.format("YYYY-MM-DD")} ${time}`
    );
    return bookedSlots.some((slot) => {
      const start = dayjs(slot.startDate);
      const end = dayjs(slot.endDate);
      return (
        selectedStart.isAfter(start.subtract(1, "minute")) &&
        selectedStart.isBefore(end)
      );
    });
  };

  const handleConfirmClick = () => {
    if (!selectedDate || !selectedTime || !selectedCharger) {
      toast.warning("Vui lòng chọn trụ sạc, ngày và giờ!");
      return;
    }
    setIsModalVisible(true);
  };

  const handleCreateReservation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.warning("Vui lòng đăng nhập trước khi đặt chỗ!");
        navigate("/login");
        return;
      }

      const charger = chargers.find((c) => c.id === selectedCharger);

      const startDate = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${selectedTime}`
      );
      const endDate = startDate.add(30, "minute");

      const payload = {
        chargerPointId: charger.id,
        startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
        endDate: endDate.format("YYYY-MM-DD HH:mm:ss"),
      };

      await api.post("/reservations/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Đặt chỗ thành công!");
      toast.success("Đặt chỗ thành công!");
      setIsModalVisible(false);
      navigate(-1);
    } catch (error) {
      console.error("❌ Lỗi khi tạo đặt chỗ:", error.response?.data || error);

      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        message.error("Đặt chỗ thất bại, vui lòng thử lại!");
        toast.warning("Đặt chỗ thất bại, vui lòng thử lại!");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-white relative">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="text-black"
        >
          Quay lại
        </Button>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-black">
          Đặt chỗ sạc
        </h2>
        <div className="w-20"></div>
      </div>

      {/* Thông tin trạm */}
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-1">{station.name}</h2>
            <p className="text-gray-500 mb-4">Thông tin chi tiết về trạm sạc</p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <EnvironmentOutlined />
                {station.address}
              </p>
              <p className="flex items-center gap-2">
                <PhoneOutlined />
                {station.phone}
              </p>
              <p className="flex items-center gap-2">
                <MailOutlined />
                {station.email}
              </p>
              {/* 🟢 Hiển thị đánh giá từ API */}
              <p
                className="flex items-center gap-1 text-yellow-500 mt-1 cursor-pointer hover:text-yellow-600"
                onClick={() => setShowReviewModal(true)}
              >
                <StarFilled />
                <span className="text-gray-800 font-medium">
                  {averageRating || 0}
                </span>
                <span className="text-gray-500 text-sm">
                  ({reviews.length} đánh giá)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Tất cả đánh giá trạm"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        footer={null}
        width={600}
      >
        {reviews.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border-b border-gray-100 pb-2 mb-2 text-gray-700"
              >
                <p className="font-medium text-gray-800">{r.userName}</p>
                <p className="text-yellow-500 text-sm">
                  {"⭐".repeat(r.rating)}
                </p>
                <p>{r.description}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(r.reviewDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Chưa có đánh giá nào.</p>
        )}
      </Modal>

      {/* Chọn trụ sạc + thời gian */}
      <div className="max-w-6xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
        {/* Chọn trụ sạc */}
        <Card
          title={<span className="font-semibold text-lg">Chọn trụ sạc</span>}
          bordered={false}
          className="shadow-sm rounded-2xl"
        >
          <p className="text-gray-500 mb-4">
            Chọn trụ sạc phù hợp với xe của bạn
          </p>
          <div className="grid grid-cols-2 gap-4">
            {chargers.map((charger) => (
              <div
                key={charger.id}
                onClick={() =>
                  charger.status === "AVAILABLE" &&
                  setSelectedCharger(charger.id)
                }
                className={`p-4 border rounded-xl cursor-pointer transition hover:shadow-md ${
                  charger.status !== "AVAILABLE"
                    ? "opacity-50 cursor-not-allowed"
                    : selectedCharger === charger.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{charger.name}</h4>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      charger.status === "AVAILABLE"
                        ? "bg-green-500"
                        : charger.status === "OUT_OF_SERVICE"
                        ? "bg-gray-400"
                        : "bg-red-500"
                    }`}
                  ></div>
                </div>

                <p className="text-sm text-gray-600">
                  Loại: {charger.chargerCost?.portType || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Công suất: {charger.capacity} kW
                </p>

                <p
                  className={`mt-2 text-sm font-semibold ${
                    charger.status === "AVAILABLE"
                      ? "text-green-600"
                      : charger.status === "OUT_OF_SERVICE"
                      ? "text-gray-500"
                      : "text-red-600"
                  }`}
                >
                  Trạng thái:{" "}
                  {charger.status === "AVAILABLE"
                    ? "Sẵn sàng"
                    : charger.status === "OUT_OF_SERVICE"
                    ? "Bảo trì"
                    : "Đang sử dụng"}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Chọn thời gian */}
        <Card
          title={<span className="font-semibold text-lg">Chọn thời gian</span>}
          bordered={false}
          className="shadow-sm rounded-2xl"
        >
          <p className="text-gray-500 mb-4">Chọn ngày và giờ muốn sạc</p>
          <div className="flex flex-col gap-4">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              className="rounded-lg"
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />

            <div>
              <p className="text-gray-600 mb-2 font-medium">Chọn khung giờ</p>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 border border-gray-200 rounded-xl">
                {allTimes.map((time) => {
                  const booked = isTimeBooked(time);

                  // Hàm lấy tên trụ sạc đã bị đặt vào khung giờ time
                  const chargersBooked = bookedSlots
                    .filter((slot) => {
                      const start = dayjs(slot.startDate);
                      const end = dayjs(slot.endDate);
                      const selectedStart = dayjs(
                        `${selectedDate?.format("YYYY-MM-DD")} ${time}`
                      );
                      return (
                        selectedStart.isAfter(start.subtract(1, "minute")) &&
                        selectedStart.isBefore(end)
                      );
                    })
                    .map((slot) => {
                      const charger = chargers.find(
                        (c) => c.id === slot.chargerPointId
                      );
                      return charger
                        ? charger.name || `Trụ #${charger.id}`
                        : "Trụ đã đặt vào thời gian này";
                    });

                  const tooltipTitle = booked
                    ? ` ${chargersBooked.join(", ")}`
                    : "";

                  // 🕒 Nếu là hôm nay => chặn giờ trong quá khứ
                  const now = dayjs();
                  const selectedStart = dayjs(
                    `${selectedDate?.format("YYYY-MM-DD")} ${time}`
                  );
                  const isPast =
                    selectedDate &&
                    selectedDate.isSame(now, "day") &&
                    selectedStart.isBefore(now);

                  const disabled = booked || isPast;

                  return (
                    <Tooltip key={time} title={tooltipTitle} placement="top">
                      <button
                        disabled={disabled}
                        onClick={() => !disabled && setSelectedTime(time)}
                        className={`text-sm px-3 py-2 rounded-lg transition font-medium ${
                          disabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : selectedTime === time
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        {time}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>

          {station.status !== "ACTIVE" ? (
            <div className="mt-6 text-center">
              <Button
                type="primary"
                size="large"
                block
                disabled
                className="rounded-xl bg-gray-300 text-gray-500 border-none cursor-not-allowed"
              >
                Trạm đang bảo trì
              </Button>
              <p className="text-red-500 text-sm mt-3 font-medium">
                ⚠️ Trạm này hiện đang bảo trì, không thể đặt chỗ.
              </p>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              block
              className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirmClick}
              disabled={!selectedCharger || !selectedDate || !selectedTime}
            >
              Xác nhận đặt chỗ
            </Button>
          )}
        </Card>
      </div>

      {/* Modal xác nhận */}
      <Modal
        title={<span className="font-semibold text-lg">Xác nhận đặt chỗ</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Trạm sạc:</strong> {station.name}
          </p>
          <p>
            <strong>Trụ sạc:</strong> Trụ #{selectedCharger}
          </p>
          <p>
            <strong>Ngày:</strong>{" "}
            {selectedDate ? selectedDate.format("DD/MM/YYYY") : "-"}
          </p>
          <p>
            <strong>Giờ:</strong> {selectedTime}
          </p>
          <p>
            <strong>Giá:</strong>{" "}
            {chargers.find((c) => c.id === selectedCharger)?.chargerCost
              ?.cost || 0}{" "}
            VND/phút
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleCreateReservation}
          >
            Xác nhận đặt chỗ
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageBooking;
