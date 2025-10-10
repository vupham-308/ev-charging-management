import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./cssAdmin/userADMIN.css";

const Users = () => {
    const users = [
        { id: 1, name: "Nguyễn Văn A", role: "Tài xế", status: "Hoạt động", email: "vana@gmail.com" },
        { id: 2, name: "Trần Thị B", role: "Quản lý trạm", status: "Hoạt động", email: "tranb@gmail.com" },
        { id: 3, name: "Lê Văn C", role: "Tài xế", status: "Tạm khóa", email: "levanc@gmail.com" },
        { id: 4, name: "Phạm D", role: "Quản trị viên", status: "Hoạt động", email: "phamd@gmail.com" },
    ];

    return (
        <div className="users-page">
            <h3 className="section-title">Quản lý người dùng</h3>
            <p className="section-desc">Danh sách người dùng trong hệ thống quản lý trạm sạc</p>

            {/* Thanh hành động */}
            <div className="user-actions">
                <button className="btn primary">
                    <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                </button>
                <input type="text" className="search-input" placeholder="🔍 Tìm kiếm người dùng..." />
            </div>

            {/* Bảng danh sách người dùng */}
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Họ và tên</th>
                        <th>Vai trò</th>
                        <th>Email</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>
                                <span className={`role ${u.role === "Tài xế" ? "driver" : u.role === "Quản lý trạm" ? "manager" : "admin"}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`status ${u.status === "Hoạt động" ? "active" : "inactive"}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td>
                                <button className="action-btn edit"><i className="fa-solid fa-pen"></i></button>
                                <button className="action-btn delete"><i className="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
