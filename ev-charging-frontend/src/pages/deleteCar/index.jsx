import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, message, Spin } from "antd";
import {
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  CarOutlined,
  BgColorsOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";

const ManageDeleteCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy thông tin xe để hiển thị
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
      toast.success(" Đã xóa xe thành công!");
      navigate("/driver/myCar", { state: { updated: true } });
    } catch (error) {
      console.error("❌ Lỗi khi xóa xe:", error);
      toast.error("Không thể xóa xe. Vui lòng thử lại!");
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
          background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
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
        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 620,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          borderRadius: "16px",
          background: "#ffffff",
          padding: "28px 34px 38px",
        }}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#dc2626",
              gap: "10px",
            }}
          >
            <ExclamationCircleOutlined style={{ fontSize: 22 }} />
            Xác nhận xóa xe
          </div>
        }
      >
        <p
          style={{
            fontSize: "1.05rem",
            color: "#334155",
            lineHeight: 1.6,
            marginBottom: "22px",
          }}
        >
          Bạn có chắc chắn muốn{" "}
          <b style={{ color: "#dc2626" }}>xóa vĩnh viễn</b> xe này không?
          <br />
          <span style={{ color: "#ef4444", fontWeight: 600 }}>
            Hành động này không thể hoàn tác!
          </span>
        </p>

        {/* Thông tin xe */}
        <div
          style={{
            background: "#f9fafb",
            padding: "18px 20px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            marginBottom: "28px",
          }}
        >
          <p>
            <CarOutlined style={{ color: "#0f172a", marginRight: 8 }} />
            <b>Hãng xe:</b> {car?.brand}
          </p>
          <p>
            <BgColorsOutlined style={{ color: "#0f172a", marginRight: 8 }} />
            <b>Màu sắc:</b> {car?.color}
          </p>
          <p>
            <NumberOutlined style={{ color: "#0f172a", marginRight: 8 }} />
            <b>Biển số:</b> {car?.licensePlate}
          </p>
          <p>
            <ThunderboltOutlined style={{ color: "#0f172a", marginRight: 8 }} />
            <b>Mức pin khởi tạo:</b> {car?.initBattery}%
          </p>
        </div>

        {/* Nút hành động */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/driver/myCar")}
            style={{
              borderRadius: "10px",
              padding: "8px 20px",
              fontWeight: 500,
              transition: "all 0.25s",
            }}
          >
            Hủy
          </Button>

          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="large"
            loading={loading}
            onClick={handleConfirmDelete}
            style={{
              borderRadius: "10px",
              padding: "8px 22px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(220,38,38,0.25)",
              backgroundColor: "#dc2626",
              borderColor: "#dc2626",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
          >
            Xác nhận xóa
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ManageDeleteCar;
