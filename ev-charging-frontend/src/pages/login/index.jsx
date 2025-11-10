import React, { useState } from "react";
import { Form, Input, Button, Card, Divider, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FaGoogle, FaGithub } from "react-icons/fa";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/accountSlice";

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await api.post("account/login", values);
      const { token, role } = response.data;
      localStorage.setItem("token", token);

      const responseUser = await api.get("/profile/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(responseUser.data));
      dispatch(login(response.data));

      if (role === "ADMIN") navigate("/admin");
      else if (role === "STAFF") navigate("/staff");
      else if (role === "USER") navigate("/driver");
      else navigate("/");
    } catch (e) {
      console.error(e);
      message.error("Login failed. Please try again.");
      toast.warning("Login failed!!!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* ✅ Background */}
      <div className="absolute inset-0 z-0 bg-[url('https://cdn.motor1.com/images/mgl/Xkpmb/s1/zipcharge-go.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
          }}
          bodyStyle={{ padding: 28 }}
        >
          <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
              <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                ⚡
              </div>
            </div>
            <h2 className="text-2xl font-bold">Trạm Sạc Xe Điện</h2>
            <p className="text-gray-500">
              Đăng nhập để truy cập hệ thống quản lý sạc xe
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email là bắt buộc" },
                {
                  validator(_, value) {
                    return !value || validateEmail(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error("Email không hợp lệ"));
                  },
                },
              ]}
            >
              <Input
                placeholder="Nhập địa chỉ email"
                type="email"
                prefix={<MailOutlined />}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Mật khẩu là bắt buộc" },
                { min: 8, message: "Mật khẩu ít nhất 8 ký tự" },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                style={{ backgroundColor: "#000", borderColor: "#000" }}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>

            {/* 🔹 Nút Đăng ký */}
            <Form.Item style={{ textAlign: "center", marginTop: "8px" }}>
              <span style={{ fontSize: "14px", color: "#555" }}>
                Chưa có tài khoản?{" "}
                <a
                  onClick={() => navigate("/register")}
                  style={{
                    fontWeight: "600",
                    color: "#000",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Đăng ký
                </a>
              </span>
            </Form.Item>

            <div className="text-center mt-3">
              <a
                className="text-sm text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </a>
            </div>

            <div className="text-center mt-4">
              <span className="text-gray-600">Chưa có tài khoản? </span>
              <a
                className="text-blue-600 hover:underline font-medium cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
