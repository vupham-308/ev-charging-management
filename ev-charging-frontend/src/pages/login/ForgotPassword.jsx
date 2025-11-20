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
  const [isFilled, setIsFilled] = useState(false);

  const onFinish = async ({ email }) => {
    try {
      await sendEmail(email);
      message.success("✅ Mã xác thực đã được gửi đến email của bạn!");
    } catch (error) {
      console.log("📌 ERROR RAW:", error);

      const errorMsg = error.response?.data || error.message || "";
      
      // ❌ Nguyên bản: chỉ báo lỗi chung, không suggest đăng ký
      message.error(errorMsg || "❌ Gửi mã xác thực thất bại!");
    }
  };

  // Nếu gửi email thành công → chuyển Reset Password
  useEffect(() => {
    if (emailSent && email) {
      navigate("/reset-password", { state: { email } });
    }
  }, [emailSent, email, navigate]);

  const handleEmailChange = (e) => {
    setIsFilled(e.target.value.trim().length > 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://cdn.motor1.com/images/mgl/Xkpmb/s1/zipcharge-go.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Card */}
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
            onClick={() => navigate("/login")}
            style={{
              marginBottom: 8,
              paddingLeft: 0,
              color: "#000",
              fontWeight: 500,
            }}
          >
            Quay lại
          </Button>

          <div className="text-center mb-3">
            <Title
              level={4}
              style={{ marginBottom: 4, fontWeight: 600, color: "#000" }}
            >
              Quên mật khẩu
            </Title>
            <Text style={{ color: "#6b7280" }}>
              Nhập địa chỉ email của bạn để nhận mã xác thực
            </Text>
          </div>

          <div className="flex justify-center mb-4 mt-2">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MailOutlined style={{ fontSize: 26, color: "#000" }} />
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label={<span style={{ fontWeight: 500 }}>Địa chỉ email</span>}
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Định dạng email không hợp lệ!" },
              ]}
            >
              <Input
                placeholder="Nhập địa chỉ email của bạn"
                size="large"
                prefix={<MailOutlined className="text-gray-400" />}
                onChange={handleEmailChange}
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
                backgroundColor: isFilled ? "#000" : "#6b7280",
                borderColor: isFilled ? "#000" : "#6b7280",
                borderRadius: 8,
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Đang gửi mã xác thực..." : "Gửi mã xác thực"}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
