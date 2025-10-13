import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

// Cấu hình tab và route tương ứng
const tabConfig = [
  { label: "Tổng quan", path: "/admin/dashboardadmin" },
  { label: "Trạm sạc", path: "/admin/stations" },
  { label: "Người dùng", path: "/admin/users" },
  { label: "Quản lý sự cố", path: "/admin/incidents" },
  { label: "Cài đặt", path: "/admin/settings" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Tổng quan");

  // Cập nhật tab đang active dựa vào URL
  useEffect(() => {
    const matched = tabConfig.find((tab) => location.pathname === tab.path);
    if (matched) {
      setActiveTab(matched.label);
    }
  }, [location.pathname]);

  //Token Login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.label);
    navigate(tab.path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold">🚀 Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Xin chào, Quản trị viên!</span>
          <Button type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-white mt-2 shadow">
        {tabConfig.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 py-3 font-medium border-b-2 ${activeTab === tab.label
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content từ các route con */}
      <main className="p-6">
        <div className="bg-white p-6 rounded shadow text-gray-700">
          <Outlet /> {/*  Nội dung component con sẽ hiện ở đây */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
