import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const tabs = ["Giám sát", "Thanh toán", "Sự cố KH", "Báo cáo", "Bảo trì"];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Giám sát");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Giám sát":
        return "Theo dõi tình trạng điểm sạc (online/offline, công suất, ...)";
      case "Thanh toán":
        return "Quản lý việc khởi động/dừng phiên sạc, ghi nhận thanh toán tại chỗ phí sạc xe.";
      case "Sự cố KH":
        return "Báo cáo và xử lý sự cố của khách hàng tại trạm.";
      case "Báo cáo":
        return "Xem thống kê và báo cáo tổng hợp.";
      case "Bảo trì":
        return "Lên lịch và ghi nhận bảo trì trạm sạc.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold">⚡ Staff Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Trần Thị Bình - Nhân viên trạm sạc</span>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </div>
      </header>

      <nav className="flex bg-white mt-2 shadow">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 font-medium border-b-2 ${
              activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="p-6">
        <div className="bg-white p-6 rounded shadow text-gray-700">{renderContent()}</div>
      </main>
    </div>
  );
};

export default StaffDashboard;
