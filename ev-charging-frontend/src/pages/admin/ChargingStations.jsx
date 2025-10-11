import React from "react";
import "./cssAdmin/ChargingStations.css";

const stations = [
    {
        name: "Sân bay Tân Sơn Nhất",
        address: "Sân bay Tân Sơn Nhất, Quận Tân Bình, TP.HCM",
        status: "Đang bảo trì",
        color: "red",
        ready: 8,
        using: 10,
        maintenance: 2,
        total: 20,
        revenue: "79.484.000 VND",
    },
    {
        name: "Trạm nghỉ cao tốc Long Thành",
        address: "Cao tốc TP.HCM - Long Thành, Đồng Nai",
        status: "Hoạt động",
        color: "green",
        ready: 6,
        using: 5,
        maintenance: 1,
        total: 12,
        revenue: "53.820.000 VND",
    },
    {
        name: "Trung tâm thương mại Vincom",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        status: "Hoạt động",
        color: "green",
        ready: 3,
        using: 4,
        maintenance: 1,
        total: 8,
        revenue: "28.670.000 VND",
    },
    {
        name: "Ga Metro Bến Thành",
        address: "456 Lê Lợi, Quận 1, TP.HCM",
        status: "Hoạt động",
        color: "green",
        ready: 1,
        using: 2,
        maintenance: 1,
        total: 4,
        revenue: "13.041.000 VND",
    },
];

const ChargingStations = () => {
    return (
        <div className="stations-page">
            <div className="stations-header">
                <h3>Trạm sạc</h3>
                <button className="btn add">+ Thêm trạm mới</button>
            </div>

            <input
                className="search-inputt"
                type="text"
                placeholder="🔍 Tìm kiếm trạm sạc theo tên, địa chỉ hoặc mã..."
            />

            <div className="stations-list">
                {stations.map((s, i) => (
                    <div key={i} className="station-card">
                        {/* Bên trái */}
                        <div className="station-left">
                            {/* Dòng 1: Tên + trạng thái */}
                            {/* Bọc chung tên + trạng thái và nút vào 1 hàng */}
                            <div className="station-header-actions">
                                <div className="station-header">
                                    <h4>{s.name}</h4>
                                    <span className={`status-text ${s.color}`}>
                                        {s.status}
                                    </span>
                                </div>

                                <div className="station-actions">
                                    <button>👁 Xem</button>
                                    <button>✏️ Sửa</button>
                                    <button>🗑 Xóa</button>
                                </div>
                            </div>

                            {/* Dòng 2: Địa chỉ */}
                            <p className="station-address">📍 {s.address}</p>

                            {/* Dòng 3: Thống kê */}
                            <div className="station-stats">
                                <div className="stat green">
                                    {s.ready}
                                    <span>Có sẵn</span>
                                </div>
                                <div className="stat orange">
                                    {s.using}
                                    <span>Đang sử dụng</span>
                                </div>
                                <div className="stat red">
                                    {s.maintenance}
                                    <span>Bảo trì</span>
                                </div>
                                <div className="stat total">
                                    {s.total}
                                    <span>Tổng cộng</span>
                                </div>
                            </div>

                            {/* Dòng 4: Doanh thu */}
                            <p className="revenue">
                                Doanh thu hôm nay: <b>{s.revenue}</b>
                            </p>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChargingStations;
