import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../admin/userADMIN.css";
import api from "../../config/axios";
import { message, Spin, Modal } from "antd";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal create/edit
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editUser, setEditUser] = useState(null);

    // Modal confirm delete
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Input values & errors for realtime validation
    const [formValues, setFormValues] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState({});

    // Regex validate
    const nameRegex = /^[A-Za-zÀ-ỹ\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    // Fetch users & stats
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("admin/users");
            setUsers(res.data);
            setAllUsers(res.data);
        } catch (error) {
            console.error("❌ Lỗi tải danh sách người dùng:", error);
            message.error("Không thể tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

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

    // Search FE
    const handleSearch = (keyword) => {
        setSearch(keyword);
        if (!keyword.trim()) {
            setUsers(allUsers);
            return;
        }
        const filtered = allUsers.filter(
            (u) =>
                u.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
                u.email.toLowerCase().includes(keyword.toLowerCase()) ||
                u.phone?.toLowerCase().includes(keyword.toLowerCase())
        );
        setUsers(filtered);
    };

    // Delete user
    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            const res = await api.delete(`admin/users/${selectedUserId}`);
if (res.status === 200 || res.status === 204) {
                message.success("Xóa người dùng thành công!");
                await fetchUsers();
                await fetchStats();
            } else {
                message.error("Xóa người dùng thất bại!");
            }
        } catch (error) {
            console.error("❌ Lỗi khi xóa người dùng:", error.response || error);
            const errMsg =
                error.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng!";
            message.error(errMsg);
        } finally {
            setShowConfirm(false);
            setSelectedUserId(null);
            setLoading(false);
        }
    };

    // Edit click
    const handleEditClick = (user) => {
        setEditUser(user);
        setIsEdit(true);
        setFormValues({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
            password: "",
        });
        setFormErrors({});
        setShowModal(true);
    };

    // Realtime validate single field
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "fullName":
                if (!value.trim()) error = "Họ tên không được để trống";
                else if (!nameRegex.test(value))
                    error =
                        "Họ tên chỉ bao gồm chữ và khoảng trắng (3-50 ký tự)";
                break;
            case "email":
                if (!value.trim()) error = "Email không được để trống";
                else if (!emailRegex.test(value)) error = "Email không hợp lệ";
                break;
            case "phone":
                if (value && !phoneRegex.test(value))
                    error = "SĐT phải gồm 10 số và bắt đầu bằng 0";
                break;
            case "role":
                if (!value) error = "Vui lòng chọn vai trò";
                break;
            case "password":
                if (!isEdit) {
                    if (!value) error = "Mật khẩu không được để trống";
                    else if (!passwordRegex.test(value))
                        error =
                            "Mật khẩu tối thiểu 6 ký tự, phải có ít nhất 1 chữ và 1 số";
                }
                break;
            default:
                break;
        }
        setFormErrors((prev) => ({ ...prev, [name]: error }));
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Chặn ký tự không hợp lệ
        let cleanValue = value;
        if (name === "phone") cleanValue = value.replace(/\D/g, "").slice(0, 10);
        if (name === "fullName") cleanValue = value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
        if (name === "email") cleanValue = value.replace(/\s/g, "");

        setFormValues((prev) => ({ ...prev, [name]: cleanValue }));
        validateField(name, cleanValue);
    };
// Validate all fields before submit
    const validateAll = () => {
        Object.keys(formValues).forEach((key) =>
            validateField(key, formValues[key])
        );
        return !Object.values(formErrors).some((e) => e);
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate all fields
        validateAll();
        if (Object.values(formErrors).some((e) => e)) {
            message.warning("Vui lòng sửa các lỗi trước khi gửi");
            return;
        }

        try {
            setLoading(true);
            if (isEdit && editUser) {
                const updateData = {
                    fullName: formValues.fullName,
                    email: formValues.email,
                    phone: formValues.phone,
                    role: formValues.role,
                    active: true,
                };
                const res = await api.put(
                    `admin/users/admin-update-user/${editUser.id}`,
                    updateData
                );
                message.success("Cập nhật người dùng thành công!");
                setUsers((prev) =>
                    prev.map((u) => (u.id === editUser.id ? { ...u, ...updateData } : u))
                );
                setAllUsers((prev) =>
                    prev.map((u) => (u.id === editUser.id ? { ...u, ...updateData } : u))
                );
            } else {
                const res = await api.post("admin/users/create-user", formValues);
                const newUser = {
                    id: res.data?.id || Date.now(),
                    fullName: formValues.fullName,
                    email: formValues.email,
                    phone: formValues.phone,
                    role: formValues.role,
                    active: true,
                };
                message.success("Tạo người dùng thành công!");
                setUsers((prev) => [newUser, ...prev]);
                setAllUsers((prev) => [newUser, ...prev]);
            }

            setShowModal(false);
            setIsEdit(false);
            setEditUser(null);
            setFormValues({
                fullName: "",
                email: "",
                phone: "",
                role: "",
                password: "",
            });
            setFormErrors({});
            await fetchStats();
        } catch (error) {
            console.error("❌ Lỗi khi tạo/cập nhật người dùng:", error);
            const errMsg =
                error.response?.data?.message || "Lỗi khi tạo/cập nhật người dùng!";
            message.error(errMsg);
        } finally {
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
            <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
                <h1>Quản Lý Người Dùng</h1>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setIsEdit(false);
                        setEditUser(null);
                        setFormValues({ fullName: "", email: "", phone: "", role: "", password: "" });
                        setFormErrors({});
                        setShowModal(true);
                    }}
                >
                    <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                </button>
            </div>

            <br />

            {/* Search */}
            <input
                type="text"
                className="search-inputt"
                placeholder="🔍 Tìm kiếm người dùng theo tên, email, SĐT..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />

            {/* User list */}
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
                                <button className="btn-icon edit" onClick={() => handleEditClick(u)}>
                                    <i className="fa-solid fa-pen"></i> Sửa
                                </button>
<button className="btn-icon delete" onClick={() => handleDeleteClick(u.id)}>
                                    <i className="fa-solid fa-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal create/edit */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h4>
                                <i className="fa-solid fa-user-plus"></i>{" "}
                                {isEdit ? "Chỉnh sửa người dùng" : "Tạo tài khoản mới"}
                            </h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form className="modal-form" onSubmit={handleSubmit}>
                            <label>
                                Họ và tên <span>*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formValues.fullName}
                                onChange={handleChange}
                                className={formErrors.fullName ? "error" : ""}
                            />
                            {formErrors.fullName && <div className="error-text">{formErrors.fullName}</div>}

                            <label>
                                Email <span>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                                className={formErrors.email ? "error" : ""}
                            />
                            {formErrors.email && <div className="error-text">{formErrors.email}</div>}

                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formValues.phone}
                                onChange={handleChange}
                                className={formErrors.phone ? "error" : ""}
                            />
                            {formErrors.phone && <div className="error-text">{formErrors.phone}</div>}

                            <label>
                                Vai trò <span>*</span>
                            </label>
                            <select
name="role"
                                value={formValues.role}
                                onChange={handleChange}
                                className={formErrors.role ? "error" : ""}
                            >
                                <option value="">Chọn vai trò</option>
                                <option value="USER">Tài xế</option>
                                <option value="STAFF">Quản lý</option>
                            </select>
                            {formErrors.role && <div className="error-text">{formErrors.role}</div>}

                            {!isEdit && (
                                <>
                                    <label>
                                        Mật khẩu <span>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        className={formErrors.password ? "error" : ""}
                                    />
                                    {formErrors.password && (
                                        <div className="error-text">{formErrors.password}</div>
                                    )}
                                </>
                            )}

                            <div className="modal-actions">
                                <button type="submit" className="btn primary">
                                    {isEdit ? "Cập nhật" : "Tạo tài khoản"}
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

            {/* Confirm delete */}
            <Modal
                open={showConfirm}
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