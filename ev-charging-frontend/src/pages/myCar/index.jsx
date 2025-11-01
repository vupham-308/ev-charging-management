import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Progress,
  message,
  Spin,
  Empty,
  Tooltip,
  Tag,
} from "antd";
import {
  CarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BgColorsOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const ManageMyCar = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isChildRoute = location.pathname !== "/driver/myCar";

  const fetchCars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setCars(result);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách xe:", error);
      if (error.response?.status === 403) {
        message.error("Bạn không có quyền truy cập hoặc token đã hết hạn!");
      } else {
        message.error("Không thể tải danh sách xe!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (location.state?.updated) {
      fetchCars();
      navigate("/driver/myCar", { replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.newCar) {
      setCars((prevCars) => {
        const exists = prevCars.some(
          (car) => car.id === location.state.newCar.id
        );
        if (!exists) return [...prevCars, location.state.newCar];
        return prevCars;
      });
    }
  }, [location.state]);

  const handleAddCar = () => navigate("/driver/myCar/addCar");
  const handleEditCar = (id) => navigate(`/driver/myCar/editCar/${id}`);
  const handleDeleteCar = (id) => navigate(`/driver/myCar/deleteCar/${id}`);

  if (isChildRoute) return <Outlet />;

  // 🌈 Token màu đơn tính
  const token = {
    bg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textMain: "#0F172A",
    textSub: "#475569",
    border: "#E2E8F0",
    accent: "#1E293B",
  };

  // 🌡️ Màu gradient pin theo mức
  const getBatteryColor = (percent) => {
    if (percent >= 80) return "#16a34a"; // xanh lá
    if (percent >= 40) return "#facc15"; // vàng
    return "#ef4444"; // đỏ
  };

  return (
    <div
      style={{
        backgroundColor: token.bg,
        minHeight: "100vh",
        padding: "40px 60px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: token.accent,
            color: "white",
            padding: "18px 28px",
            borderRadius: 16,
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          }}
        >
          <CarOutlined style={{ fontSize: 28 }} />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
              Xe của tôi
            </h2>
            <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
              Quản lý thông tin xe điện bạn sở hữu
            </p>
          </div>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCar}
          style={{
            backgroundColor: token.accent,
            borderRadius: 12,
            height: 44,
            fontWeight: 600,
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          }}
        >
          Thêm xe
        </Button>
      </div>

      {/* Danh sách xe */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : cars.length === 0 ? (
        <Empty
          description={<span>Chưa có xe nào trong danh sách</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 80 }}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // ✅ chỉ 2 xe mỗi hàng
            gap: "28px",
          }}
        >
          {cars.map((car) => (
            <Card
              key={car.id}
              hoverable
              style={{
                borderRadius: 16,
                border: `1px solid ${token.border}`,
                background: token.cardBg,
                boxShadow: "0 6px 14px rgba(15, 23, 42, 0.05)",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              bodyStyle={{ padding: 24 }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* Icon góc trên */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: token.accent,
                  opacity: 0.1,
                  fontSize: 64,
                }}
              >
                <CarOutlined />
              </div>

              {/* Nội dung xe */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    color: token.textMain,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <CarOutlined /> {car.brand || "Tên xe"}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <BgColorsOutlined style={{ color: token.textSub }} />
                    <span style={{ color: token.textSub }}>
                      Màu: <b>{car.color || "Không rõ"}</b>
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <NumberOutlined style={{ color: token.textSub }} />
                    <span style={{ color: token.textSub }}>
                      Biển số: <b>{car.licensePlate || "Chưa có"}</b>
                    </span>
                  </div>
                </div>

                {/* Pin */}
                <div
                  style={{
                    color: token.textMain,
                    fontWeight: 500,
                    marginTop: 20,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <ThunderboltOutlined /> Mức pin
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <Progress
                    percent={car.initBattery || 0}
                    showInfo={false}
                    strokeColor={getBatteryColor(car.initBattery || 0)}
                    trailColor="#E2E8F0"
                    style={{ flex: 1 }}
                  />
                  <Tag
                    color={getBatteryColor(car.initBattery || 0)}
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 6,
                    }}
                  >
                    {car.initBattery || 0}%
                  </Tag>
                </div>

                {/* Hành động */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 14, // tăng nhẹ khoảng cách
                    marginTop: 10,
                  }}
                >
                  <Tooltip title="Sửa xe">
                    <Button
                      size="large" // ✅ làm nút to hơn
                      icon={<EditOutlined />}
                      onClick={() => handleEditCar(car.id)}
                      style={{
                        borderRadius: 10,
                        color: token.accent,
                        borderColor: token.accent,
                        padding: "8px 16px", // ✅ tăng kích thước vùng bấm
                        fontWeight: 500,
                      }}
                    >
                      Sửa
                    </Button>
                  </Tooltip>

                  <Tooltip title="Xóa xe">
                    <Button
                      size="large" // ✅ làm nút to hơn
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteCar(car.id)}
                      style={{
                        borderRadius: 10,
                        backgroundColor: "#DC2626",
                        borderColor: "#DC2626",
                        color: "white",
                        padding: "8px 16px", // ✅ tăng kích thước vùng bấm
                        fontWeight: 500,
                      }}
                    >
                      Xóa
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMyCar;
