import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Card, Button, Spin, DatePicker, Modal, message } from "antd";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, chargerRes] = await Promise.all([
          api.get(`/station/get/${stationId}`),
          api.get(`/chargerPoint/getAll/${stationId}`),
        ]);
        setStation(stationRes.data);
        setChargers(chargerRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stationId]);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
              <p className="flex items-center gap-1 text-yellow-500 mt-1">
                <StarFilled />
                <span className="text-gray-800 font-medium">4.8</span>
                <span className="text-gray-500 text-sm">(156 đánh giá)</span>
              </p>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 flex items-center justify-center rounded-xl h-48 md:h-56">
            <span className="text-gray-400">Hình ảnh trạm sạc</span>
          </div>
        </div>
      </div>

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
              onChange={(date) => setSelectedDate(date)}
            />
            <div>
              <p className="text-gray-600 mb-2 font-medium">Chọn khung giờ</p>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 border border-gray-200 rounded-xl">
                {[
                  "08:00",
                  "08:30",
                  "09:00",
                  "09:30",
                  "10:00",
                  "10:30",
                  "11:00",
                  "11:30",
                  "12:00",
                  "12:30",
                  "13:00",
                  "13:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                  "17:00",
                  "17:30",
                  "18:00",
                  "18:30",
                  "19:00",
                  "19:30",
                ].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`text-sm px-3 py-2 rounded-lg transition font-medium ${
                      selectedTime === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {time}
                  </button>
                ))}
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
            VND/kWh
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
