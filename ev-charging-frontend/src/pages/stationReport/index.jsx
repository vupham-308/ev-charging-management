import { useState } from "react";
import { Card, Input, Button, Select, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { WarningOutlined, SendOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { TextArea } = Input;

const ManageStationReport = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [problemTitle, setProblemTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!problemTitle || !description) {
      message.warning("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        title: problemTitle,
        description,
      };

      await api.post(`/problem/create/${stationId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Gửi báo cáo thành công!");
      navigate(-1);
    } catch (err) {
      console.error("❌ Lỗi khi gửi báo cáo:", err);
      const errorMsg = err.response?.data?.message || "Không thể gửi báo cáo!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <WarningOutlined style={{ color: "#faad14" }} />
            Báo cáo sự cố
          </h1>
          <p style={{ color: "#666", margin: 0 }}>
            Báo cáo vấn đề gặp phải tại trạm sạc để chúng tôi xử lý kịp thời
          </p>
        </div>

        {/* Form */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            border: "1px solid #eee",
          }}
          bodyStyle={{ padding: "24px 28px" }}
        >
          {/* Trạm sạc */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ marginBottom: 4, color: "#888", fontWeight: 500 }}>
              Trạm sạc:
            </p>
            <p
              style={{
                fontWeight: 600,
                color: "#000",
                fontSize: 15,
                margin: 0,
              }}
            >
              Trung tâm thương mại Vincom
            </p>
          </div>

          {/* Tiêu đề sự cố */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Tiêu đề sự cố <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              placeholder="VD: Trụ sạc không khởi động được"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
            />
          </div>

          {/* Mô tả chi tiết */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: "block",
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Mô tả chi tiết <span style={{ color: "red" }}>*</span>
            </label>
            <TextArea
              rows={5}
              placeholder="Mô tả chi tiết về sự cố, thời gian xảy ra, và các bước bạn đã thử..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button onClick={() => navigate(-1)}>Hủy</Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={handleSubmit}
              style={{
                backgroundColor: "#00021f",
                border: "none",
                fontWeight: 500,
              }}
            >
              Gửi báo cáo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageStationReport;
