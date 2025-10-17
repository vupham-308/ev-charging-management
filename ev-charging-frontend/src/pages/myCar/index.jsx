import { useState, useEffect } from "react";
import { Button, Card, Progress, message, Spin } from "antd";
import {
  CarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const ManageMyCar = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Kiểm tra xem có đang ở trang con (add/edit) không
  const isChildRoute = location.pathname !== "/driver/myCar";

  // 🔹 Hàm gọi API lấy danh sách xe
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
      console.log("📦 Dữ liệu xe:", result);
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
        if (!exists) {
          console.log("🆕 Xe mới được thêm:", location.state.newCar);
          return [...prevCars, location.state.newCar];
        }
        return prevCars;
      });
    }
  }, [location.state]);

  // 🔹 Điều hướng
  const handleAddCar = () => navigate("/driver/myCar/addCar");
  const handleEditCar = (id) => navigate(`/driver/myCar/editCar/${id}`);
  const handleDeleteCar = (id) => navigate(`/driver/myCar/deleteCar/${id}`);

  // 🔹 Nếu đang ở trang con
  if (isChildRoute) return <Outlet />;

  // 🔹 Giao diện
  return (
    <div
      style={{
        padding: "40px 60px",
        backgroundColor: "#f7f8fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.6rem", margin: 0 }}>Xe của tôi</h2>
          <p style={{ color: "#555", margin: 0 }}>
            Quản lý thông tin các xe điện
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCar}
          style={{
            backgroundColor: "#00021f",
            border: "none",
            height: 40,
            fontWeight: 500,
          }}
        >
          Thêm xe
        </Button>
      </div>

      {/* Danh sách xe */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : cars.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>
          🚘 Chưa có xe nào trong danh sách.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "24px",
          }}
        >
          {cars.map((car) => (
            <Card
              key={car.id}
              style={{
                borderRadius: "12px",
                border: "2px solid #0a0a23",
                background: "white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                padding: "10px 25px 25px",
              }}
              bodyStyle={{ padding: "0" }}
            >
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>
                  {car.brand || "Tên xe"}
                </h3>
                <p style={{ color: "#666", marginBottom: 16 }}>
                  {car.color || "Màu"} • {car.licensePlate || "Biển số"}
                </p>

                <div style={{ color: "#333", marginBottom: 8 }}>Mức pin</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <Progress
                    percent={car.initBattery || 0}
                    showInfo={false}
                    strokeColor="#00021f"
                    trailColor="#d9d9d9"
                    style={{ flex: 1 }}
                  />
                  <span
                    style={{
                      marginLeft: 10,
                      fontWeight: 600,
                      color: "#00021f",
                    }}
                  >
                    {car.initBattery || 0}%
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditCar(car.id)}
                    style={{
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      width: "120px",
                    }}
                  >
                    Sửa
                  </Button>

                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteCar(car.id)}
                    style={{
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40px",
                      height: "40px",
                    }}
                  />
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
