import React, { useEffect, useState } from "react";
import "./incident.css";
import { Spin, message, Select } from "antd";
import api from "../../config/axios";

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("staff");
  const [filterStatus, setFilterStatus] = useState("ALL");

  //  Gọi 1 API duy nhất
  const fetchIncidents = async () => {
    try {
      const res = await api.get("problem/admin/getAllResolve");
      setIncidents(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách sự cố!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // 🧠 Lọc theo role + trạng thái
  const filteredIncidents = incidents.filter((inc) => {
    const isStaff = inc.user?.role === "STAFF";
    const isUser = inc.user?.role === "USER";
    const matchTab = activeTab === "staff" ? isStaff : isUser;
    const matchStatus = filterStatus === "ALL" || inc.status === filterStatus;
    return matchTab && matchStatus;
  });

  // 🎨 Màu trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case "SOLVED":
        return "resolved";
      case "IN_PROGRESS":
        return "processing";
      case "PENDING":
        return "waiting";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SOLVED":
        return "Đã giải quyết";
      case "IN_PROGRESS":
        return "Đang xử lý";
      case "PENDING":
        return "Đang chờ";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div
        className="incident-page"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="incident-page">
      <h2>Quản lý sự cố</h2>
      <p className="section-desc">
        Theo dõi và xử lý sự cố được gửi bởi nhân viên và khách hàng
      </p>

      {/* Tabs */}
      <div className="tab-container">
        <button
          className={activeTab === "staff" ? "tab active" : "tab"}
          onClick={() => setActiveTab("staff")}
        >
          Từ nhân viên
        </button>
        <button
          className={activeTab === "customer" ? "tab active" : "tab"}
          onClick={() => setActiveTab("customer")}
        >
          Từ khách hàng
        </button>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <label>Lọc theo trạng thái: </label>
        <Select
          value={filterStatus}
          style={{ width: 200 }}
          onChange={(val) => setFilterStatus(val)}
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "PENDING", label: "Đang chờ" },
            { value: "IN_PROGRESS", label: "Đang xử lý" },
            { value: "SOLVED", label: "Đã giải quyết" },
          ]}
        />
      </div>

      {/* Danh sách sự cố */}
      <div className="incident-list">
        {filteredIncidents.length === 0 ? (
          <p className="no-data">Không có sự cố nào phù hợp.</p>
        ) : (
          filteredIncidents.map((inc) => (
            <div key={inc.id} className="incident-card">
              <div className="incident-header">
                <div className="incident-id">
                  <i className="fa-solid fa-triangle-exclamation"></i> #{inc.id}
                  <span className={`status ${getStatusClass(inc.status)}`}>
                    {getStatusText(inc.status)}
                  </span>
                </div>
                <div className="incident-date">
                  📅 {new Date(inc.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="incident-body">
                <h4>{inc.title}</h4>
                <p>{inc.description}</p>

                {inc.station && (
                  <p className="location">
                    <i className="fa-solid fa-location-dot"></i>{" "}
                    {inc.station.name} — {inc.station.address}
                  </p>
                )}

                {inc.user && (
                  <p className="reporter">
                    Báo cáo bởi: <strong>{inc.user.fullName}</strong> (
                    {inc.user.role === "STAFF" ? "Nhân viên" : "Khách hàng"})
                  </p>
                )}

                {inc.response && (
                  <p className="response">
                    💬 Phản hồi: <em>{inc.response}</em>
                  </p>
                )}
                {inc.solvedAt && (
                  <p className="resolved">
                    ✅ Hoàn tất:{" "}
                    {new Date(inc.solvedAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentManagement;
