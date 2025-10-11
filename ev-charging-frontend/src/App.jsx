import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/admin/Dashboard"; // Import Dashboard từ file ./pages/Dashboard
import ChargingStations from "./pages/admin/ChargingStations"; ///
import User from "./pages/admin/Users";//
import IncidentManagement from "./pages/admin/IncidentManagement";//
import ChargingRates from "./pages/admin/ChargingRates"
import AuthContext from "./contexts/AuthContext";
import { Button, Layout, Space } from "antd";
import LayoutADMIN from "./pages/admin/layoutADMIN";

// Trang chủ (công khai)
const Home = () => (
  <div>
    <h1>Trang Chủ</h1>
    <p>Đây là trang công khai, ai cũng có thể xem.</p>
    <Link to="/dashboard">Đi tới Dashboard (yêu cầu đăng nhập)</Link>
  </div>
);

function MainApp() {
  return (
    <Routes>
      {/* Route cho trang Login, không dùng layout chung */}
      <Route path="/login" element={<LoginForm />} />

      <Route element={<LayoutADMIN />}>
        <Route path="/" element={<Home />} />

        {/* Bảo vệ route Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stations" element={<ChargingStations />} />
          <Route path="/users" element={<User />} />
          <Route path="/incidents" element={<IncidentManagement />} />
          <Route path="/settings" element={<ChargingRates />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default MainApp;
