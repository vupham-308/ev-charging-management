import React, { useState } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/accountSlice";

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setIsLoading(true);
    setServerError("");

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

      const errorMsg =
        typeof e.response?.data === "string"
          ? e.response.data
          : e.response?.data?.message ||
            e.response?.data?.error ||
            "❌ Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!";

      setServerError(errorMsg);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* BACKGROUND */}
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
            <p className="text-gray-500">Đăng nhập để truy cập hệ thống quản lý sạc xe</p>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            {/* EMAIL */}
            <Form.Item
              name="email"
              label="Email đăng nhập"
              rules={[
                { required: true, message: "Vui lòng nhập email đăng nhập!" },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ, vui lòng nhập đúng định dạng!",
                },
              ]}
            >
              <Input
                placeholder="Nhập email của bạn"
                size="large"
                prefix={<MailOutlined className="text-gray-400" />}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* PASSWORD */}
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                {
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                  message:
                    "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                size="large"
                prefix={<LockOutlined className="text-gray-400" />}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* SERVER ERROR */}
            {serverError && (
              <Alert
                message={serverError}
                type="error"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              style={{
                backgroundColor: "#000",
                borderColor: "#000",
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

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
