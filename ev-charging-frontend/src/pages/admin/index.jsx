import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold">🚀 Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Xin chào, Quản trị viên!</span>
          <Button type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Quản lý hệ thống</h2>
          <p className="text-gray-600">
            Đây là trang dành cho quản trị viên. Bạn có thể quản lý tài khoản, trạm sạc, và dữ liệu thống kê tại đây.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
