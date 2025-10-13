import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../admin/DashboardAdmin.css'

const Dashboard = () => {
    // Dữ liệu mẫu cho bảng Top trạm sạc
    const topStations = [
        {
            id: 1,
            name: "Sân bay Tân Sơn Nhất",
            address: "Sân bay Tân Sơn Nhất, Quận Tân Bình, TP.HCM",
            revenue: "79.48M VND",
        },
        {
            id: 2,
            name: "Trạm nghỉ cao tốc Long Thành",
            address: "Cao tốc TP.HCM - Long Thành, Đồng Nai",
            revenue: "53.82M VND",
        },
        {
            id: 3,
            name: "Trung tâm thương mại Vincom",
            address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
            revenue: "28.67M VND",
        },
        {
            id: 4,
            name: "Ga Metro Bến Thành",
            address: "456 Lê Lợi, Quận 1, TP.HCM",
            revenue: "13.04M VND",
        },
    ];

    return (
        <div className="dashboard-container">
            <h3 className="section-title">Tổng quan</h3>

            {/* ---- Summary Cards ---- */}
            <div className="cards-grid">
                <div className="card">

                    <div className="card-info">
                        <h4>Tổng số trạm</h4>
                        <h2>4</h2>
                        <p>3 hoạt động, 1 bảo trì</p>
                    </div>
                    <div className="card-icon blue">
                        <i className="fa-solid fa-building"></i>
                    </div>
                </div>

                <div className="card">

                    <div className="card-info">
                        <h4>Tổng số trụ sạc</h4>
                        <h2>44</h2>
                        <p>18 sẵn sàng, 21 đang sử dụng</p>
                    </div>
                    <div className="card-icon yellow">
                        <i className="fa-solid fa-bolt"></i>
                    </div>
                </div>

                <div className="card">

                    <div className="card-info">
                        <h4>Tổng người dùng</h4>
                        <h2>4</h2>
                        <p>2 tài xế, 2 quản lý</p>
                    </div>
                    <div className="card-icon purple">
                        <i className="fa-solid fa-users"></i>
                    </div>
                </div>

                <div className="card">

                    <div className="card-info">
                        <h4>Doanh thu tháng</h4>
                        <h2>3350.5M</h2>
                        <p className="increase">+12.5% so với tháng trước</p>
                    </div>
                    <div className="card-icon green">
                        <i className="fa-solid fa-dollar-sign"></i>
                    </div>
                </div>
            </div>

            {/* ---- Lower Panels ---- */}
            <div className="bottom-grid">
                <div className="panel">
                    <h4>Tình trạng trạm sạc</h4>
                    <p>Phân bố trạng thái các trạm trong hệ thống</p>
                    <div className="status-item">
                        <span className="dot active"></span>Hoạt động <span className="count">3</span>
                    </div>
                    <div className="status-item">
                        <span className="dot maintenance"></span>Bảo trì <span className="count">1</span>
                    </div>
                </div>

                <div className="panel">
                    <h4>Người dùng theo vai trò</h4>
                    <p>Phân bố người dùng trong hệ thống</p>
                    <div className="role-card driver">
                        <i className="fa-solid fa-user"></i> Tài xế <span>2</span>
                    </div>
                    <div className="role-card manager">
                        <i className="fa-solid fa-user-gear"></i> Quản lý trạm <span>2</span>
                    </div>
                </div>
            </div>

            {/* ---- Top Stations ---- */}
            <div className="panel top-stations">
                <h4>Top trạm sạc theo doanh thu</h4>
                <p>5 trạm có doanh thu cao nhất hôm nay</p>
                <div className="station-list">
                    {topStations.map((s) => (
                        <div key={s.id} className="station-item">
                            <div className="station-left">
                                <div className="station-rank">{s.id}</div>
                                <div className="station-info">
                                    <h5>{s.name}</h5>
                                    <span>{s.address}</span>
                                </div>
                            </div>
                            <div className="station-right">
                                <span className="revenue">{s.revenue}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
