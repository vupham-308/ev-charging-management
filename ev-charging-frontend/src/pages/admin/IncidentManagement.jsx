import React, { useState } from "react";
import "../admin/incident.css";

const IncidentManagement = () => {
    const [activeTab, setActiveTab] = useState("employee");

    const employeeIncidents = [
        {
            id: "INC001",
            title: "Sân bay Tân Sơn Nhất - CH003",
            desc: "Trụ sạc không hoạt động - lỗi phần cứng",
            reporter: "Trần Thị Hoa (Nhân viên)",
            status: "Đang xử lý",
            statusColor: "processing",
            reportedDate: "15/01/2024 14:30",
            expected: "16/01/2024 10:00",
        },
        {
            id: "INC002",
            title: "Trung tâm Vincom - CH007",
            desc: "Lỗi thanh toán - không thể xử lý thẻ tín dụng",
            reporter: "Lê Minh Tuấn (Quản lý)",
            status: "Đã giải quyết",
            statusColor: "resolved",
            reportedDate: "15/01/2024 11:15",
            resolvedAt: "15/01/2024 15:20",
        },
        {
            id: "INC003",
            title: "Trạm nghỉ Long Thành - CH015",
            desc: "Hư hỏng cáp sạc - cần thay thế ngay",
            reporter: "Nguyễn Văn Phúc (Nhân viên)",
            status: "Đang xử lý",
            statusColor: "processing",
            reportedDate: "14/01/2024 09:30",
            expected: "15/01/2024 18:00",
        },
    ];

    const customerIncidents = [
        {
            id: "CUS001",
            title: "Trụ sạc không khởi động được",
            desc: "Tôi đã cắm dây nhưng trụ sạc không bắt đầu hoạt động. Màn hình hiển thị lỗi E001.",
            location: "Ga Metro Bến Thành - Trụ #2",
            reporter: "Khách hàng",
            status: "Đang chờ",
            statusColor: "waiting",
            reportedDate: "15/01/2024 16:45",
        },
        {
            id: "CUS002",
            title: "Không thể thanh toán bằng thẻ",
            desc: "App báo lỗi khi tôi chọn thanh toán bằng thẻ tín dụng. Chỉ có thể thanh toán bằng ví điện tử.",
            location: "Trung tâm Vincom - Trụ #5",
            reporter: "Khách hàng",
            status: "Đã giải quyết",
            statusColor: "resolved",
            reportedDate: "15/01/2024 10:20",
            resolvedAt: "15/01/2024 14:30",
        },
        {
            id: "CUS003",
            title: "Cáp sạc bị nóng bất thường",
            desc: "Trong quá trình sạc, cáp trở nên rất nóng và có mùi khét. Tôi đã dừng sạc ngay lập tức.",
            location: "Sân bay Tân Sơn Nhất - Trụ #8",
            reporter: "Khách hàng",
            status: "Đang xử lý",
            statusColor: "processing",
            reportedDate: "14/01/2024 18:15",
        },
    ];

    const incidents = activeTab === "employee" ? employeeIncidents : customerIncidents;

    return (
        <div className="incident-page">
            <h2>Quản lý sự cố</h2>
            <p className="section-desc">
                Theo dõi và xử lý sự cố từ nhân viên và khách hàng
            </p>

            <div className="tab-container">
                <button
                    className={activeTab === "employee" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("employee")}
                >
                    Từ nhân viên ({employeeIncidents.length})
                </button>
                <button
                    className={activeTab === "customer" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("customer")}
                >
                    Từ khách hàng ({customerIncidents.length})
                </button>
            </div>

            <div className="incident-list">
                {incidents.map((inc) => (
                    <div key={inc.id} className="incident-card">
                        <div className="incident-header">
                            <div className="incident-id">
                                <i className="fa-solid fa-triangle-exclamation"></i> {inc.id}
                                <span className={`status ${inc.statusColor}`}>{inc.status}</span>
                                {activeTab === "customer" && <span className="badge">Khách hàng</span>}
                            </div>
                            <div className="incident-header">
                                <div className="incident-date">{inc.reportedDate}</div>
                                <button className="btn-handle">
                                    <i className="fa-solid fa-pen"></i> Xử lý
                                </button>
                            </div>

                        </div>

                        <div className="incident-body">
                            <h4>{inc.title}</h4>
                            <p>{inc.desc}</p>
                            {inc.location && <p className="location">{inc.location}</p>}

                            <div className="incident-header-s">
                                <p className="reporter">Báo cáo bởi: {inc.reporter}</p>
                                <div className="incident-footer">
                                    {inc.expected && (
                                        <p className="expected">
                                            <i className="fa-regular fa-clock"></i> Dự kiến: {inc.expected}
                                        </p>
                                    )}
                                    {inc.resolvedAt && (
                                        <p className="resolved">
                                            <i className="fa-regular fa-circle-check"></i> Đã giải quyết: {inc.resolvedAt}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncidentManagement;
