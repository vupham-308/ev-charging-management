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
import { toast } from "react-toastify";
import { Tooltip } from "antd";

const ManageMyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/reservations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredBookings = response.data.filter(
          (b) => b.status !== "CANCELLED"
        );

        const sortedBookings = filteredBookings.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        setBookings(sortedBookings);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách đặt chỗ:", error);
      }
    };
    fetchMyBookings();
  }, []);

  const handleStart = (booking) => {
    navigate(`/driver/startChargingBooking/${booking.stationId}`, {
      state: { booking },
    });
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy đặt chỗ này không?")) {
      try {
        const token = localStorage.getItem("token");
        await api.put(`/reservations/cancel/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prev) => prev.filter((b) => b.id !== id));
        toast.success("Đã hủy đặt chỗ thành công!");
      } catch (error) {
        console.error("❌ Lỗi khi hủy đặt chỗ:", error);
        toast.error("Không thể hủy đặt chỗ. Vui lòng thử lại!");
      }
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return { text: "Đặt thành công", color: "text-emerald-600" };
      case "COMPLETE":
        return { text: "Đã sạc xong", color: "text-blue-600" };
      default:
        return { text: status, color: "text-gray-500" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 flex justify-center items-center gap-2">
          <FaChargingStation className="text-blue-600" />
          Đặt chỗ của tôi
        </h2>
        <p className="text-gray-500 mt-2">Quản lý lịch hẹn sạc xe của bạn</p>
      </div>

      {/* Empty state */}
      {bookings.length === 0 ? (
        <div className="text-center mt-20">
          <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Bạn chưa có đặt chỗ nào.</p>
        </div>
      ) : (
        <div className="space-y-5 max-w-3xl mx-auto">
          {bookings.map((booking) => {
            const { text, color } = getStatusLabel(booking.status);
            const now = new Date();
            const startTime = new Date(booking.startDate);
            const diffMinutes = (startTime - now) / 60000;
            const canStart = diffMinutes <= 30;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg border border-gray-100"
              >
                {/* Station Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600" />
                      {booking.stationName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-emerald-500" />
                        {new Date(booking.startDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-indigo-500" />
                        {new Date(booking.startDate).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBolt className="text-yellow-500" />
                        {booking.chargerPointName}
                      </span>
                    </div>
                    <p className={`mt-3 font-medium ${color}`}>{text}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-5">
                  {booking.status === "PENDING" && (
                    <>
                      <Tooltip
                        title={
                          canStart
                            ? "Bắt đầu sạc ngay"
                            : "Chỉ có thể bắt đầu sạc trong vòng 10 phút trước thời gian bắt đầu"
                        }
                      >
                        <button
                          onClick={() => canStart && handleStart(booking)}
                          disabled={!canStart}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition ${
                            canStart
                              ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FaPowerOff />
                          Bắt đầu
                        </button>
                      </Tooltip>

                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-sm"
                      >
                        <FaBolt />
                        Hủy
                      </button>
                    </>
                  )}

                  {booking.status === "COMPLETE" && (
                    <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                      ✅ Đã sạc xong
                    </span>
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
