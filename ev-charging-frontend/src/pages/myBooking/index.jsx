import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaBolt } from "react-icons/fa";
import api from "../../config/axios";

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
        setBookings(response.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách đặt chỗ:", error);
      }
    };
    fetchMyBookings();
  }, []);

  const handleStart = (booking) => {
    navigate("/driver/startCharging", { state: { booking } });
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy đặt chỗ này không?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prev) => prev.filter((b) => b.id !== id));
        alert("✅ Đã hủy đặt chỗ thành công!");
      } catch (error) {
        console.error("❌ Lỗi khi hủy đặt chỗ:", error);
        alert("❌ Không thể hủy đặt chỗ. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-1">Đặt chỗ của tôi</h2>
      <p className="text-gray-500 mb-6">Quản lý lịch hẹn sạc xe</p>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Bạn chưa có đặt chỗ nào.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex justify-between items-center bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.stationName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-blue-500" />{" "}
                    {new Date(booking.startDate).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-pink-500" />{" "}
                    {new Date(booking.startDate).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaBolt className="text-orange-500" />{" "}
                    {booking.chargerPointName}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2"
                  onClick={() => handleStart(booking)}
                >
                  Bắt đầu sạc
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2"
                  onClick={() => handleCancel(booking.id)}
                >
                  Hủy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMyBooking;
