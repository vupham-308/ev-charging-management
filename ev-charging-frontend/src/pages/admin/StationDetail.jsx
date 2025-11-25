import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Tag, Button, message, Spin, Modal, Form, Input, Select } from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    MailOutlined,
    PhoneOutlined,
    DollarCircleOutlined,
    UserOutlined,
    LineChartOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const StationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [chargers, setChargers] = useState([]);
    const [stats, setStats] = useState({ // Khởi tạo state
        available: 0,
        inUse: 0,
        maintenance: 0,
        revenue: 0,
        customers: 0,
        sessions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCharger, setEditingCharger] = useState(null);
    const [form] = Form.useForm();

    // ==================== FETCH API ====================
    const token = localStorage.getItem("token");

    const fetchStationDetail = async () => {
    const res = await fetch(`http://222.255.214.35:8080/api/station/admin/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStation(data);

    // ✅ Cập nhật stats từ API station
    setStats(prevStats => ({
        ...prevStats,
        available: data.availableChargers,
        inUse: data.occupiedChargers,
        maintenance: data.outOfServiceChargers
    }));
};


    const fetchChargers = async () => {
        const res = await fetch(`http://222.255.214.35:8080/api/chargerPoint/getAll/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        // ================== GIẢ LẬP DỮ LIỆU ĐỂ GIỐNG ẢNH (User/Time) ==================
        // GHI CHÚ: API thật của bạn cần trả về currentUser và sessionStartTime
        const simulatedData = data.map((charger) => {
            if (charger.name === "Trụ #1") {
                return { ...charger, status: "IN_USE", currentUser: "Nguyễn Văn A", sessionStartTime: "2025-11-02T14:30:00" };
            }
            if (charger.name === "Trụ #3") {
                return { ...charger, status: "IN_USE", currentUser: "Trần Thị B", sessionStartTime: "2025-11-02T15:00:00" };
            }
             if (charger.name === "Trụ #7") {
                return { ...charger, status: "IN_USE", currentUser: "Lê Văn C", sessionStartTime: "2025-11-02T13:45:00" };
            }
             if (charger.name === "Trụ #8") {
                return { ...charger, status: "IN_USE", currentUser: "Phạm Thị D", sessionStartTime: "2025-11-02T14:15:00" };
            }
            if (charger.name === "Trụ #5") {
                return { ...charger, status: "OUT_OF_SERVICE" };
            }
            return charger;
        });
        setChargers(simulatedData || []);
        // =================================================================
        
        // ================== TÍNH TOÁN TRẠNG THÁI TỪ DỮ LIỆU TRỤ SẠC ==================
        // Tự động đếm số lượng trụ sạc dựa trên trạng thái
        const available = simulatedData.filter(c => c.status?.toUpperCase() === 'AVAILABLE').length;
        const inUse = simulatedData.filter(c => c.status?.toUpperCase() === 'IN_USE').length;
        const maintenance = simulatedData.filter(c => c.status?.toUpperCase() === 'OUT_OF_SERVICE').length;
        
        // Cập nhật state 'stats' với số liệu đếm
        setStats(prevStats => ({
            ...prevStats,
            available,
            inUse,
            maintenance
        }));
        // ========================================================================
    };

    // ================== CẬP NHẬT API THỐNG KÊ MỚI ==================
    const fetchStationStats = async () => {
        try {
            const res = await fetch(`http://222.255.214.35:8080/api/station/admin/dashboard-status/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                // Cập nhật state 'stats' với doanh thu, khách hàng, phiên sạc
                setStats(prevStats => ({
                    ...prevStats,
                    revenue: data.revenueToday, // Doanh thu tuần
                    customers: data.customersToday, // Khách hàng tuần
                    sessions: data.chargingSessionsToday // Phiên sạc tuần
                }));
            } else {
                 message.error("Không thể tải thống kê doanh thu.");
            }
        } catch (e) {
            console.error("Failed to fetch dashboard stats: ", e);
            message.error("Lỗi khi tải thống kê doanh thu.");
        }
    };
    // =================================================================

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                // Cả hai hàm fetchChargers và fetchStationStats sẽ cùng cập nhật state 'stats'
                await Promise.all([fetchStationDetail(), fetchChargers(), fetchStationStats()]);
            } catch (e) {
                message.error("Không thể tải dữ liệu trạm!");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]); // Thêm id vào dependency array để re-fetch khi id thay đổi

    // ==================== POPUP (Thêm/Sửa) ====================
    const handleAdd = () => {
        setEditingCharger(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (charger) => {
        setEditingCharger(charger);
        form.setFieldsValue({
            chargerName: charger.name,
            type: charger.chargerCost?.portType,
            status: charger.status,
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        const bodyData = {
            name: values.chargerName,
            portType: values.type,
            status: values.status,
        };

        try {
            const url = editingCharger
                ? `http://222.255.214.35:8080/api/chargerPoint/admin/update/${editingCharger.id}`
                : `http://222.255.214.35:8080/api/chargerPoint/admin/create/${id}`;

            const method = editingCharger ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });

            if (!res.ok) throw new Error("Thao tác thất bại!");
            message.success(editingCharger ? "Cập nhật thành công!" : "Thêm mới thành công!");
            setIsModalVisible(false);
            fetchChargers(); // Tải lại danh sách trụ sạc (và cập nhật lại số liệu đếm)
        } catch (e) {
            message.error(e.message);
        }
    };

    // ==================== HELPERS (Hàm hỗ trợ) ====================
    const getStationStatus = (s) => {
        if (s === "ACTIVE") return <Tag color="green">Hoạt động</Tag>;
        if (s === "INACTIVE") return <Tag color="default">Ngưng hoạt động</Tag>;
        return <Tag color="red">Bảo trì</Tag>;
    };

    const getChargerStatus = (s) => {
        const status = s?.toUpperCase();
        if (status === "AVAILABLE") return <Tag color="green">Có sẵn</Tag>;
        if (status === "IN_USE") return <Tag color="gold">Đang sử dụng</Tag>;
        return <Tag color="red">Bảo trì</Tag>;
    };
    
    // Format thời gian sang HH:mm
    const formatTime = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }); // vd: "14:30"
        } catch (e) {
            return "";
        }
    };

    // Loading screen
    if (loading || !station) { // Thêm kiểm tra !station
        return (
            <div style={{ textAlign: "center", paddingTop: 100 }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    // ==================== UI (Giao diện) ====================
    return (
        <div style={{ padding: 24, maxWidth: 1100, margin: "auto" }}>
            {/* TIÊU ĐỀ TRANG VÀ NÚT QUAY LẠI */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate(-1)} // Nút quay lại
                    style={{ marginRight: 16 }}
                />
                <div>
                    <h2 style={{ margin: 0, fontSize: 24 }}>Chi tiết trạm sạc</h2>
                    <div style={{ color: "#888" }}>Quản lý và giám sát trạm</div>
                </div>
            </div>

            {/* POPUP THÊM/SỬA TRỤ SẠC */}
            <Modal
                title={editingCharger ? "Sửa trụ sạc" : "Thêm trụ sạc"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCharger ? "Cập nhật" : "Thêm mới"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="chargerName"
                        label="Tên trụ sạc"
                        rules={[{ required: true, message: "Vui lòng nhập tên trụ" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại cổng sạc"
                        rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                    >
                        <Select>
                            <Select.Option value="AC">AC</Select.Option>
                            <Select.Option value="CCS">CCS</Select.Option>
                            <Select.Option value="CHAdeMO">CHAdeMO</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                    >
                        <Select>
                            <Select.Option value="AVAILABLE">Có sẵn</Select.Option>
                            <Select.Option value="OUT_OF_SERVICE">Bảo trì</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* THÔNG TIN TRẠM VÀ THỐNG KÊ */}
            <Card style={{ borderRadius: 10, marginBottom: 24 }}>
                {/* Thông tin trạm */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h2>{station.name}</h2>
                        <p style={{ margin: 0, color: "#666" }}>📍 {station.address}</p>
                        <div style={{ display: "flex", gap: 24, marginTop: 12, color: "#555" }}>
                            <div><PhoneOutlined /> {station.phone}</div>
                            <div><MailOutlined /> {station.email}</div>
<div>⚡ {station.totalChargers} trụ</div>
                        </div>
                    </div>
                    <div>{getStationStatus(station.status)}</div>
                </div>

                {/* Khối thống kê */}
                {stats && (
                    <>
                        {/* HÀNG 1: Trạng thái trụ sạc (Tính toán từ fetchChargers) */}
                        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            <Card style={{ background: "#f6ffed", border: "1px solid #b7eb8f" }} bodyStyle={{ padding: 16 }}>
                                <h3 style={{ color: "#52c41a", margin: 0, fontSize: 24 }}>{stats.available}</h3>
                                <div style={{ color: "#555" }}>Có sẵn</div>
                            </Card>
                            <Card style={{ background: "#fffbe6", border: "1px solid #ffe58f" }} bodyStyle={{ padding: 16 }}>
                                <h3 style={{ color: "#faad14", margin: 0, fontSize: 24 }}>{stats.inUse}</h3>
                                <div style={{ color: "#555" }}>Đang sử dụng</div>
                            </Card>
                            <Card style={{ background: "#fff1f0", border: "1px solid #ffa39e" }} bodyStyle={{ padding: 16 }}>
                                <h3 style={{ color: "#f5222d", margin: 0, fontSize: 24 }}>{stats.maintenance}</h3>
                                <div style={{ color: "#555" }}>Bảo trì</div>
                            </Card>
                        </div>
                        
                        {/* HÀNG 2: Thống kê doanh thu (Từ API .../dashboard-status/{id}) */}
                        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                             <Card bodyStyle={{ padding: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ color: "#666", marginBottom: 4 }}>Doanh thu tuần này</div>
                                        <h3 style={{ margin: 0, fontSize: 20 }}>{stats.revenue?.toLocaleString("vi-VN")} đ</h3>
                                    </div>
                                    <DollarCircleOutlined style={{ fontSize: 32, color: "#52c41a" }} />
                                </div>
                            </Card>
                            <Card bodyStyle={{ padding: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ color: "#666", marginBottom: 4 }}>Khách hàng tuần này</div>
                                        <h3 style={{ margin: 0, fontSize: 20 }}>{stats.customers}</h3>
                                    </div>
                                    <UserOutlined style={{ fontSize: 32, color: "#1677ff" }} />
                                </div>
                            </Card>
                            <Card bodyStyle={{ padding: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ color: "#666", marginBottom: 4 }}>Tổng phiên sạc tuần này</div>
                                        <h3 style={{ margin: 0, fontSize: 20 }}>{stats.sessions}</h3>
                                    </div>
                                    <LineChartOutlined style={{ fontSize: 32, color: "#722ed1" }} />
                                </div>
                            </Card>
                        </div>
                    </>
                )}
            </Card>

            {/* DANH SÁCH TRỤ SẠC */}
            <div
                style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: "#fff",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Danh sách trụ sạc</h3>
                        <p style={{ color: "#888", margin: 0 }}>Quản lý và điều khiển các trụ sạc</p>
                    </div>
                    <Button type="primary" onClick={handleAdd} style={{ backgroundColor: "#222" }}>+ Thêm trụ sạc</Button>
                </div>

                {/* Lưới danh sách các trụ */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {chargers.map((c) => (
                        <Card key={c.id} style={{ borderRadius: 8 }} bodyStyle={{ padding: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                {/* Bên trái: Tên và loại */}
                                <div>
                                    <b style={{ fontSize: 16 }}>{c.name}</b>
                                    <div style={{ color: "#555", marginTop: 4 }}>
{c.chargerCost?.portType || "?"} - {c.chargerCost?.power ? `${c.chargerCost.power}kW` : "?kW"}
                                    </div>
                                </div>
                                {/* Bên phải: Trạng thái và nút */}
                                <div style={{ textAlign: "right", minWidth: 90 }}>
                                    {getChargerStatus(c.status)}
                                    <div style={{ marginTop: 8 }}>
                                        <EditOutlined style={{ color: "#1677ff", marginRight: 12, cursor: 'pointer' }} onClick={() => handleEdit(c)} />
                                        <DeleteOutlined style={{ color: "#ff4d4f", cursor: 'pointer' }} /* onClick={() => handleDelete(c.id)} */ />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Thông tin thêm (nếu đang sử dụng) */}
                            {c.status?.toUpperCase() === "IN_USE" && (
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0", color: "#666" }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <UserOutlined style={{ marginRight: 8 }} /> {c.currentUser || "Đang tải..."}
                                    </div>
                                    <div>
                                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                                        Bắt đầu: {formatTime(c.sessionStartTime) || "..."}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StationDetail;