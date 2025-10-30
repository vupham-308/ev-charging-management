import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../admin/userADMIN.css";
import api from "../../config/axios";
import { message, Spin, Modal } from "antd";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    // 🔴 Modal xác nhận xóa
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // 🟢 Lấy danh sách người dùng
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("admin/users");
            setUsers(res.data);
        } catch (error) {
            console.error("❌ Lỗi tải danh sách người dùng:", error);
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
            console.error("❌ Lỗi tải thống kê người dùng:", error);
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
            console.error("❌ Lỗi tìm kiếm:", error);
            message.error("Không thể tìm kiếm người dùng!");
        }
    };

    // 🗑 Nhấn nút Xóa
    const handleDeleteClick = (id) => {
        console.log("🟠 Nhấn nút xóa ID:", id);
        setSelectedUserId(id);
        setShowConfirm(true);
    };

    // ✅ Thực hiện xóa người dùng
    const confirmDelete = async () => {
        console.log("🟢 Xác nhận xóa người dùng ID:", selectedUserId);
        setLoading(true);
        try {
            const res = await api.delete(`admin/users/${selectedUserId}`);
            console.log("📡 Kết quả API:", res);

            if (res.status === 200 || res.status === 204) {
                message.success("Xóa người dùng thành công!");
                await fetchUsers();
                await fetchStats();
            } else {
                message.error("Xóa người dùng thất bại!");
            }
        } catch (error) {
            console.error("❌ Lỗi khi xóa người dùng:", error.response || error);
const errMsg = error.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng!";
            message.error(errMsg);
        } finally {
            setShowConfirm(false);
            setSelectedUserId(null);
            setLoading(false);
        }
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
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Quản Lý Người Dùng</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                </button>
            </div>

            <br />

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
                {users.length === 0 ? (
                    <div className="no-users">Không có người dùng nào.</div>
                ) : (
                    users.map((u) => (
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
                                <button
                                    className="btn-icon delete"
                                    onClick={() => handleDeleteClick(u.id)}
                                >
                                    <i className="fa-solid fa-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

          {/* Popup thêm người dùng */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h4>
                                <i className="fa-solid fa-user-plus"></i> Tạo tài khoản mới
                            </h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <p className="modal-desc">Tạo tài khoản cho nhân viên hoặc tài xế mới</p>

                        <form
                            className="modal-form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target;
                                const newUser = {
                                    fullName: form.fullName.value.trim(),
                                    email: form.email.value.trim(),
                                    phone: form.phone.value.trim(),
                                    role: form.role.value,
                                    password: form.password.value,
                                    active: true,
                                    enabled: true,
                                };

                                if (!newUser.fullName || !newUser.email || !newUser.role || !newUser.password) {
                                    message.warning("Vui lòng nhập đầy đủ thông tin bắt buộc!");
                                    return;
                                }

                                try {
                                    setLoading(true);
                                    const res = await api.post("admin/users/create-user", newUser);
                                    if (res.status === 200 || res.status === 201) {
                                        message.success("Tạo người dùng thành công!");
                                        form.reset();
                                        setShowModal(false);
                                        await fetchUsers();
                                        await fetchStats();
                                    } else {
                                        message.error("Không thể tạo người dùng!");
                                    }
                                } catch (error) {
                                    console.error("❌ Lỗi khi tạo người dùng:", error);
                                    const errMsg = error.response?.data?.message || "Lỗi khi tạo người dùng!";
                                    message.error(errMsg);
                                } finally {
                                    setLoading(false);
}
                            }}
                        >
                            <label>
                                Họ và tên <span>*</span>
                            </label>
                            <input type="text" name="fullName" placeholder="Nguyễn Văn A" />

                            <label>
                                Email <span>*</span>
                            </label>
                            <input type="email" name="email" placeholder="nguyenvana@email.com" />

                            <label>Số điện thoại</label>
                            <input type="tel" name="phone" placeholder="+84-123-456789" />

                            <label>
                                Vai trò <span>*</span>
                            </label>
                            <select name="role" defaultValue="">
                                <option value="" disabled>
                                    Chọn vai trò
                                </option>
                                <option value="USER">Tài xế</option>
                                <option value="STAFF">Quản lý</option>
                            </select>

                            <label>
                                Mật khẩu <span>*</span>
                            </label>
                            <div className="password-field">
                                <input type="password" name="password" placeholder="Nhập mật khẩu" />
                            </div>

                            <p className="note">
                                <strong>Lưu ý:</strong> Mật khẩu sẽ được hiển thị sau khi tạo tài khoản thành công.
                                Hãy ghi lại và chuyển cho người dùng.
                            </p>

                            <div className="modal-actions">
                                <button type="submit" className="btn primary">
                                    Tạo tài khoản
                                </button>
                                <button
                                    type="button"
                                    className="btn secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔥 Modal xác nhận xóa */}
            <Modal
                visible={showConfirm}
                title="Xác nhận xóa người dùng"
                onOk={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
            </Modal>
        </div>
    );
};

export default Users;
