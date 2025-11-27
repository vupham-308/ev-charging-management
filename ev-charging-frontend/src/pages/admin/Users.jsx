import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../admin/userADMIN.css";
import api from "../../config/axios";
import { message, Spin, Modal } from "antd";

const Users = () => {
  // Tăng zIndex lên rất cao (ví dụ: 1 tỷ) để hiển thị trên cả tiện ích trình duyệt
  const [messageApi, contextHolder] = message.useMessage({
    zIndex: 1000000001,
  });

  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [search, setSearch] = useState("");

  // Modal create/edit
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Modal delete
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // FORM values
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // REGEX
  const nameRegex = /^[\p{L}\s]{3,50}$/u;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // FETCH USER LIST
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("admin/users");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setUsers(sorted);
      setAllUsers(sorted);
    } catch {
      messageApi.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("admin/users/user-stats");
      setStats(res.data);
    } catch {
      messageApi.error("Không thể tải thống kê!");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // SEARCH
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

  // DELETE
  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setSubmitLoading(true);
    try {
      await api.delete(`admin/users/${selectedUserId}`);
      messageApi.success("Xóa người dùng thành công!");

      // Cập nhật state cục bộ thay vì tải lại toàn bộ
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUserId));
      setAllUsers((prevAllUsers) =>
        prevAllUsers.filter((u) => u.id !== selectedUserId)
      );

      await fetchStats(); // Chỉ tải lại thống kê
    } catch (e) {
      messageApi.error(e.response?.data?.message || "Xóa thất bại!");
    } finally {
      setSubmitLoading(false);
      setShowConfirm(false);
      setSelectedUserId(null);
    }
  };

  // EDIT
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

  // Realtime validation
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
        else {
          const existed = allUsers.find(
            (u) =>
              u.email.toLowerCase() === value.toLowerCase() &&
              (!isEdit || u.id !== editUser.id)
          );
          if (existed) error = "Email đã tồn tại!";
        }
        break;

      case "phone":
        if (value && !phoneRegex.test(value))
          error = "Số điện thoại không hợp lệ";
        else if (value) {
          const existed = allUsers.find(
            (u) => u.phone === value && (!isEdit || u.id !== editUser.id)
          );
          if (existed) error = "SĐT đã tồn tại!";
        }
        break;

      case "role":
        if (!value) error = "Vui lòng chọn vai trò";
        break;

      case "password":
        if (!isEdit && !passwordRegex.test(value))
          error =
            "Mật khẩu phải ≥ 8 ký tự, gồm chữ hoa, chữ thường, số & ký tự đặc biệt!";
        break;
      default:
        break;
    }

    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanValue = value;
    if (name === "phone") cleanValue = value.replace(/\D/g, "").slice(0, 10);
    // handleChange
    if (name === "fullName") cleanValue = value; // Không loại bỏ gì cả

    if (name === "email") cleanValue = value.trim();

    setFormValues((prev) => ({ ...prev, [name]: cleanValue }));
    validateField(name, cleanValue);
  };

  // Validate all before submit
  const validateAll = () => {
    const errors = {};

    if (!nameRegex.test(formValues.fullName))
      errors.fullName = "Họ tên không hợp lệ";

    if (!emailRegex.test(formValues.email)) errors.email = "Email không hợp lệ";
    else {
      const existed = allUsers.find(
        (u) =>
          u.email.toLowerCase() === formValues.email.toLowerCase() &&
          (!isEdit || u.id !== editUser?.id)
      );
      if (existed) errors.email = "Email đã tồn tại!";
    }

    if (formValues.phone) {
      if (!phoneRegex.test(formValues.phone)) errors.phone = "SĐT không hợp lệ";
      else {
        const existed = allUsers.find(
          (u) =>
            u.phone === formValues.phone && (!isEdit || u.id !== editUser?.id)
        );
        if (existed) errors.phone = "SĐT đã tồn tại!";
      }
    }

    if (!formValues.role) errors.role = "Vui lòng chọn vai trò";

    if (!isEdit && !passwordRegex.test(formValues.password))
      errors.password =
        "Mật khẩu phải ≥ 8 ký tự, gồm chữ hoa, thường, số & ký tự đặc biệt!";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      messageApi.warning("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setSubmitLoading(true);

    try {
      let res;
      if (isEdit) {
        const payload = {
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phone,
          role: formValues.role,
        };

        res = await api.put(
          `admin/users/admin-update-user/${editUser.id}`,
          payload
        );

        messageApi.success("Cập nhật thành công!");
      } else {
        const payload = {
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phone,
          role: formValues.role,
          password: formValues.password,
        };

        res = await api.post("admin/users/create-user", payload);

        messageApi.success("Tạo người dùng thành công!");
      }

      // Cập nhật state cục bộ thay vì tải lại toàn bộ
      const newUser = { ...res.data, ...formValues }; // Giả sử API trả về user đã update/tạo

      if (isEdit) {
        // Sửa user trong danh sách
        setUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? { ...u, ...newUser } : u))
        );
        setAllUsers((prev) =>
          prev.map((u) => (u.id === editUser.id ? { ...u, ...newUser } : u))
        );
      } else {
        // Thêm user mới vào đầu danh sách (theo id giảm dần)
        setUsers((prev) => [
          { ...newUser, id: res.data.id || Date.now() },
          ...prev,
        ]);
        setAllUsers((prev) => [
          { ...newUser, id: res.data.id || Date.now() },
          ...prev,
        ]);
      }

      setFormValues({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      });

      setTimeout(() => setShowModal(false), 200);

      setIsEdit(false);
      // await fetchUsers(); // Không cần gọi lại fetchUsers nữa
      await fetchStats(); // Chỉ tải lại thống kê
    } catch (e) {
      // Đảm bảo không có alert() ở đây
      messageApi.error(e.response?.data?.message || "Lỗi khi tạo/cập nhật!");
    } finally {
      setSubmitLoading(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="users-admin-page loading">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <>
      {/* CONTEXT HOLDER PHẢI LUÔN Ở VỊ TRÍ CAO NHẤT */}
      {contextHolder}

      <div className="users-admin-page">
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

        {/* SEARCH */}
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
                <div>Email: {u.email}</div>
                <div>Phone: {u.phone}</div>
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

        {/* MODAL TẠO/CHỈNH SỬA (Sử dụng Ant Design Modal để tránh lỗi z-index) */}
        <Modal
          title={isEdit ? "Chỉnh sửa" : "Tạo tài khoản mới"}
          open={showModal}
          onCancel={() => setShowModal(false)}
          // Vì form có nút hành động riêng, ta bỏ footer mặc định của antd
          footer={null}
        >
          <form className="modal-form" onSubmit={handleSubmit}>
            {/* Ho Ten */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/* Role */}
            <label>Vai trò *</label>
            <select
              name="role"
              value={formValues.role}
              onChange={handleChange}
              className={formErrors.role ? "error" : ""}
            >
              <option value="">Chọn vai trò</option>
              <option value="USER">Tài xế</option>
              <option value="STAFF">Nhân viên trạm</option>
              <option value="ADMIN">Admin</option>
            </select>
            {formErrors.role && (
              <div className="error-text">{formErrors.role}</div>
            )}

            {/* PASSWORD */}
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
        </Modal>

        {/* CONFIRM DELETE (Ant Design Modal) */}
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
    </>
  );
};

export default Users;
