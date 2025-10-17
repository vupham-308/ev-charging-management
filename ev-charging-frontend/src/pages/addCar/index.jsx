import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, InputNumber, Button, Form, message } from "antd";
import { CarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";

const ManageAddCar = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddCar = async (values) => {
    const { brand, color, licensePlate, initBattery } = values;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/cars",
        { brand, color, initBattery, licensePlate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Thêm xe thành công:", response.data);
      toast.success("Thêm xe thành công");
      message.success("✅ Xe mới đã được thêm!");
      navigate("/driver/myCar", { state: { newCar: response.data } });
    } catch (error) {
      console.error("❌ Lỗi khi thêm xe:", error);
      message.error("❌ Không thể thêm xe. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Card
        title={
          <span style={{ fontSize: "1.3rem" }}>
            <CarOutlined style={{ color: "#1890ff" }} /> Thêm xe mới
          </span>
        }
        bordered={false}
        style={{
          maxWidth: 600,
          margin: "0 auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/driver/myCar")}
          >
            Quay lại
          </Button>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleAddCar}
          autoComplete="off"
          style={{ marginTop: "10px" }}
        >
          {/* Hãng xe */}
          <Form.Item
            label="🚘 Hãng xe"
            name="brand"
            rules={[{ required: true, message: "Vui lòng nhập hãng xe!" }]}
          >
            <Input placeholder="VD: VinFast VF8, BMW i4..." />
          </Form.Item>

          {/* Màu sắc */}
          <Form.Item
            label="🎨 Màu sắc"
            name="color"
            rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
          >
            <Input placeholder="VD: Trắng, Xanh, Đỏ..." />
          </Form.Item>

          {/* Biển số xe */}
          <Form.Item
            label="🚗 Biển số xe"
            name="licensePlate"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe!" }]}
          >
            <Input placeholder="VD: 59A-12345" />
          </Form.Item>

          {/* Mức pin */}
          <Form.Item
            label="🔋 Mức pin khởi tạo (%)"
            name="initBattery"
            initialValue={100}
            rules={[
              { required: true, message: "Vui lòng nhập mức pin!" },
              { type: "number", min: 0, max: 100, message: "0–100%" },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              placeholder="Nhập phần trăm pin ban đầu"
            />
          </Form.Item>

          {/* Nút hành động */}
          <Form.Item style={{ textAlign: "right", marginTop: "20px" }}>
            <Button
              type="default"
              onClick={() => navigate("/driver/myCar")}
              style={{ marginRight: "10px" }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm xe
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ManageAddCar;
