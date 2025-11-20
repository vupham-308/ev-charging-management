import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  List,
  Tag,
  Spin,
  message,
  Divider,
  Row,
  Col,
  Statistic,
} from "antd";
import { Wallet, ArrowUpRight, Activity, Zap } from "lucide-react";
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  WalletOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SwapOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

const { Title, Text } = Typography;

const ManageTransaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.warning("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const [resTransactions, resBalance, resReport] = await Promise.all([
          api.get("/my", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/user-report", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sortedTransactions = [...resTransactions.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTransactions(sortedTransactions);

        setBalance(resBalance.data);
        setReport(resReport.data);
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
        return <Tag color="success">Hoàn thành</Tag>;
      case "FAILED":
        return <Tag color="error">Thất bại</Tag>;
      case "PENDING":
        return <Tag color="warning">Đang xử lý</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const renderTransactionMainText = (t) => {
    if (t.paymentType === "TOPUP") return "Nạp tiền tài khoản";
    if (t.paymentType === "WITHDRAW") return "Sạc xe điện tại";
    return "Giao dịch khác";
  };

  const renderPaymentMethod = (method) => {
    switch (method) {
      case "VNPAY":
        return "VNPay";
      case "BALANCE":
        return "Ví điện tử";
      case "CASH":
        return "Tiền mặt";
      default:
        return method || "Không xác định";
    }
  };

  return (
    <div
      style={{
        padding: 24,
        margin: "0 auto",
        background: "white",
        minHeight: "100vh",
      }}
    >
      {/* Tiêu đề */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Title
          level={3}
          style={{
            color: "black",
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          Ví điện tử
        </Title>

        <Text type="secondary" style={{ fontSize: 15 }}>
          Quản lý số dư & giao dịch của bạn
        </Text>
      </div>

      {/* Số dư ví */}
      <Card
        style={{
          marginTop: 10,
          borderRadius: 16,
          background: "linear-gradient(135deg, #6366F1, #3B82F6, #06B6D4)",
          color: "white",
          padding: "20px 24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong style={{ color: "white", opacity: 0.85 }}>
            Số dư ví
          </Text>
          <WalletOutlined
            style={{ fontSize: 26, color: "white", opacity: 0.9 }}
          />
        </div>

        <Title
          level={1}
          style={{
            margin: "10px 0 16px 0",
            color: "white",
            fontSize: 38,
            textShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {formatCurrency(balance)}
        </Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            border: "none",
            color: "white",
            fontWeight: 700,
            borderRadius: 10,
            height: 42,
            padding: "0 24px",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => navigate("/driver/topup")}
        >
          Nạp tiền
        </Button>
      </Card>

      {/* Tab nút Giao dịch / Thống kê */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 28,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: 6,
        }}
      >
        <Button
          type={activeTab === "transactions" ? "primary" : "default"}
          icon={<SwapOutlined />}
          onClick={() => setActiveTab("transactions")}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            marginRight: 6,
            fontWeight: 600,
            background:
              activeTab === "transactions"
                ? "linear-gradient(90deg, #4F46E5, #3B82F6)"
                : "#F9FAFB",
          }}
        >
          Giao dịch
        </Button>
        <Button
          type={activeTab === "report" ? "primary" : "default"}
          icon={<BarChartOutlined />}
          onClick={() => setActiveTab("report")}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            marginLeft: 6,
            fontWeight: 600,
            background:
              activeTab === "report"
                ? "linear-gradient(90deg, #4F46E5, #0EA5E9)"
                : "#F9FAFB",
          }}
        >
          Thống kê
        </Button>
      </div>

      <Divider />

      {activeTab === "transactions" ? (
        <>
          <Title level={4} style={{ marginTop: 8 }}>
            Lịch sử giao dịch
          </Title>
          <Text type="secondary">
            Theo dõi toàn bộ giao dịch nạp tiền & sạc xe
          </Text>

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
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      border: "none",
                      transition: "transform 0.2s ease, box-shadow 0.3s",
                      cursor: "pointer",
                    }}
                    bodyStyle={{ padding: "12px 16px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            background:
                              t.paymentType === "TOPUP" &&
                              t.status === "COMPLETED"
                                ? "linear-gradient(135deg, #D1FAE5, #A7F3D0)"
                                : t.paymentType === "TOPUP" &&
                                  t.status === "FAILED"
                                ? "linear-gradient(135deg, #FFF7ED, #FED7AA)"
                                : t.paymentType === "WITHDRAW" &&
                                  t.status === "COMPLETED"
                                ? "linear-gradient(135deg, #FEE2E2, #FCA5A5)"
                                : t.paymentType === "WITHDRAW" &&
                                  t.status === "FAILED"
                                ? "linear-gradient(135deg, #E2E8F0, #CBD5E1)"
                                : "linear-gradient(135deg, #F1F5F9, #E2E8F0)",
                            borderRadius: 12,
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                          }}
                        >
                          {t.paymentType === "TOPUP" &&
                          t.status === "COMPLETED" ? (
                            <ArrowUpOutlined
                              style={{ color: "#16A34A", fontSize: 20 }}
                            />
                          ) : t.paymentType === "TOPUP" &&
                            t.status === "FAILED" ? (
                            <WarningOutlined
                              style={{ color: "#FB923C", fontSize: 20 }}
                            />
                          ) : t.paymentType === "WITHDRAW" &&
                            t.status === "COMPLETED" ? (
                            <ArrowDownOutlined
                              style={{ color: "#DC2626", fontSize: 20 }}
                            />
                          ) : t.paymentType === "WITHDRAW" &&
                            t.status === "FAILED" ? (
                            <WarningOutlined
                              style={{ color: "#64748B", fontSize: 20 }}
                            />
                          ) : (
                            <ArrowRightOutlined
                              style={{ color: "#94A3B8", fontSize: 20 }}
                            />
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Text
                              strong
                              style={{ fontSize: 16, color: "#1E293B" }}
                            >
                              {renderTransactionMainText(t)}{" "}
                              {t.stationName && (
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "#3B82F6",
                                    opacity: 0.9,
                                  }}
                                >
                                  {t.stationName}
                                </span>
                              )}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginTop: 4,
                            }}
                          >
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {new Date(t.date).toLocaleDateString("vi-VN")} •{" "}
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
                                  backgroundColor: "#EEF2FF",
                                  color: "#4F46E5",
                                  border: "none",
                                }}
                              >
                                {t.tag}
                              </Tag>
                            )}
                          </div>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            Mã: {t.id}
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 2,
                            }}
                          >
                            {t.paymentMethod === "VNPAY" ? (
                              <img
                                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                                alt="VNPay"
                                style={{ width: 18, height: 18 }}
                              />
                            ) : t.paymentMethod === "BALANCE" ? (
                              <WalletOutlined style={{ color: "#3B82F6" }} />
                            ) : (
                              <InfoCircleOutlined
                                style={{ color: "#94A3B8" }}
                              />
                            )}
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {renderPaymentMethod(t.paymentMethod)}
                            </Text>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <Text
                          strong
                          style={{
                            color:
                              t.paymentType === "TOPUP" &&
                              t.status === "COMPLETED"
                                ? "#16A34A"
                                : t.paymentType === "TOPUP" &&
                                  t.status === "FAILED"
                                ? "#FB923C"
                                : t.paymentType === "WITHDRAW" &&
                                  t.status === "COMPLETED"
                                ? "#DC2626"
                                : t.paymentType === "WITHDRAW" &&
                                  t.status === "FAILED"
                                ? "#64748B"
                                : "#64748B",
                            fontSize: 16,
                          }}
                        >
                          {t.paymentType === "TOPUP" && t.status === "COMPLETED"
                            ? "+"
                            : t.paymentType === "WITHDRAW" &&
                              t.status === "COMPLETED"
                            ? "-"
                            : ""}
                          {formatCurrency(t.totalAmount)}
                        </Text>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {renderStatusTag(t.status)}
                          <InfoCircleOutlined style={{ color: "#94A3B8" }} />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <Title level={4} style={{ marginTop: 8 }}>
            Báo cáo tháng này
          </Title>
          <Text type="secondary">Tổng hợp chi tiêu & nạp tiền của bạn</Text>

          <div style={{ marginTop: 20 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 50 }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {/* Tổng chi tiêu tháng này */}
                <Col xs={24} sm={12}>
                  <Card bordered={false} style={{ borderRadius: 12 }}>
                    <Statistic
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Wallet size={18} color="#EF4444" />
                          <span>Tổng chi tiêu tháng này</span>
                        </div>
                      }
                      value={report?.expenseInCurrentMonth || 0}
                      precision={0}
                      valueStyle={{ color: "#EF4444" }}
                      suffix="₫"
                    />
                  </Card>
                </Col>

                {/* Tổng nạp tháng này */}
                <Col xs={24} sm={12}>
                  <Card bordered={false} style={{ borderRadius: 12 }}>
                    <Statistic
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <ArrowUpRight size={18} color="#10B981" />
                          <span>Tổng nạp tháng này</span>
                        </div>
                      }
                      value={report?.topUpInCurrentMonth || 0}
                      precision={0}
                      valueStyle={{ color: "#10B981" }}
                      suffix="₫"
                    />
                  </Card>
                </Col>

                {/* Chi trung bình mỗi phiên */}
                <Col xs={24} sm={12}>
                  <Card bordered={false} style={{ borderRadius: 12 }}>
                    <Statistic
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Activity size={18} color="#3B82F6" />
                          <span>Chi trung bình mỗi phiên</span>
                        </div>
                      }
                      value={report?.avgExpensePerSession || 0}
                      precision={0}
                      valueStyle={{ color: "#3B82F6" }}
                      suffix="₫"
                    />
                  </Card>
                </Col>

                {/* Tổng số phiên sạc */}
                <Col xs={24} sm={12}>
                  <Card bordered={false} style={{ borderRadius: 12 }}>
                    <Statistic
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Zap size={18} color="#6366F1" />
                          <span>Tổng số phiên sạc</span>
                        </div>
                      }
                      value={report?.totalSessions || 0}
                      precision={0}
                      valueStyle={{ color: "#6366F1" }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageTransaction;
