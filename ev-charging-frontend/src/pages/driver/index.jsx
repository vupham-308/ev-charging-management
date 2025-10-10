import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold">🚗 Driver Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Xin chào, Tài xế!</span>
          <Button type="primary" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Thông tin cá nhân & Trạm sạc gần nhất</h2>
          <p className="text-gray-600">
            Đây là trang dành cho tài xế. Bạn có thể xem lịch sử sạc, vị trí trạm sạc gần nhất, và trạng thái xe tại đây.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
