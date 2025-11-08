import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { ArrowLeftOutlined, LockOutlined, NumberOutlined } from "@ant-design/icons";
import { useResetPassword } from "./hooks/useResetPassword";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";
  const { resetPassword, loading } = useResetPassword();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await resetPassword({ ...values, email });
      message.success("✅ Mật khẩu của bạn đã được đặt lại thành công!");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "❌ Đặt lại mật khẩu thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[url('https://cdn.motor1.com/images/mgl/Xkpmb/s1/zipcharge-go.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

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
            style={{ marginBottom: 8, paddingLeft: 0, color: "#000", fontWeight: 500 }}
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
