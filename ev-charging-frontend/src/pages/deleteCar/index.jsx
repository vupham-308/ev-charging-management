import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, message, Spin } from "antd";
import {
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";

const ManageDeleteCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy thông tin xe để hiển thị trước khi xóa
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get(`/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin xe:", error);
        message.error("Không thể tải thông tin xe!");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // ✅ Hàm xác nhận xóa xe
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.delete(`/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("🗑️ Đã xóa xe thành công!");
      navigate("/driver/myCar", { state: { updated: true } }); // ✅ Cập nhật lại danh sách xe
    } catch (error) {
      console.error("❌ Lỗi khi xóa xe:", error);
      message.error("Không thể xóa xe. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !car) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card
        title={
          <span
            style={{
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: "#ff4d4f",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ExclamationCircleOutlined />
            Xác nhận xóa xe
          </span>
        }
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 600,
          textAlign: "left",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          borderRadius: "14px",
          background: "#fff",
          padding: "10px 20px 20px 20px",
        }}
      >
        <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "20px" }}>
          Bạn có chắc chắn muốn xóa xe này không?
          <br />
          <span style={{ color: "#ff4d4f", fontWeight: 500 }}>
            Hành động này không thể hoàn tác.
          </span>
        </p>

        <div
          style={{
            backgroundColor: "#fafafa",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
          }}
        >
          <p>
            <b>🚘 Hãng xe:</b> {car?.brand}
          </p>
          <p>
            <b>🎨 Màu sắc:</b> {car?.color}
          </p>
          <p>
            <b>🚗 Biển số:</b> {car?.licensePlate}
          </p>
          <p>
            <b>🔋 Mức pin khởi tạo:</b> {car?.initBattery}%
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
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
            danger
            icon={<DeleteOutlined />}
            onClick={handleConfirmDelete}
            loading={loading}
          >
            Xác nhận xóa
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ManageDeleteCar;
