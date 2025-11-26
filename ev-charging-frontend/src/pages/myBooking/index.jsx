import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaBolt,
  FaChargingStation,
  FaMapMarkerAlt,
  FaPowerOff,
} from "react-icons/fa";
import api from "../../config/axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Tooltip } from "antd";

const ManageMyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("PENDING"); // trạng thái lọc
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/reservations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = response.data.filter((b) => b.status !== "CANCELLED");
        const sorted = filtered.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        setBookings(sorted);
      } catch (error) {
        console.error("❌ Lỗi tải đặt chỗ:", error);
      }
    };
    fetchMyBookings();
  }, []);

  const handleStart = (booking) => {
    navigate(
      `/driver/startChargingBooking/${booking.chargerPoint.station.id}`,
      {
        state: { booking },
      }
    );
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy đặt chỗ này không?")) {
      try {
        const token = localStorage.getItem("token");
        await api.put(`/reservations/cancel/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings((prev) => prev.filter((b) => b.id !== id));
        toast.success("Đã hủy đặt chỗ!");
      } catch (error) {
        console.error("❌ Lỗi khi hủy:", error);
        toast.error("Không thể hủy đặt chỗ!");
      }
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "PENDING":
        return { text: "Đặt thành công", class: "text-emerald-600" };
      case "COMPLETED":
        return { text: "Đã sạc xong", class: "text-blue-600" };
      default:
        return { text: status, class: "text-gray-500" };
    }
  };

  // lọc booking theo nút chọn và sắp xếp
  const filteredBookings = bookings
    .filter((b) => b.status === filterStatus)
    .sort((a, b) => {
      // nếu là COMPLETED thì sort ngược, gần nhất lên đầu
      if (filterStatus === "COMPLETED") {
        return new Date(b.startDate) - new Date(a.startDate);
      }
      // PENDING giữ nguyên sort tăng dần theo thời gian
      return new Date(a.startDate) - new Date(b.startDate);
    });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
          <FaChargingStation className="text-blue-600" />
          Đặt chỗ của tôi
        </h2>
        <p className="text-gray-500 mt-2">Quản lý lịch hẹn sạc xe của bạn</p>

        {/* Nút lọc */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "PENDING"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Chỗ đã đặt
          </button>
          <button
            onClick={() => setFilterStatus("COMPLETED")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "COMPLETED"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Chỗ đã sạc xong
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="text-center mt-20">
          <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Không có đặt chỗ nào.</p>
        </div>
      ) : (
        <div className="space-y-5 max-w-3xl mx-auto">
          {filteredBookings.map((b) => {
            const status = getStatus(b.status);
            const canStart = new Date() >= new Date(b.startDate);

            const start = dayjs(b.startDate);
            const end = dayjs(b.endDate);

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition"
              >
                {/* Station */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      {b.chargerPoint.station.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {b.chargerPoint.station.address}
                    </p>

                    {/* Time row */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-700">
                        <FaCalendarAlt className="text-emerald-500" />
                        {start.format("DD/MM/YYYY")}
                      </span>

                      <span className="flex items-center gap-1 text-gray-700">
                        <FaClock className="text-indigo-500" />
                        {start.format("HH:mm")}
                      </span>

                      <span className="flex items-center gap-1 text-gray-700">
                        <FaBolt className="text-yellow-500" />
                        {b.chargerPoint.name} •{" "}
                        {b.chargerPoint.chargerCost.portType} •{" "}
                        {b.chargerPoint.chargerCost.power} kW
                      </span>
                    </div>

                    {/* compatible */}
                    {b.compatibleNote && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        {b.compatibleNote}
                      </p>
                    )}

                    {/* Status */}
                    <p className={`${status.class} mt-3 font-medium`}>
                      Trạng thái: {status.text}
                    </p>

                    {/* Khung giờ */}
                    <p className="text-gray-700 text-sm">
                      Khung giờ: {start.format("HH:mm")} → {end.format("HH:mm")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5">
                  {b.status === "PENDING" && (
                    <>
                      <Tooltip
                        title={
                          canStart
                            ? "Bạn có thể bắt đầu sạc"
                            : "Chưa đến thời gian đặt"
                        }
                      >
                        <button
                          onClick={() => canStart && handleStart(b)}
                          disabled={!canStart}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition ${
                            canStart
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FaPowerOff />
                          Bắt đầu
                        </button>
                      </Tooltip>

                      <button
                        onClick={() => handleCancel(b.id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                      >
                        <FaBolt />
                        Hủy
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageMyBooking;
