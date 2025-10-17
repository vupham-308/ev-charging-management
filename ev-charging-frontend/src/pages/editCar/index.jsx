import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, message, Input, InputNumber } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const ManageEditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [initBattery, setInitBattery] = useState(100);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy thông tin xe cần chỉnh sửa
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get(`/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const car = response.data;
        setBrand(car.brand);
        setColor(car.color);
        setLicensePlate(car.licensePlate);
        setInitBattery(car.initBattery);
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin xe:", error);
        message.error("Không thể tải thông tin xe!");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // ✅ Gửi yêu cầu cập nhật
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    if (!brand || !color || !licensePlate) {
      message.warning("⚠️ Vui lòng nhập đầy đủ thông tin xe!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/cars/${id}`,
        { brand, color, licensePlate, initBattery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("✅ Cập nhật xe thành công!");
      navigate("/driver/myCar", { state: { updated: true } });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật xe:", error);
      message.error("❌ Không thể cập nhật xe. Vui lòng thử lại sau.");
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
          <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
            🛠️ Chỉnh sửa xe
          </span>
        }
        bordered={false}
        style={{
          maxWidth: 600,
          marginLeft: "80px", // 👈 Căn thẻ card sang trái
          textAlign: "left", // 👈 Căn trái toàn bộ nội dung
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <form onSubmit={handleUpdateCar} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">🚘 Hãng xe</label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Nhập hãng xe..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🎨 Màu sắc</label>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ví dụ: Trắng, Đen, Xanh..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🚗 Biển số xe</label>
            <Input
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="VD: 51A-123.45"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              🔋 Mức pin khởi tạo (%)
            </label>
            <InputNumber
              min={0}
              max={100}
              value={initBattery}
              onChange={(value) => setInitBattery(value)}
              className="w-full"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/driver/myCar")}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ManageEditCar;
