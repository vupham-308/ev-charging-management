import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import { ArrowLeftOutlined, LockOutlined, NumberOutlined } from "@ant-design/icons";
import { useResetPassword } from "./hooks/useResetPassword";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";
  const { resetPassword, loading } = useResetPassword();
  const [form] = Form.useForm();
  const [serverError, setServerError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockMessage, setLockMessage] = useState(""); 
  const [countdown, setCountdown] = useState(0);

  // useEffect để xử lý đếm ngược khi hết lượt
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && attempts >= 3) {
      navigate("/login");
    }
    return () => clearTimeout(timer);
  }, [countdown, attempts, navigate]);

  const onFinish = async (values) => {
    setServerError("");
    setLockMessage("");

    try {
      await resetPassword({ ...values, email });
      message.success("✅ Mật khẩu của bạn đã được đặt lại thành công!");
      navigate("/login");
    } catch (error) {
      const errorMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            error.response?.data?.error ||
            "❌ Đặt lại mật khẩu thất bại, vui lòng kiểm tra kĩ các thông tin trước khi thử lại!";

      setServerError(errorMsg);

      setAttempts((prev) => {
        const next = prev + 1;

        if (next === 2) {
          // Cảnh báo trước lượt cuối
          setLockMessage("⚠️ Đây là lượt cuối để nhập OTP. Vui lòng kiểm tra email để chắc chắn mã OTP chính xác!");
        } else if (next >= 3) {
          // Hết lượt -> cảnh báo + bắt đầu đếm ngược
          setLockMessage(
            "⚠️ Bạn đã nhập sai OTP quá 3 lần. Trang sẽ tự động quay lại login trong 5 giây."
          );
          setCountdown(5); // bắt đầu đếm ngược
        }

        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://cdn.motor1.com/images/mgl/Xkpmb/s1/zipcharge-go.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/forgot-password")}
            style={{
              marginBottom: 8,
              paddingLeft: 0,
              color: "#000",
              fontWeight: 500,
            }}
          >
            Quay lại
          </Button>

          <div className="text-center mb-6">
            <Title level={4} style={{ marginBottom: 4, fontWeight: 600 }}>
              Đặt lại mật khẩu mới
            </Title>
            <Text style={{ color: "#6b7280" }}>
              Vui lòng nhập mã OTP và mật khẩu mới cho tài khoản <b>{email}</b>
            </Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="otp"
              label="Mã xác thực (OTP)"
              rules={[
                { required: true, message: "Vui lòng nhập mã OTP!" },
                { len: 6, message: "Mã OTP phải gồm 6 ký tự!" },
                { pattern: /^[0-9]+$/, message: "OTP chỉ được chứa số!" },
              ]}
            >
              <Input
                placeholder="Nhập mã OTP gồm 6 chữ số"
                size="large"
                prefix={<NumberOutlined className="text-gray-400" />}
                maxLength={6}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                {
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                  message:
                    "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                prefix={<LockOutlined />}
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu mới"
                prefix={<LockOutlined />}
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {serverError && (
              <Alert
                message={serverError}
                type="error"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}

            {lockMessage && (
              <Alert
                message={countdown > 0 ? `${lockMessage} (${countdown}s)` : lockMessage}
                type={attempts >= 3 ? "warning" : "info"}
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                backgroundColor: "#000",
                borderColor: "#000",
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Đặt lại mật khẩu
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
