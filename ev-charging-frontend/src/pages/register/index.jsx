import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^0\d{9,10}$/.test(phone);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await api.post("account/register", values);
      toast.success("✅ Đăng ký tài khoản thành công!");
      navigate("/login");
      console.log(response);
    } catch {
      message.error("❌ Đăng ký thất bại, vui lòng thử lại!");
      toast.warning("Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-4">
        <Card
          className="backdrop-blur-sm"
          style={{ borderRadius: 16 }}
          bodyStyle={{ padding: 24 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Tạo tài khoản mới</h2>
            <p className="text-gray-500">Chỉ mất một phút để hoàn tất.</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              gender: "MALE",
              agree: false,
            }}
            requiredMark={false}
          >
            <Row gutter={16}>
              {/* Họ và tên */}
              <Col span={24}>
                <Form.Item
                  label={
                    <>
                      Họ và tên <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                    {
                      validator: (_, v) =>
                        v && v.trim()
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Họ và tên không được để trống!")
                            ),
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập họ và tên"
                    prefix={<UserOutlined />}
                    allowClear
                  />
                </Form.Item>
              </Col>

              {/* Số điện thoại */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <>
                      Số điện thoại <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      validator: (_, v) =>
                        !v || validatePhone(v)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Số điện thoại phải bắt đầu bằng 0 và gồm 10–11 chữ số!"
                              )
                            ),
                    },
                  ]}
                >
                  <Input
                    placeholder="Ví dụ: 09xxxxxxxx"
                    prefix={<PhoneOutlined />}
                    inputMode="numeric"
                    maxLength={11}
                    allowClear
                  />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <>
                      Email <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ email!" },
                    {
                      validator: (_, v) =>
                        !v || validateEmail(v)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Vui lòng nhập email hợp lệ!")
                            ),
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
              </Col>

              {/* Mật khẩu */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <>
                      Mật khẩu <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    {
                      min: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự!",
                    },
                    {
                      pattern:
                        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                      message:
                        "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu (ít nhất 8 ký tự, gồm A-z, 0-9, ký tự đặc biệt)"
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
              </Col>

              {/* Xác nhận mật khẩu */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <>
                      Xác nhận mật khẩu <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="confirmPassword"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
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
                    placeholder="Nhập lại mật khẩu"
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
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
                {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </Form.Item>

            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-500">
                Đăng nhập
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
