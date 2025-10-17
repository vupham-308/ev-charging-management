
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../admin/userADMIN.css";

const Users = () => {
    const [showModal, setShowModal] = useState(false);

    const users = [
        {
            id: 1,
            name: "Nguyễn Văn Nam",
            email: "nam.nguyen@email.com",
            role: "Tài xế",
            sessions: 45,
            spent: "13.067.500 VND",
        },
        {
            id: 2,
            name: "Trần Thị Hoa",
            email: "hoa.tran@tram.com",
            role: "Quản lý",
            sessions: 30,
            spent: "8.540.000 VND",
        },
        {
            id: 3,
            name: "Lê Minh Tuấn",
            email: "tuan.le@tram.com",
            role: "Quản lý",
            sessions: 18,
            spent: "4.230.000 VND",
        },
        {
            id: 4,
            name: "Phạm Thị Mai",
            email: "mai.pham@email.com",
            role: "Tài xế",
            sessions: 23,
            spent: "5.394.000 VND",
        },
    ];

    return (


        <div >

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Quản Lý Người Dùng</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                </button>
            </div>

            <div className="users-admin-page">


                <div className="users-header">
                    <div>
                        <h3 className="section-title">Quản lý người dùng</h3>
                        <p className="section-desc">
                            Tất cả người dùng — Quản lý người dùng hệ thống và phân quyền
                        </p>
                    </div>

                </div>

                {/* Danh sách người dùng */}
                <div className="users-list">
                    {users.map((u) => (
                        <div key={u.id} className="user-card">
                            <div className="user-info">
                                {/* <div className="user-avatar">
                                    {u.name
                                        .split(" ")
                                        .slice(-2)
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase()}
                                </div> */}
                                <div>
                                    <div className="user-name">
                                        {u.name}{" "}
                                        <span
                                            className={`badge ${u.role === "Tài xế"
                                                ? "driver"
                                                : u.role === "Quản lý"
                                                    ? "manager"
                                                    : ""
                                                }`}
                                        >
                                            {u.role}
                                        </span>
                                    </div>
                                    <div className="user-email">{u.email}</div>
                                    <div className="user-meta">
                                        {u.sessions} phiên sạc · {u.spent} đã chi
                                    </div>
                                </div>
                            </div>
                            <div className="user-actions">
                                <button className="btn-icon edit">
                                    <i className="fa-solid fa-pen"></i> Sửa
                                </button>
                                <button className="btn-icon delete">
                                    <i className="fa-solid fa-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Phần gói đăng ký */}
                <div className="subscription-section">
                    <h3 className="section-title">Gói đăng ký</h3>
                    <p className="section-desc">Quản lý gói giá và đăng ký</p>

                    <div className="plan-grid">
                        <div className="plan-card free">
                            <div className="plan-header">
                                <div>
                                    <h4>Gói cơ bản</h4>
                                    <p className="price">Miễn phí</p>
                                </div>
                                <span className="plan-count">1.847 người dùng</span>
                            </div>
                            <ul>
                                <li>Trả theo sử dụng</li>
                                <li>Giá tiêu chuẩn</li>
                                <li>Hỗ trợ cơ bản</li>
                            </ul>
                            <button className="btn-secondary">Chỉnh sửa gói</button>
                        </div>

                        <div className="plan-card premium">
                            <div className="plan-header">
                                <div>
                                    <h4>Gói cao cấp</h4>
                                    <p className="price">689.000 VND/tháng</p>
                                </div>
                                <span className="plan-count">654 người dùng</span>
                            </div>
                            <ul>
                                <li>Giảm giá 15%</li>
                                <li>Ưu tiên đặt chỗ</li>
                                <li>Báo cáo hàng tháng</li>
                            </ul>
                            <button className="btn-secondary">Chỉnh sửa gói</button>
                        </div>

                        <div className="plan-card business">
                            <div className="plan-header">
                                <div>
                                    <h4>Gói doanh nghiệp</h4>
                                    <p className="price">2.299.000 VND/tháng</p>
                                </div>
                                <span className="plan-count">346 người dùng</span>
                            </div>
                            <ul>
                                <li>Giảm giá 25%</li>
                                <li>Hỗ trợ riêng</li>
                                <li>Bảng điều khiển phân tích</li>
                            </ul>
                            <button className="btn-secondary">Chỉnh sửa gói</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popup thêm người dùng */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h4><i className="fa-solid fa-user-plus"></i> Tạo tài khoản mới</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <p className="modal-desc">Tạo tài khoản cho nhân viên hoặc tài xế mới</p>

                        <form className="modal-form">
                            <label>Họ và tên <span>*</span></label>
                            <input type="text" placeholder="Nguyễn Văn A" />

                            <label>Email <span>*</span></label>
                            <input type="email" placeholder="nguyenvana@email.com" />

                            <label>Số điện thoại</label>
                            <input type="tel" placeholder="+84-123-456789" />

                            <label>Vai trò <span>*</span></label>
                            <select defaultValue="">
                                <option value="" disabled>Chọn vai trò</option>
                                <option value="driver">Tài xế</option>
                                <option value="manager">Quản lý trạm</option>
                                <option value="admin">Quản trị viên</option>
                            </select>

                            <label>Mật khẩu <span>*</span></label>
                            <div className="password-field">
                                <input type="password" placeholder="Nhập mật khẩu" />
                                <i className="fa-solid fa-eye"></i>
                            </div>

                            <p className="note">
                                <strong>Lưu ý:</strong> Mật khẩu sẽ được hiển thị sau khi tạo tài khoản thành công.
                                Hãy ghi lại và chuyển cho người dùng.
                            </p>

                            <div className="modal-actions">
                                <button type="submit" className="btn primary">Tạo tài khoản</button>
                                <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
