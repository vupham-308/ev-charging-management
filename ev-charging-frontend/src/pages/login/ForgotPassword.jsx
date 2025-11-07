import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "./hooks/useForgotPassword";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const { sendEmail, loading, emailSent, email } = useForgotPassword();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async ({ email }) => {
    try {
      await sendEmail(email);
      message.success("✅ Mã xác thực đã được gửi đến email của bạn!");
    } catch (error) {
      message.error(error.message || "❌ Gửi mã xác thực thất bại!");
    }
  };

  // ✅ Chuyển sang trang VerifyEmail sau khi gửi thành công
  useEffect(() => {
    if (emailSent && email) {
      navigate("/verify-email", { state: { email } });
    }
  }, [emailSent, email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://cdn.motor1.com/images/mgl/Xkpmb/s1/zipcharge-go.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Card Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
          }}
          bodyStyle={{ padding: 28 }}
        >
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/login")}
            style={{ marginBottom: 8, paddingLeft: 0 }}
          >
            Quay lại
          </Button>

          <div className="text-center mb-6">
            <Title level={4} style={{ marginBottom: 4 }}>
              Đặt lại mật khẩu
            </Title>
            <Text type="secondary">
              Nhập địa chỉ email của bạn để nhận mã xác thực đặt lại mật khẩu
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Địa chỉ email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                {
                  type: "email",
                  message: "Email không hợp lệ! Vui lòng nhập đúng định dạng.",
                },
              ]}
            >
              <Input
                placeholder="Nhập địa chỉ email của bạn"
                prefix={<MailOutlined className="text-gray-400" />}
                size="large"
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
              Gửi mã xác thực
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
