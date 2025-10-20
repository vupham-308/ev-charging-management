import { useEffect, useState } from "react";
import { Card, Button, Spin, message, Tag } from "antd";

import { useParams } from "react-router-dom";
import api from "../../config/axios";

const ManageStartCharging = () => {
  const { stationId } = useParams(); // lấy stationId từ URL
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch thông tin trạm sạc từ API
  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await api.get(`/station/get/${stationId}`);

        setStation(response.data);
      } catch (error) {
        message.error("Không tải được thông tin trạm sạc");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [stationId]);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );

  if (!station)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Không có dữ liệu trạm sạc
      </p>
    );

  // Destructure dữ liệu
  const {
    name,
    address,
    pointChargerAvailable,
    pointChargerTotal,
    portType = [],
    status,
    phone,
    email,
  } = station;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <Card
        title="🚗 Bắt đầu sạc"
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <p style={{ fontSize: 16, color: "#555" }}>
          Chọn trạm sạc và bắt đầu phiên sạc
        </p>

        <Card
          type="inner"
          title="Trạm đã chọn"
          style={{
            marginTop: 16,
            borderRadius: 8,
            borderColor: "#eee",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: 4, color: "#1890ff" }}>{name}</h3>
          <p style={{ margin: "4px 0", color: "#555" }}>{address}</p>
          <p style={{ margin: "4px 0", fontWeight: 500 }}>
            {pointChargerAvailable}/{pointChargerTotal} trụ trống
          </p>
          <p style={{ margin: "4px 0" }}>
            Loại cổng:{" "}
            {portType.map((type, idx) => (
              <Tag key={idx} color="blue" style={{ marginBottom: 4 }}>
                {type}
              </Tag>
            ))}
          </p>
          <p style={{ margin: "4px 0" }}>
            Trạng thái:{" "}
            <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
          </p>
          <p style={{ margin: "4px 0", color: "#555" }}>
            Liên hệ: {phone} | {email}
          </p>
        </Card>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 12,
            marginTop: 20,
          }}
        >
          <Button type="default" size="large">
            Báo cáo sự cố
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ManageStartCharging;
