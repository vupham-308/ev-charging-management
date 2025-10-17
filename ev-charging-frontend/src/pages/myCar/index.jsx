import { useState, useEffect } from "react";
import { Button, Card, Table, Tag, message, Spin } from "antd";
import { CarOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const ManageMyCar = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ đặt dòng này lên trên cùng

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
      navigate("/driver/myCar", { replace: true }); // Xóa state tránh gọi lại liên tục
    }
  }, [location.state]);
  // ✅ Khi có xe mới được thêm từ trang AddCar
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

  // 🔹 Chuyển hướng đến trang thêm/sửa xe
  const handleAddCar = () => navigate("/driver/myCar/addCar");
  const handleEditCar = (id) => navigate(`/driver/myCar/editCar/${id}`);
  const handleDeleteCar = (id) => navigate(`/driver/myCar/deleteCar/${id}`);

  // 🔹 Cấu hình bảng
  const columns = [
    {
      title: "🚘 Hãng Xe",
      dataIndex: "brand",
      key: "brand",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "🎨 Màu Sắc",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <Tag color="blue" style={{ fontSize: "0.95rem" }}>
          {color}
        </Tag>
      ),
    },
    {
      title: "🔋 Mức Pin",
      dataIndex: "initBattery",
      key: "initBattery",
      render: (battery) => (
        <Tag
          color={battery >= 80 ? "green" : battery >= 50 ? "gold" : "red"}
          style={{ fontSize: "0.95rem" }}
        >
          {battery || 0}%
        </Tag>
      ),
    },
    {
      title: "⚙️ Thao Tác",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditCar(record.id)}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDeleteCar(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  if (isChildRoute) {
    return <Outlet />;
  }

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
            <CarOutlined style={{ color: "#1890ff" }} /> Xe của tôi
          </span>
        }
        bordered={false}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCar}>
            Thêm xe
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : cars.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>
            🚘 Chưa có xe nào trong danh sách.
          </p>
        ) : (
          <Table
            dataSource={cars}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ManageMyCar;
