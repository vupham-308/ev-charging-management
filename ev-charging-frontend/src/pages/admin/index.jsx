import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import axios from "axios";

const API_BASE_URL = "http://222.255.214.35:8080/api";

const tabConfig = [
  { label: "Tổng quan", path: "/admin/dashboardadmin" },
  { label: "Trạm sạc", path: "/admin/stations" },
  { label: "Người dùng", path: "/admin/users" },
  { label: "Quản lý sự cố", path: "/admin/incidents" },
  { label: "Cài đặt", path: "/admin/settings" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Cập nhật tab đang active
  useEffect(() => {
    const matched = tabConfig.find((tab) => location.pathname === tab.path);
    if (matched) setActiveTab(matched.label);
  }, [location.pathname]);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Mở popup đổi mật khẩu
  const handleChangePassword = () => setIsModalOpen(true);

  // Đóng popup
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Gọi API đổi mật khẩu
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_BASE_URL}/profile/update-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "text",
          transformResponse: [(data) => data],
        }
      );

      // Nếu API trả 200 → thành công
      if (res.status === 200) {
        message.success("✅ Cập nhật mật khẩu thành công!");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        // Những status khác → lỗi
        message.error("❌ Đổi mật khẩu thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      // Nếu request ném lỗi (400, 500, network…) → hiện thông báo lỗi
      message.error("❌ Đổi mật khẩu thất bại, vui lòng kiểm tra lại!");
      console.error("Lỗi đổi mật khẩu:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
<header className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold">🚀 Admin Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700">Xin chào, Quản trị viên!</span>

          {/*  Nút đổi mật khẩu */}
          <Button type="default" onClick={handleChangePassword}>
            Đổi mật khẩu
          </Button>

          {/*  Nút đăng xuất */}
          <Button type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-white mt-2 shadow">
        {tabConfig.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label);
              navigate(tab.path);
            }}
            className={`flex-1 py-3 font-medium border-b-2 ${activeTab === tab.label
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Nội dung */}
      <main className="p-6">
        <div className="bg-white p-6 rounded shadow text-gray-700">
          <Outlet />
        </div>
      </main>

      {/*  Modal Đổi mật khẩu */}
      <Modal
        title={
          <span className="font-semibold text-lg">
            <LockOutlined /> Đổi mật khẩu
          </span>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đổi mật khẩu"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <p className="text-gray-500 mb-2">
          Thay đổi mật khẩu để bảo mật tài khoản của bạn
        </p>

        <Form layout="vertical" form={form}>
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message:
                  "Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              iconRender={(visible) =>
visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu mới"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          {/* Hiển thị các điều kiện */}
          <div className="text-sm text-gray-500 mb-4">
            <p>Yêu cầu mật khẩu:</p>
            <ul className="list-disc list-inside">
              <li>Ít nhất 8 ký tự</li>
              <li>Ít nhất 1 chữ cái viết hoa (A-Z)</li>
              <li>Ít nhất 1 chữ cái viết thường (a-z)</li>
              <li>Ít nhất 1 chữ số (0-9)</li>
            </ul>
          </div>


        </Form>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
