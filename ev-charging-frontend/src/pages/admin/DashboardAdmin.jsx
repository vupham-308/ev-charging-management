import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../admin/DashboardAdmin.css";
import api from "../../config/axios";
import { Spin, message } from "antd";

const Dashboard = () => {
  const [stationStats, setStationStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [topStations, setTopStations] = useState([]); // 🟢 Dữ liệu từ API thật
  const [loading, setLoading] = useState(true);
  const [ChargerStats, setChargerStats] = useState(null);

  // 🟢 Gọi API thống kê trạm
  const fetchStationStats = async () => {
    try {
      const res = await api.get("station/station-stats");
      setStationStats(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải thống kê trạm sạc!");
    }
  };

  //trụ sạc
  const fetchChargerStats = async () => {
    try {
      const res = await api.get("chargerPoint/charger-point-stats");
      setChargerStats(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải thống kê trạm sạc!");
    }
  };

  // 🟢 Gọi API thống kê người dùng
  const fetchUserStats = async () => {
    try {
      const res = await api.get("admin/users/user-stats");
      setUserStats(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải thống kê người dùng!");
    }
  };

  // 🟢 Gọi API doanh thu tháng
  const fetchTotalRevenue = async () => {
    try {
      const res = await api.get("station/admin/total-revenue-month");
      setRevenue(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải doanh thu tháng!");
    }
  };

  // 🟢 Gọi API top doanh thu trạm sạc
  const fetchTopStations = async () => {
    try {
      const res = await api.get("station/top-revenue");
      setTopStations(res.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải top doanh thu trạm sạc!");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStationStats(),
        fetchUserStats(),
        fetchTotalRevenue(),
        fetchTopStations(),
        fetchChargerStats(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h3 className="section-title">Tổng quan</h3>

      {/* ---- Summary Cards ---- */}
      <div className="cards-grid">
        {/* Tổng trạm */}
        <div className="card">
          <div className="card-info">
            <h4>Tổng số trạm</h4>
            <h2>{stationStats?.totalStations ?? 0}</h2>
            <p>
              {stationStats?.activeStations ?? 0} hoạt động,{" "}
              {stationStats?.inactiveStations ?? 0} ngưng hoạt động
            </p>
          </div>
          <div className="card-icon blue">
            <i className="fa-solid fa-building"></i>
          </div>
        </div>

        {/* Tổng trụ sạc (chưa có API) */}
        <div className="card">
          <div className="card-info">
            <h4>Tổng số trụ sạc</h4>
            <h2>{ChargerStats?.totalPoints ?? 0}</h2>
            <p>
              {ChargerStats?.availablePoints ?? 0} hoạt động,{" "}
              {ChargerStats?.occupiedPoints ?? 0} ngưng hoạt động
            </p>{" "}
          </div>
          <div className="card-icon yellow">
            <i className="fa-solid fa-bolt"></i>
          </div>
        </div>

        {/* Tổng người dùng */}
        <div className="card">
          <div className="card-info">
            <h4>Tổng người dùng</h4>
            <h2>{userStats?.totalUsers ?? 0}</h2>
            <p>
              {userStats?.drivers ?? 0} tài xế, {userStats?.staffs ?? 0} nhân
              viên, {userStats?.admins ?? 0} quản trị viên
            </p>
          </div>
          <div className="card-icon purple">
            <i className="fa-solid fa-users"></i>
          </div>
        </div>

        {/* Doanh thu tháng */}
        <div className="card">
          <div className="card-info">
            <h4>Doanh thu tháng</h4>
            <h2>
              {revenue ? `${revenue.toLocaleString("vi-VN")} VND` : "0 VND"}
            </h2>
          </div>
          <div className="card-icon green">
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
        </div>
      </div>

      {/* ---- Lower Panels ---- */}
      <div className="bottom-grid">
        {/* Tình trạng trạm */}
        <div className="panel">
          <h4>Tình trạng trạm sạc</h4>
          <p>Phân bố trạng thái các trạm trong hệ thống</p>
          <div className="status-item">
            <span className="dot active"></span>
            Hoạt động{" "}
            <span className="count">{stationStats?.activeStations ?? 0}</span>
          </div>
          <div className="status-item">
            <span className="dot maintenance"></span>
            Ngưng hoạt động{" "}
            <span className="count">{stationStats?.inactiveStations ?? 0}</span>
          </div>
        </div>

        {/* Phân bố người dùng */}
        <div className="panel">
          <h4>Người dùng theo vai trò</h4>
          <p>Phân bố người dùng trong hệ thống</p>
          <div className="role-card driver">
            <i className="fa-solid fa-user"></i> Tài xế{" "}
            <span>{userStats?.drivers ?? 0}</span>
          </div>
          <div className="role-card manager">
            <i className="fa-solid fa-user-gear"></i> Nhân viên{" "}
            <span>{userStats?.staffs ?? 0}</span>
          </div>
          <div className="role-card admin">
            <i className="fa-solid fa-user-shield"></i> Quản trị{" "}
            <span>{userStats?.admins ?? 0}</span>
          </div>
        </div>
      </div>

      {/* ---- Top Stations ---- */}
      <div className="panel top-stations">
        <h4>Top trạm sạc theo doanh thu</h4>

        <div className="station-list">
          {topStations.length > 0 ? (
            topStations.map((s, index) => (
              <div key={s.stationId} className="station-item">
                <div className="station-left">
                  <div className="station-rank">{index + 1}</div>
                  <div className="station-info">
                    <h5>{s.stationName}</h5>
                    <span>{s.address}</span>
                  </div>
                </div>
                <div className="station-right">
                  <span className="revenue">
                    {s.totalRevenue.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>Không có dữ liệu doanh thu.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
