import React, { useContext, useState } from "react";
import { Form, Input, Button, Card, Typography, Space, message } from "antd";
import { ThunderboltOutlined, UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import AuthContext from "../contexts/AuthContext";
import "./LoginForm.css";
import AppFooter from "../pages/AppFooter";
const { Title, Text, Link } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { doLogin } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    const result = await doLogin(values.email, values.password);
    if (!result.success) {
      message.error(result.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <ThunderboltOutlined className="login-icon" />
            <Title level={4}>Trạm Sạc Xe Điện</Title>
            <Text type="secondary">Đăng nhập để truy cập hệ thống quản lý sạc xe</Text>
          </div>

          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Email!",
                },
                {
                  type: "email",
                  message: "Email không đúng định dạng!",
                },
              ]}
            >
              <Input placeholder="Nhập địa chỉ email" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="login-links">
            <Link href="#" className="forgot-password">
              Quên mật khẩu?
            </Link>
            <Text>
              Chưa có tài khoản? <Link href="#">Đăng ký</Link>
            </Text>
          </div>

          <div className="demo-accounts-info">
            <Text strong>Tài khoản demo:</Text>
            <Text><MailOutlined /> Driver: driver@demo.com</Text>
            <Text><UserOutlined /> Staff: manager@demo.com</Text>
            <Text><UserOutlined /> Admin: admin@demo.com</Text>
            <Text><LockOutlined /> Mật khẩu: 123456</Text>
          </div>
        </Card>
      </div>

      <AppFooter />
    </div>
  );
};

export default LoginForm;