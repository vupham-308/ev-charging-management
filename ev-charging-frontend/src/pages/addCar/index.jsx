import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Form, message, Select } from "antd";
import { toast } from "react-toastify";
import { FaCar, FaPalette, FaHashtag, FaArrowLeft } from "react-icons/fa";
import api from "../../config/axios";

const ManageAddCar = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Option } = Select;

  // 🔥 Lấy danh sách brand từ API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/car-branch/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setBrands(res.data); // Lưu vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hãng xe:", error);
        message.error("Không thể tải hãng xe!");
      }
    };

    fetchBrands();
  }, []);

  const handleAddCar = async (values) => {
    const { brand, color, licensePlate } = values;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/cars",
        { brand, color, licensePlate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Thêm xe thành công!");
      message.success("Xe mới đã được thêm!");
      navigate("/driver/myCar", { state: { newCar: response.data } });
    } catch (error) {
      console.error("❌ Lỗi khi thêm xe:", error);
      message.error("Không thể thêm xe. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { name: "Trắng", value: "Trắng", hex: "#ffffff", border: "#e2e8f0" },
    { name: "Đen", value: "Đen", hex: "#111827" },
    { name: "Xanh Navy", value: "Xanh Navy", hex: "#1e3a8a" },
    { name: "Bạc", value: "Bạc", hex: "#cbd5e1" },
    { name: "Đỏ", value: "Đỏ", hex: "#dc2626" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-6">
      <Card
        title={
          <span className="text-xl font-semibold text-blue-600 flex items-center gap-2">
            <FaCar /> Thêm xe mới
          </span>
        }
        bordered={false}
        className="w-full max-w-lg rounded-2xl shadow-md bg-white"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCar}
          className="mt-3"
        >
          {/* 🔥 Hãng xe lấy từ API */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaCar className="text-blue-500" /> Hãng xe
              </span>
            }
            name="brand"
            rules={[{ required: true, message: "Vui lòng chọn hãng xe!" }]}
          >
            <Select
              placeholder="Chọn hãng xe"
              size="large"
              showSearch
              loading={brands.length === 0}
            >
              {brands.map((item) => (
                <Option key={item.id} value={item.brand}>
                  {item.brand}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Màu sắc */}
          <Form.Item
            label={
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaPalette className="text-pink-500" /> Màu sắc
              </span>
            }
            name="color"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
          >
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue, setFieldsValue }) => {
                const currentColor = getFieldValue("color");
                return (
                  <div>
                    <Input
                      placeholder="VD: Trắng, Đen, Xanh Navy..."
                      size="large"
                      value={currentColor || ""}
                      onChange={(e) =>
                        setFieldsValue({ color: e.target.value })
                      }
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      {colors.map((c) => (
                        <div
                          key={c.value}
                          title={c.name}
                          onClick={() => setFieldsValue({ color: c.value })}
                          className={`w-8 h-8 rounded-full cursor-pointer 
                          ${
                            currentColor === c.value
                              ? "ring-2 ring-black scale-110"
                              : ""
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            border: `2px solid ${c.border || "#cbd5e1"}`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              }}
            </Form.Item>
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

          {/* Nút bấm */}
          <Form.Item className="text-right mt-8">
            <Button
              icon={<FaArrowLeft />}
              onClick={() => navigate("/driver/myCar")}
              className="px-5 py-2 mr-3"
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="px-6 py-2"
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
