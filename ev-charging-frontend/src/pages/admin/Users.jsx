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
  const [submitLoading, setSubmitLoading] = useState(false); // 🔥 FIX 1

  const [search, setSearch] = useState("");

  // Modal create/edit
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Modal confirm delete
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Form
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Regex validate
  const nameRegex = /^[A-Za-zÀ-ỹ\s]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  // Load users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("admin/users");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setUsers(sorted);
      setAllUsers(sorted);
    } catch {
      message.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("admin/users/user-stats");
      setStats(res.data);
    } catch {
      message.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Search
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
        u.phone?.includes(keyword)
    );
    setUsers(filtered);
  };

  // Delete
  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setSubmitLoading(true);
    try {
      await api.delete(`admin/users/${selectedUserId}`);
      message.success("Xóa người dùng thành công!");
      await fetchUsers();
      await fetchStats();
    } catch (e) {
      message.error(e.response?.data?.message || "Xóa thất bại!");
    } finally {
      setSubmitLoading(false);
      setShowConfirm(false);
      setSelectedUserId(null);
    }
  };

  // Edit
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

  // Validate 1 field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Họ tên không được để trống";
        else if (!nameRegex.test(value))
          error = "Họ tên chỉ gồm chữ (3-50 ký tự)";
        break;
      case "email":
        if (!emailRegex.test(value)) error = "Email không hợp lệ";
        break;
      case "phone":
        if (value && !phoneRegex.test(value))
          error = "SĐT phải bắt đầu bằng 03, 05, 07, 08, 09 và gồm 10 số";
        break;
      case "role":
        if (!value) error = "Vui lòng chọn vai trò";
        break;
      case "password":
        if (!isEdit && !passwordRegex.test(value))
          error = "Mật khẩu tối thiểu 6 ký tự, gồm chữ & số";
        break;
    }
    setFormErrors((p) => ({ ...p, [name]: error }));
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanValue = value;
    if (name === "phone") cleanValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "fullName") cleanValue = value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
    if (name === "email") cleanValue = value.trim();

    setFormValues((p) => ({ ...p, [name]: cleanValue }));
    validateField(name, cleanValue);
  };

  // Validate all
  const validateAll = () => {
    const errors = {};

    if (!nameRegex.test(formValues.fullName))
      errors.fullName = "Họ tên không hợp lệ";
    if (!emailRegex.test(formValues.email)) errors.email = "Email không hợp lệ";
    if (formValues.phone && !phoneRegex.test(formValues.phone))
      errors.phone = "SĐT không hợp lệ";
    if (!formValues.role) errors.role = "Vui lòng chọn vai trò";

    if (!isEdit) {
      if (!passwordRegex.test(formValues.password))
        errors.password = "Mật khẩu phải ≥6 ký tự, gồm chữ & số";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      message.warning("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setSubmitLoading(true); // 🔥 FIX 2

    try {
      if (isEdit) {
        const payload = {
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phone,
          role: formValues.role,
        };

        await api.put(`admin/users/admin-update-user/${editUser.id}`, payload);

        message.success("Cập nhật thành công!");

        await fetchUsers();
      } else {
        const payload = {
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phone,
          role: formValues.role,
          password: formValues.password, // 🔥 FIX 3 (bắt buộc)
        };

        const res = await api.post("admin/users/create-user", payload);

        message.success("Tạo người dùng thành công!");
        await fetchUsers();
      }

      setShowModal(false);
      setEditUser(null);
      setIsEdit(false);
      setFormValues({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      });
      setFormErrors({});
      fetchStats();
    } catch (e) {
      message.error(e.response?.data?.message || "Lỗi khi tạo/cập nhật!");
    } finally {
      setSubmitLoading(false);
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
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Quản Lý Người Dùng</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setIsEdit(false);
            setFormValues({
              fullName: "",
              email: "",
              phone: "",
              role: "",
              password: "",
            });
            setFormErrors({});
            setShowModal(true);
          }}
        >
          <i className="fa-solid fa-user-plus"></i> Thêm người dùng
        </button>
      </div>

      <input
        className="search-inputt"
        placeholder="🔍 Tìm kiếm..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="users-list">
        {users.map((u) => (
          <div key={u.id} className="user-card">
            <div className="user-info">
              <div className="user-name">
                {u.fullName}{" "}
                <span className={`badge ${u.role.toLowerCase()}`}>
                  {u.role}
                </span>
              </div>
              <div>{u.email}</div>
              <div>📞 {u.phone}</div>
            </div>
            <div className="user-actions">
              <button
                className="btn-icon edit"
                onClick={() => handleEditClick(u)}
              >
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
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>{isEdit ? "Chỉnh sửa" : "Tạo tài khoản mới"}</h4>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✖
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label>Họ tên *</label>
              <input
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                className={formErrors.fullName ? "error" : ""}
              />
              {formErrors.fullName && (
                <div className="error-text">{formErrors.fullName}</div>
              )}

              <label>Email *</label>
              <input
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className={formErrors.email ? "error" : ""}
              />
              {formErrors.email && (
                <div className="error-text">{formErrors.email}</div>
              )}

              <label>Số điện thoại</label>
              <input
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                className={formErrors.phone ? "error" : ""}
              />
              {formErrors.phone && (
                <div className="error-text">{formErrors.phone}</div>
              )}

              <label>Vai trò *</label>
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
              {formErrors.role && (
                <div className="error-text">{formErrors.role}</div>
              )}

              {!isEdit && (
                <>
                  <label>Mật khẩu *</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formValues.password}
                      onChange={handleChange}
                      className={formErrors.password ? "error" : ""}
                    />
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                  {formErrors.password && (
                    <div className="error-text">{formErrors.password}</div>
                  )}
                </>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn primary"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? "Đang xử lý..."
                    : isEdit
                    ? "Cập nhật"
                    : "Tạo tài khoản"}
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

      {/* CONFIRM DELETE */}
      <Modal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onOk={confirmDelete}
        okButtonProps={{ danger: true, loading: submitLoading }}
        title="Xác nhận xóa"
      >
        Bạn có chắc muốn xóa người dùng này?
      </Modal>
    </div>
  );
};

export default Users;
