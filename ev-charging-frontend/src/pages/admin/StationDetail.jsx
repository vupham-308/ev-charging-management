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
    const [stats, setStats] = useState({
        available: 0,
        inUse: 0,
        maintenance: 0,
        reserved: 0,
        revenue: 0,
        customers: 0,
        sessions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCharger, setEditingCharger] = useState(null);
    const [form] = Form.useForm();

    const token = localStorage.getItem("token");

    // ==================== FETCH API ====================
    const fetchStationDetail = async () => {
        const res = await fetch(`http://222.255.214.35:8080/api/station/admin/detail/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStation(data);

        setStats(prev => ({
            ...prev,
            available: data.availableChargers,
            inUse: data.occupiedChargers,
            maintenance: data.outOfServiceChargers,
        }));
    };

    const fetchChargers = async () => {
        const res = await fetch(`http://222.255.214.35:8080/api/chargerPoint/getAll/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // GIẢ LẬP bổ sung (demo)
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

        setChargers(simulatedData);

        // Đếm trạng thái (4 trạng thái)
        const available = simulatedData.filter(c => c.status?.toUpperCase() === "AVAILABLE").length;
        const inUse = simulatedData.filter(c => ["IN_USE", "OCCUPIED"].includes(c.status?.toUpperCase())).length;
        const maintenance = simulatedData.filter(c => c.status?.toUpperCase() === "OUT_OF_SERVICE").length;
        const reserved = simulatedData.filter(c => c.status?.toUpperCase() === "RESERVED").length;

        setStats(prev => ({
            ...prev,
            available,
            inUse,
            maintenance,
            reserved
        }));
    };

    const fetchStationStats = async () => {
        try {
            const res = await fetch(`http://222.255.214.35:8080/api/station/admin/dashboard-status/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setStats(prev => ({
                    ...prev,
                    revenue: data.revenueToday,
                    customers: data.customersToday,
                    sessions: data.chargingSessionsToday
                }));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchStationDetail(),
                    fetchChargers(),
                    fetchStationStats()
                ]);
            } catch (e) {
                message.error("Không thể tải dữ liệu trạm!");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // ==================== POPUP (Thêm/Sửa trụ) ====================
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
            fetchChargers();
        } catch (e) {
            message.error(e.message);
        }
    };

    // ==================== HIỂN THỊ TRẠNG THÁI 4 LOẠI ====================
    const getChargerStatus = (s) => {
        const status = s?.toUpperCase();

        switch (status) {
            case "AVAILABLE":
                return <Tag color="green">Có sẵn</Tag>;

            case "IN_USE":
            case "OCCUPIED":
                return <Tag color="gold">Đang sử dụng</Tag>;

            case "OUT_OF_SERVICE":
                return <Tag color="red">Bảo trì</Tag>;

            case "RESERVED":
                return <Tag color="blue">Đã đặt trước</Tag>;

            default:
                return <Tag>Không rõ</Tag>;
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
        } catch {
            return "";
        }
    };

    if (loading || !station) {
        return (
            <div style={{ textAlign: "center", paddingTop: 100 }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    // ==================== UI ====================
    return (
        <div style={{ padding: 24, maxWidth: 1100, margin: "auto" }}>
            {/* Nút quay lại */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
                <div style={{ marginLeft: 12 }}>
                    <h2 style={{ margin: 0 }}>Chi tiết trạm sạc</h2>
                    <span style={{ color: "#888" }}>Quản lý và giám sát trạm</span>
                </div>
            </div>

            {/* POPUP */}
            <Modal
                title={editingCharger ? "Sửa trụ sạc" : "Thêm trụ sạc"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCharger ? "Cập nhật" : "Thêm mới"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="chargerName" label="Tên trụ sạc" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="type" label="Loại cổng sạc" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="AC">AC</Select.Option>
                            <Select.Option value="CCS">CCS</Select.Option>
                            <Select.Option value="CHAdeMO">CHAdeMO</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="AVAILABLE">Có sẵn</Select.Option>
                            <Select.Option value="IN_USE">Đang sử dụng</Select.Option>
                            <Select.Option value="OUT_OF_SERVICE">Bảo trì</Select.Option>
                            <Select.Option value="RESERVED">Đã đặt trước</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* THÔNG TIN TRẠM */}
            <Card style={{ borderRadius: 10, marginBottom: 24 }}>
                <h2>{station.name}</h2>
                <p>📍 {station.address}</p>
                <p><PhoneOutlined /> {station.phone} &nbsp;&nbsp; <MailOutlined /> {station.email}</p>

                <div
                    style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 16
                    }}
                >
                    <Card style={{ background: "#f6ffed", border: "1px solid #b7eb8f" }}>
                        <h3 style={{ color: "#52c41a" }}>{stats.available}</h3>
                        <div>Có sẵn</div>
                    </Card>

                    <Card style={{ background: "#fffbe6", border: "1px solid #ffe58f" }}>
                        <h3 style={{ color: "#faad14" }}>{stats.inUse}</h3>
                        <div>Đang sử dụng</div>
                    </Card>

                    <Card style={{ background: "#fff1f0", border: "1px solid #ffa39e" }}>
                        <h3 style={{ color: "#f5222d" }}>{stats.maintenance}</h3>
                        <div>Bảo trì</div>
                    </Card>

                    <Card style={{ background: "#e6f4ff", border: "1px solid #91caff" }}>
                        <h3 style={{ color: "#1677ff" }}>{stats.reserved}</h3>
                        <div>Đã đặt trước</div>
                    </Card>
                </div>
            </Card>

            {/* DANH SÁCH TRỤ */}
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                        <h3>Danh sách trụ sạc</h3>
                    </div>
                    <Button type="primary" onClick={handleAdd}>+ Thêm trụ</Button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {chargers.map((c) => (
                        <Card key={c.id}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <b>{c.name}</b>
                                    <div style={{ color: "#555" }}>
                                        {c.chargerCost?.portType} - {c.chargerCost?.power}kW
                                    </div>
                                </div>

                                {getChargerStatus(c.status)}
                            </div>

                            {["IN_USE", "OCCUPIED"].includes(c.status?.toUpperCase()) && (
                                <div style={{ marginTop: 8, borderTop: "1px solid #eee", paddingTop: 8 }}>
                                    <UserOutlined /> {c.currentUser}<br />
                                    <ClockCircleOutlined /> Bắt đầu: {formatTime(c.sessionStartTime)}
                                </div>
                            )}

                            <div style={{ marginTop: 12 }}>
                                <EditOutlined
                                    style={{ color: "#1677ff", marginRight: 12, cursor: "pointer" }}
                                    onClick={() => handleEdit(c)}
                                />
                                <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer" }} />
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default StationDetail;
