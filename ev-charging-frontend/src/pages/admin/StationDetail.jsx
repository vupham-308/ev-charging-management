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
        revenue: 0,
        customers: 0,
        sessions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCharger, setEditingCharger] = useState(null);
    const [form] = Form.useForm();
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const token = localStorage.getItem("token");

    // ================== Charger Cost API ==================
    const [chargerCosts, setChargerCosts] = useState([]);

    const fetchChargerCosts = async () => {
        try {
            const res = await fetch(`http://222.255.214.35:8080/api/charger-cost`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setChargerCosts(data);
        } catch (e) {
            console.error("Failed to fetch charger-cost:", e);
            message.error("Không thể tải danh sách loại cổng sạc");
        }
    };

    // ==================== FETCH STATION DETAIL ====================
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
            maintenance: data.outOfServiceChargers
        }));
    };

    // ==================== FETCH CHARGERS ====================
    const fetchChargers = async () => {
        const res = await fetch(`http://222.255.214.35:8080/api/chargerPoint/getAll/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const simulatedData = data.map(charger => {
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

        const available = simulatedData.filter(c => c.status?.toUpperCase() === 'AVAILABLE').length;
        const inUse = simulatedData.filter(c => c.status?.toUpperCase() === 'IN_USE').length;
        const maintenance = simulatedData.filter(c => c.status?.toUpperCase() === 'OUT_OF_SERVICE').length;

        setStats(prev => ({
            ...prev,
            available,
            inUse,
            maintenance
        }));
    };

    // ==================== FETCH STATION STATS ====================
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
            } else {
                message.error("Không thể tải thống kê doanh thu.");
            }
        } catch (e) {
            console.error("Failed to fetch dashboard stats:", e);
        }
    };

    // ==================== LOAD ALL DATA ====================
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchStationDetail(),
                    fetchChargers(),
                    fetchStationStats(),
                    fetchChargerCosts(),
                ]);
            } catch (e) {
                message.error("Không thể tải dữ liệu trạm!");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // ==================== HANDLES POPUP ====================
    const handleAdd = () => {
        setEditingCharger(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (charger) => {
        setEditingCharger(charger);
        form.setFieldsValue({
            chargerName: charger.name,
            chargerCostId: charger.chargerCost?.id,
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
            chargerCostId: values.chargerCostId,
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
    const handleDelete = (chargerId) => {
        setDeleteModal({ open: true, id: chargerId });
    };


    // ==================== HELPERS ====================
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

    const formatTime = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
        } catch {
            return "";
        }
    };
    const confirmDelete = async () => {
        try {
            const res = await fetch(
                `http://222.255.214.35:8080/api/chargerPoint/admin/delete?chargerPointId=${deleteModal.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Xóa thất bại!");
            }

            message.success("Xóa trụ sạc thành công!");
            setDeleteModal({ open: false, id: null });
            fetchChargers();
        } catch (e) {
            message.error("Không thể xóa trụ sạc!");
        }
    };


    // ==================== LOADING ====================
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
            {/* HEADER */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 16 }}
                />
                <div>
                    <h2 style={{ margin: 0, fontSize: 24 }}>Chi tiết trạm sạc</h2>
                    <div style={{ color: "#888" }}>Quản lý và giám sát trạm</div>
                </div>
            </div>

            {/* POPUP */}
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
                        name="chargerCostId"
                        label="Loại cổng sạc"
                        rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                    >
                        <Select placeholder="Chọn loại cổng">
                            {chargerCosts.map(cost => (
                                <Select.Option key={cost.id} value={cost.id}>
                                    {cost.portType} - {cost.power} kW - {cost.cost.toLocaleString()} đ/kWh
                                </Select.Option>
                            ))}
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
            <Modal
                open={deleteModal.open}
                title="Xác nhận xóa trụ sạc"
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
                onOk={confirmDelete}
                onCancel={() => setDeleteModal({ open: false, id: null })}
            >
                Bạn có chắc chắn muốn xóa trụ sạc này? Hành động không thể hoàn tác.
            </Modal>


            {/* STATION CARD */}
            <Card style={{ borderRadius: 10, marginBottom: 24 }}>
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

                {stats && (
                    <>
                        {/* STATUS ROW */}
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

                        {/* REVENUE */}
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

            {/* CHARGER LIST */}
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
                    <Button type="primary" onClick={handleAdd} style={{ backgroundColor: "#222" }}>
                        + Thêm trụ sạc
                    </Button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {chargers.map(c => (
                        <Card key={c.id} style={{ borderRadius: 8 }} bodyStyle={{ padding: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <b style={{ fontSize: 16 }}>{c.name}</b>
                                    <div style={{ color: "#555", marginTop: 4 }}>
                                        {c.chargerCost?.portType || "?"} - {c.chargerCost?.power ? `${c.chargerCost.power}kW` : "?kW"}
                                    </div>
                                </div>

                                <div style={{ textAlign: "right", minWidth: 90 }}>
                                    {getChargerStatus(c.status)}
                                    <div style={{ marginTop: 8 }}>
                                        <EditOutlined style={{ color: "#1677ff", marginRight: 12, cursor: 'pointer' }} onClick={() => handleEdit(c)} />
                                        <DeleteOutlined
                                            style={{ color: "#ff4d4f", cursor: 'pointer' }}
                                            onClick={() => handleDelete(c.id)}
                                        />
                                    </div>
                                </div>
                            </div>

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
