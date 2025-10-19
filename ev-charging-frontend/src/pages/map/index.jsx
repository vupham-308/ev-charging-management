import { useState, useEffect } from "react";
import { Input, Button, Tag, Spin, message, Card } from "antd";
import {
  EnvironmentOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const ManageMap = () => {
  const [stations, setStations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Hook điều hướng

  // 🔹 Lấy danh sách trạm
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/station/getAllStations");
        const result = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setStations(result);
        setFilteredData(result);
      } catch (error) {
        console.error("❌ Lỗi khi tải trạm:", error);
        message.error("Không thể tải danh sách trạm sạc!");
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  // 🔍 Tìm kiếm
  const handleSearch = () => {
    const keyword = searchText.toLowerCase();
    const filtered = stations.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.address.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  const handleBookingClick = (station) => {
    navigate(`/driver/booking/${station.id}`);
  };
  const handleStartCharging = (station) => {
    navigate("/driver/startCharging", { state: { station } });
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fb",
        minHeight: "100vh",
        display: "flex",
        gap: "30px",
        padding: "30px 40px",
      }}
    >
      {/* BÊN TRÁI - Danh sách trạm */}
      <div style={{ flex: 1, maxWidth: "500px" }}>
        {/* Thanh tìm kiếm */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm trạm sạc..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{
              width: "300px",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={handleSearch}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            Bộ lọc
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxHeight: "80vh",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            {filteredData.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                Không tìm thấy trạm nào phù hợp.
              </p>
            ) : (
              filteredData.map((station) => (
                <Card
                  key={station.id}
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>
                      {station.name}
                    </h3>
                    <p style={{ color: "#666", margin: "4px 0 8px" }}>
                      <EnvironmentOutlined /> {station.address}
                    </p>

                    <p style={{ margin: "4px 0" }}>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {station.pointChargerAvailable} khả dụng
                      </span>{" "}
                      / {station.pointChargerTotal} tổng
                    </p>

                    <div style={{ marginBottom: "10px" }}>
                      {station.portType?.map((type, index) => (
                        <Tag
                          key={index}
                          color={type === "CCS" ? "blue" : "purple"}
                          style={{
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            marginBottom: "4px",
                          }}
                        >
                          {type}
                        </Tag>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "black",
                          border: "none",
                          borderRadius: "8px",
                          flex: 1,
                        }}
                        onClick={() => handleBookingClick(station)}
                      >
                        Đặt chỗ
                      </Button>
                      <Button
                        type="default"
                        style={{
                          borderRadius: "8px",
                          flex: 1,
                        }}
                        onClick={() => handleStartCharging(station)}
                      >
                        Bắt đầu sạc
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* BÊN PHẢI - Bản đồ */}
      <div
        style={{
          flex: 2,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}
      >
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5157964845324!2d106.70042387480553!3d10.77246105931243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f49a9a89311%3A0x4f68559f7c84f6c8!2zQ8O0bmcgVHkgVE5ISCBUUC4gSENN!5e0!3m2!1svi!2s!4v1739274935632!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ManageMap;
