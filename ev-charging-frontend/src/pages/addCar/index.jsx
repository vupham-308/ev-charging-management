import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, InputNumber, Button, Form, message } from "antd";
import { toast } from "react-toastify";
import {
  FaCar,
  FaPalette,
  FaHashtag,
  FaBatteryHalf,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../../config/axios";

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

      toast.success("🚗 Thêm xe thành công!");
      message.success("✅ Xe mới đã được thêm!");
      navigate("/driver/myCar", { state: { newCar: response.data } });
    } catch (error) {
      console.error("❌ Lỗi khi thêm xe:", error);
      message.error("Không thể thêm xe. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-6">
      <Card
        title={
          <span className="text-xl font-semibold text-blue-600 flex items-center gap-2">
            <FaCar /> Thêm xe mới
          </span>
        }
        bordered={false}
        className="w-full max-w-lg rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white"
      >
        <Form
          layout="vertical"
          onFinish={handleAddCar}
          autoComplete="off"
          className="mt-3"
        >
          {/* Hãng xe */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaCar className="text-blue-500" /> Hãng xe
              </span>
            }
            name="brand"
            rules={[{ required: true, message: "Vui lòng nhập hãng xe!" }]}
          >
            <Input placeholder="VD: VinFast VF8, BMW i4..." size="large" />
          </Form.Item>

          {/* Màu sắc */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaPalette className="text-pink-500" /> Màu sắc
              </span>
            }
            name="color"
            rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
          >
            <Input placeholder="VD: Trắng, Xanh, Đỏ..." size="large" />
          </Form.Item>

          {/* Biển số xe */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaHashtag className="text-indigo-500" /> Biển số xe
              </span>
            }
            name="licensePlate"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe!" }]}
          >
            <Input placeholder="VD: 59A-12345" size="large" />
          </Form.Item>

          {/* Nút hành động */}
          <Form.Item className="text-right mt-8">
            <Button
              icon={<FaArrowLeft />}
              onClick={() => navigate("/driver/myCar")}
              className="px-5 py-2 rounded-lg border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 mr-3"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium"
            >
              Thêm xe
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ManageAddCar;
