import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Card } from "antd";
import { useVerifyEmail } from "./hooks/useVerifyEmail";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";
  const { verifyEmail, loading, error } = useVerifyEmail();
  const [otp, setOtp] = useState("");

  const onFinish = async () => {
    try {
      await verifyEmail({ email, otp });
      message.success("✅ Xác thực thành công!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      message.error(error || "❌ Mã xác thực không hợp lệ hoặc đã hết hạn!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="Xác thực email"
        style={{ width: 400, textAlign: "center" }}
        bordered={false}
      >
        <p>
          Mã OTP đã được gửi tới email: <b>{email}</b>
        </p>
        <Form onFinish={onFinish}>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Xác thực
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default VerifyEmail;
