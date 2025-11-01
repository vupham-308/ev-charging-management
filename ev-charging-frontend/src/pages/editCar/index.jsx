import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, message, Input, InputNumber, Spin, Tooltip } from "antd";
import {
  FiArrowLeftCircle,
  FiSave,
  FiTruck,
  FiDroplet,
  FiHash,
  FiBatteryCharging,
} from "react-icons/fi";
import api from "../../config/axios";
import { toast } from "react-toastify";

const colorPresets = [
  { name: "Trắng", value: "Trắng", hex: "#ffffff", border: "#e2e8f0" },
  { name: "Đen", value: "Đen", hex: "#111827" },
  { name: "Xanh Navy", value: "Xanh Navy", hex: "#1e3a8a" },
  { name: "Bạc", value: "Bạc", hex: "#cbd5e1" },
  { name: "Đỏ", value: "Đỏ", hex: "#dc2626" },
];

const ManageEditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [initBattery, setInitBattery] = useState(100);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoadingData(true);
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
        setLoadingData(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    if (!brand || !color || !licensePlate) {
      message.warning("⚠️ Vui lòng nhập đầy đủ thông tin xe!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.put(
        `/cars/${id}`,
        { brand, color, licensePlate, initBattery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🚗 Cập nhật xe thành công!");
      navigate("/driver/myCar", { state: { updated: true } });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật xe:", error);
      toast.error("Không thể cập nhật xe. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f9fafb, #e2e8f0)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            <FiTruck size={22} /> Cập nhật thông tin xe
          </div>
        }
        bordered={false}
        style={{
          width: "100%",
          maxWidth: "620px",
          boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
          borderRadius: "18px",
          background: "#ffffff",
          padding: "24px 28px 36px",
        }}
      >
        <form onSubmit={handleUpdateCar}>
          {/* Hãng xe */}
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#334155",
              }}
            >
              <FiTruck /> Hãng xe
            </label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="VD: VinFast, Tesla..."
              size="large"
              style={{
                borderRadius: 10,
                borderColor: "#cbd5e1",
                transition: "all 0.25s",
              }}
            />
          </div>

          {/* Màu sắc */}
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#334155",
              }}
            >
              <FiDroplet /> Màu sắc
            </label>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Trắng, Đen, Xanh navy..."
              size="large"
              style={{
                borderRadius: 10,
                borderColor: "#cbd5e1",
              }}
            />

            {/* Preset màu */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {colorPresets.map((c) => (
                <Tooltip key={c.value} title={c.name}>
                  <div
                    onClick={() => setColor(c.value)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c.hex,
                      border: `2px solid ${
                        color === c.value ? "#0f172a" : c.border || "#cbd5e1"
                      }`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Biển số */}
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#334155",
              }}
            >
              <FiHash /> Biển số xe
            </label>
            <Input
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="VD: 51A-123.45"
              size="large"
              style={{
                borderRadius: 10,
                borderColor: "#cbd5e1",
              }}
            />
          </div>

          {/* Pin */}
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#334155",
              }}
            >
              <FiBatteryCharging /> Mức pin khởi tạo (%)
            </label>
            <InputNumber
              min={0}
              max={100}
              value={initBattery}
              onChange={(value) => setInitBattery(value)}
              size="large"
              style={{
                width: "100%",
                borderRadius: 10,
                borderColor: "#cbd5e1",
              }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "30px",
            }}
          >
            <Button
              icon={<FiArrowLeftCircle />}
              size="large"
              onClick={() => navigate("/driver/myCar")}
              style={{
                borderRadius: 10,
                padding: "8px 18px",
                fontWeight: 500,
              }}
            >
              Quay lại
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<FiSave />}
              loading={loading}
              size="large"
              style={{
                backgroundColor: "#0f172a",
                borderRadius: 10,
                padding: "8px 22px",
                fontWeight: 600,
                boxShadow: "0 3px 10px rgba(15,23,42,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ManageEditCar;
