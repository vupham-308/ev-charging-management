import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
<<<<<<< HEAD
import "./userADMIN.css";
=======
import "../admin/userADMIN.css";
>>>>>>> e5ea23daca85bb868f7845ff164d33be427eecc0
import api from "../../config/axios";
import { message, Spin, Modal } from "antd";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    // 🟢 Lấy danh sách người dùng
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("admin/users");
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    // 🧮 Lấy thống kê
    const fetchStats = async () => {
        try {
            const res = await api.get("admin/users/user-stats");
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, []);

    // 🔍 Tìm kiếm người dùng
    const handleSearch = async (keyword) => {
        setSearch(keyword);
        if (!keyword.trim()) {
            fetchUsers();
            return;
        }

        try {
            const res = await api.get(`admin/users/search?name=${encodeURIComponent(keyword)}`);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            message.error("Không thể tìm kiếm người dùng!");
        }
    };

    // 🗑 Xóa người dùng
    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc muốn xóa người dùng này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await api.delete(`admin/users/${id}`);
                    message.success("Đã xóa người dùng thành công!");
                    fetchUsers();
                    fetchStats();
                } catch (error) {
                    console.error(error);
                    message.error("Xóa người dùng thất bại!");
                }
            },
        });
    };

    if (loading) {
        return (
            <div className="users-admin-page loading">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div className="users-admin-page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Quản Lý Người Dùng</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
<i className="fa-solid fa-user-plus"></i> Thêm người dùng
                </button>
            </div>

            <br></br>
            {/* Ô tìm kiếm */}
            <input
                type="text"
                className="search-inputt"
                placeholder="🔍 Tìm kiếm người dùng theo tên..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Danh sách người dùng */}
            <div className="users-list">
                {users.map((u) => (
                    <div key={u.id} className="user-card">
                        <div className="user-info">
                            <div>
                                <div className="user-name">
                                    {u.fullName}{" "}
                                    <span
                                        className={`badge ${u.role === "USER"
                                            ? "driver"
                                            : u.role === "STAFF"
                                                ? "manager"
                                                : u.role === "ADMIN"
                                                    ? "admin"
                                                    : ""
                                            }`}
                                    >
                                        {u.role}
                                    </span>
                                </div>
                                <div className="user-email">{u.email}</div>
                                <div className="user-meta">📞 {u.phone}</div>
                            </div>
                        </div>
                        <div className="user-actions">
                            <button className="btn-icon edit">
                                <i className="fa-solid fa-pen"></i> Sửa
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(u.id)}>
                                <i className="fa-solid fa-trash"></i> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popup thêm người dùng (chưa kết nối API) */}
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
                                <option value="USER">Tài xế</option>
                                <option value="STAFF">Nhân viên</option>
                                <option value="ADMIN">Quản trị viên</option>
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