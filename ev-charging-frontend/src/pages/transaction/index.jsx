import { useEffect, useState } from "react";
import { Card, Button, Typography, List, Tag, Spin, message } from "antd";
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  WalletOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

const { Title, Text } = Typography;

const ManageTransaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      // ❌ Nếu chưa đăng nhập
      if (!token) {
        message.warning("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        // ✅ Gọi API có kèm token
        const resTransactions = await api.get("/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(resTransactions.data);

        const resBalance = await api.get("/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(resBalance.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu ví:", err);
        message.error("Không thể tải dữ liệu ví điện tử!");
        if (err.response?.status === 401) {
          message.warning(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
          );
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatCurrency = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const renderStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Tag color="green">Hoàn thành</Tag>;
      case "FAILED":
        return <Tag color="red">Thất bại</Tag>;
      case "PENDING":
        return <Tag color="gold">Đang xử lý</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const renderTransactionMainText = (t) => {
    if (t.paymentType === "DEPOSIT") return "Nạp tiền tài khoản";
    if (t.paymentType === "WITHDRAW") return "Sạc xe điện";
    return "Giao dịch khác";
  };

  return (
    <div style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
      {/* Quay lại */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/driver")}
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            color: "rgba(0, 0, 0, 0.88)",
          }}
        >
          Quay lại
        </Button>
      </div>

      <Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
        Ví điện tử
      </Title>
      <Text type="secondary">Quản lý số dư và giao dịch</Text>

      {/* Số dư ví */}
      <Card
        style={{
          marginTop: 20,
          borderRadius: 12,
          background: "linear-gradient(90deg, #6A11CB 0%, #2575FC 100%)",
          color: "white",
          padding: "16px 20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text strong style={{ color: "white", opacity: 0.8 }}>
            Số dư ví
          </Text>
          <WalletOutlined
            style={{ fontSize: 24, color: "white", opacity: 0.8 }}
          />
        </div>
        <Title
          level={1}
          style={{
            margin: "0 0 16px 0",
            color: "white",
            fontSize: "36px",
            lineHeight: "44px",
          }}
        >
          {formatCurrency(balance)}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "white",
            fontWeight: "bold",
            borderRadius: 8,
            height: 40,
            padding: "0 20px",
          }}
          onClick={() => navigate("/topup")}
        >
          Nạp tiền
        </Button>
      </Card>

      {/* Nhóm nút Giao dịch / Thống kê */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 24,
          background: "#F0F2F5",
          borderRadius: 8,
          padding: 4,
        }}
      >
        <Button
          type="primary"
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            marginRight: 4,
            fontWeight: "bold",
          }}
        >
          Giao dịch
        </Button>
        <Button
          type="default"
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            marginLeft: 4,
            color: "rgba(0,0,0,0.65)",
          }}
        >
          Thống kê
        </Button>
      </div>

      {/* Lịch sử giao dịch */}
      <Title level={4} style={{ marginTop: 24, marginBottom: 4 }}>
        Lịch sử giao dịch
      </Title>
      <Text type="secondary">Theo dõi tất cả giao dịch nạp tiền và sạc xe</Text>

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={transactions}
            renderItem={(t) => (
              <Card
                key={t.id}
                style={{
                  marginBottom: 16,
                  borderRadius: 10,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  border: "none",
                  padding: "8px 0",
                }}
                bodyStyle={{ padding: "0 12px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          t.paymentType === "DEPOSIT" ? "#E6FFED" : "#FFF1F0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {t.paymentType === "DEPOSIT" ? (
                        <ArrowDownOutlined
                          style={{ color: "#52C41A", fontSize: 18 }}
                        />
                      ) : (
                        <ArrowUpOutlined
                          style={{ color: "#FF4D4F", fontSize: 18 }}
                        />
                      )}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        {renderTransactionMainText(t)}
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 4,
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {new Date(t.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          •{" "}
                          {new Date(t.date).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                        {t.tag && (
                          <Tag
                            style={{
                              borderRadius: 4,
                              fontSize: 12,
                              padding: "2px 8px",
                              backgroundColor: "#F0F5FF",
                              color: "#2F54EB",
                              borderColor: "#ADC6FF",
                            }}
                          >
                            {t.tag}
                          </Tag>
                        )}
                      </div>
                      <Text
                        type="secondary"
                        style={{ fontSize: 13, marginTop: 4 }}
                      >
                        Mã giao dịch: {t.id}
                      </Text>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                    }}
                  >
                    <Text
                      strong
                      style={{
                        color:
                          t.paymentType === "DEPOSIT" ? "#52C41A" : "#FF4D4F",
                        fontSize: 16,
                      }}
                    >
                      {t.paymentType === "DEPOSIT" ? "+" : "-"}
                      {formatCurrency(t.totalAmount)}
                    </Text>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {renderStatusTag(t.status)}
                      <InfoCircleOutlined style={{ color: "#BFBFBF" }} />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ManageTransaction;
