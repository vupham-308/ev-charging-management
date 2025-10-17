import { useState, useEffect } from "react";
import { Button, Input, Table, Card, Tag, Spin, message } from "antd";
import { SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const ManageMap = () => {
  const [stations, setStations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Gọi API lấy danh sách trạm
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);

        // ✅ Gửi token trong header
        const response = await api.get("/station/getAllStations");

        const result = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setStations(result);
        setFilteredData(result);
        console.log("📦 Dữ liệu từ API:", response.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách trạm:", error);
        message.error(
          "Không thể tải danh sách trạm sạc! (Kiểm tra quyền truy cập)"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  // 🔹 Hàm xử lý tìm kiếm
  const handleSearch = () => {
    const keyword = searchText.toLowerCase();
    const filtered = stations.filter(
      (station) =>
        station.name.toLowerCase().includes(keyword) ||
        station.address.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  // 🔹 Cấu hình cột bảng
  const columns = [
    {
      title: "🏢 Tên Trạm Sạc",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "📍 Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "⚡ Trạng Thái Cổng Sạc",
      key: "chargerStatus",
      render: (_, record) => (
        <span>
          <Tag color="green">{record.pointChargerAvailable} khả dụng</Tag> /{" "}
          <Tag color="blue">{record.pointChargerTotal} tổng</Tag>
        </span>
      ),
    },
    {
      title: "🔌 Loại Cổng",
      dataIndex: "portType",
      key: "portType",
      render: (types) =>
        types.map((t) => (
          <Tag color="purple" key={t}>
            {t}
          </Tag>
        )),
    },
  ];

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
            <ThunderboltOutlined style={{ color: "#faad14" }} /> Quản lý trạm
            sạc
          </span>
        }
        bordered={false}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Thanh tìm kiếm */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Nhập tên hoặc địa chỉ trạm sạc..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>

        {/* Hiển thị loading hoặc bảng */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 6 }}
            rowKey="name"
          />
        )}
      </Card>
    </div>
  );
};

export default ManageMap;
