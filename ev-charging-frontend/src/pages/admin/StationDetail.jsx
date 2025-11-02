import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Tag, Button, message, Spin } from "antd";
import {
    ArrowLeftOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Modal, Form, Input, Select } from "antd";

const StationDetail = () => {
    const { id } = useParams();
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(false);
    // Trong component StationDetail
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCharger, setEditingCharger] = useState(null);
    const [form] = Form.useForm();

    // Mở popup thêm mới
    const handleAddCharger = () => {
        setEditingCharger(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Mở popup sửa trụ
    const handleEditCharger = (charger) => {
        setEditingCharger(charger);
        form.setFieldsValue({
            chargerName: charger.name,
            type: charger.type,
            status: charger.status,
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingCharger) {
                // Gọi API sửa trụ, gửi values + id trụ
                console.log("Sửa trụ:", editingCharger.id, values);
                message.success("Cập nhật trụ sạc thành công!");
            } else {
                // Gọi API thêm trụ mới
                console.log("Thêm trụ mới:", values);
                message.success("Thêm trụ sạc thành công!");
            }
            setIsModalVisible(false);
            form.resetFields();
        }).catch(info => {
            console.log("Validate Failed:", info);
        });
    };
    const fetchStationDetail = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://222.255.214.35:8080/api/station/admin/detail/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        Accept: "application/json",
                    },
                }
            );
            if (!res.ok) throw new Error("Lỗi khi tải chi tiết trạm");
            const data = await res.json();
            setStation(data);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStationDetail();
    }, [id]);

    if (loading || !station) {
        return (
            <div style={{ textAlign: "center", paddingTop: 100 }}>
                <Spin size="large" tip="Đang tải chi tiết trạm..." />
</div>
        );
    }

    // Chuyển trạng thái code thành màu & text như mẫu
    const getStatusTag = (status) => {
        if (status === "ACTIVE")
            return (
                <Tag style={{ backgroundColor: "#daf7dc", color: "#3b9d3b", fontWeight: 600 }}>
                    Hoạt động
                </Tag>
            );
        return (
            <Tag style={{ backgroundColor: "#f6d4d5", color: "#a43a3a", fontWeight: 600 }}>
                Bảo trì
            </Tag>
        );
    };

    // Trạng thái trụ sạc theo ảnh mẫu
    const getChargerStatusTag = (status) => {
        if (status === "ACTIVE")
            return (
                <Tag style={{ backgroundColor: "#eaf8e8", color: "#3b9d3b", fontWeight: 600, fontSize: 12 }}>
                    Có sẵn
                </Tag>
            );
        if (status === "IN_USE")
            return (
                <Tag
                    style={{
                        backgroundColor: "#fff7db",
                        color: "#a88613",
                        fontWeight: 600,
                        fontSize: 12,
                    }}
                >
                    Đang sử dụng
                </Tag>
            );
        return (
            <Tag style={{ backgroundColor: "#fbeaea", color: "#a43a3a", fontWeight: 600, fontSize: 12 }}>
                Bảo trì
            </Tag>
        );
    };

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "auto", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
            <Modal
                title={editingCharger ? "Sửa trụ sạc" : "Thêm trụ sạc mới"}
                open={isModalVisible} // ant design v4 trở lên dùng `open` thay `visible`
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCharger ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" name="charger_form">
                    <Form.Item
                        name="chargerName"
                        label="Tên trụ sạc"
                        rules={[{ required: true, message: "Vui lòng nhập tên trụ sạc" }]}
                    >
                        <Input placeholder="Nhập tên trụ sạc" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại cổng sạc"
                        rules={[{ required: true, message: "Vui lòng chọn loại cổng sạc" }]}
                    >
                        <Select placeholder="Chọn loại cổng sạc">
                            <Select.Option value="AC">AC</Select.Option>
                            <Select.Option value="CCS">CCS</Select.Option>
                            <Select.Option value="CHAdeMO">CHAdeMO</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
name="status"
                        label="Tình trạng ban đầu"
                        rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
                    >
                        <Select placeholder="Chọn tình trạng ban đầu">
                            <Select.Option value="AVAILABLE">Có sẵn</Select.Option>
                            <Select.Option value="OUT_OF_SERVICE">Đang bảo trì</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Header Quay lại + Tiêu đề */}
            <div style={{ marginBottom: 24 }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => window.history.back()}
                    style={{ padding: 0, marginRight: 12 }}
                />
                <span style={{ fontWeight: 600, fontSize: 18 }}>Chi tiết trạm sạc</span>
                <div style={{ fontSize: 12, color: "#555" }}>Quản lý và giám sát trạm</div>
            </div>

            {/* Card thông tin trạm */}
            <Card
                style={{
                    borderRadius: 8,
                    marginBottom: 24,
                    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
                }}
                bodyStyle={{ padding: "24px" }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                    }}
                >
                    <h2 style={{ margin: 0, fontWeight: "bold", fontSize: 22 }}>
                        {station.name}
                    </h2>
                    {getStatusTag(station.status)}
                </div>
                <div
                    style={{
                        fontSize: 14,
                        color: "#666",
                        marginBottom: 20,
                    }}
                >
                    <span>📍 {station.address}</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 32,
                        fontSize: 14,
                        color: "#555",
                        marginBottom: 12,
                        alignItems: "center",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <PhoneOutlined />
                        <span>Điện thoại</span>
                        <span style={{ marginLeft: 4, color: "#222" }}>
                            {station.phone || "-"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
<MailOutlined />
                        <span>Email</span>
                        <span style={{ marginLeft: 4, color: "#222" }}>
                            {station.email || "-"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Dùng icon thay vì ThunderboltOutlined */}
                        <span
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: "#555",
                                userSelect: "none",
                            }}
                        >
                            ⚡
                        </span>
                        <span>Tổng trụ</span>
                        <span style={{ marginLeft: 4, fontWeight: "600" }}>
                            {station.totalChargers} trụ
                        </span>
                    </div>
                </div>

                {/* Thống kê trạng thái trụ */}
                <div style={{ display: "flex", gap: 16 }}>
                    <Card
                        style={{
                            flex: 1,
                            backgroundColor: "#eaf8e8",
                            textAlign: "center",
                            borderRadius: 6,
                            padding: 12,
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ color: "#3b9d3b", fontWeight: 600, fontSize: 20 }}>
                            {station.availableChargers}
                        </div>
                        <div style={{ fontSize: 14, color: "#3b9d3b" }}>Có sẵn</div>
                    </Card>
                    <Card
                        style={{
                            flex: 1,
                            backgroundColor: "#fff7db",
                            textAlign: "center",
                            borderRadius: 6,
                            padding: 12,
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ color: "#a88613", fontWeight: 600, fontSize: 20 }}>
                            {station.occupiedChargers}
                        </div>
                        <div style={{ fontSize: 14, color: "#a88613" }}>Đang sử dụng</div>
                    </Card>
                    <Card
                        style={{
                            flex: 1,
                            backgroundColor: "#fbeaea",
                            textAlign: "center",
                            borderRadius: 6,
                            padding: 12,
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
<div style={{ color: "#a43a3a", fontWeight: 600, fontSize: 20 }}>
                            {station.outOfServiceChargers}
                        </div>
                        <div style={{ fontSize: 14, color: "#a43a3a" }}>Bảo trì</div>
                    </Card>
                </div>
            </Card>

            {/* Card doanh thu, khách hàng, phiên sạc */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <Card style={{ flex: 1, borderRadius: 8, padding: "16px 24px" }}>
                    <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                        Doanh thu tuần này
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "600" }}>
                        2.867.000 <span style={{ fontSize: 18 }}>₫</span>
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "green",
                            fontWeight: "bold",
                            marginTop: 4,
                        }}
                    >
                        $
                    </div>
                </Card>
                <Card style={{ flex: 1, borderRadius: 8, padding: "16px 24px" }}>
                    <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                        Khách hàng tuần này
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "600" }}>{24}</div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "#1890ff",
                            fontWeight: "bold",
                            marginTop: 4,
                        }}
                    >
                        <UserOutlined />
                    </div>
                </Card>
                <Card style={{ flex: 1, borderRadius: 8, padding: "16px 24px" }}>
                    <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                        Tổng phiên sạc tuần này
                    </div>
                    <div style={{ fontSize: 24, fontWeight: "600" }}>{18}</div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "#a569d3",
                            fontWeight: "bold",
                            marginTop: 4,
                        }}
                    >
                        {/* Dùng icon nhịp tim để tượng trưng */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
<path d="M3 12h4l3 8 4-16 3 8h4" />
                        </svg>
                    </div>
                </Card>
            </div>

            {/* Danh sách trụ sạc */}
            <div
                style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: "#fff",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 16,
                        alignItems: "center",
                    }}
                >
                    <div>
                        <h3 style={{ marginBottom: 2, fontWeight: 600 }}>Danh sách trụ sạc</h3>
                        <div style={{ fontSize: 12, color: "#888" }}>
                            Quản lý và điều khiển các trụ sạc tại trạm
                        </div>
                    </div>
                    <Button
                        type="primary"
                        style={{ backgroundColor: "#0a0a23", borderColor: "#0a0a23" }}
                        icon={<span style={{ fontWeight: "bold", fontSize: 18 }}>+</span>}
                        onClick={handleAddCharger}
                    >
                        Thêm trụ sạc
                    </Button>

                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {/* Ví dụ các trụ sạc */}
                    <Card
                        style={{
                            flex: "1 1 250px",
                            borderRadius: 8,
                            boxShadow: "0 1px 2px rgb(0 0 0 / 0.1)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <b>Trụ #1</b>{" "}
                                <Tag
                                    style={{
                                        backgroundColor: "#fff7db",
                                        color: "#a88613",
                                        fontWeight: 600,
                                        fontSize: 12,
                                        verticalAlign: "middle",
                                    }}
                                >
                                    Đang sử dụng
                                </Tag>
                            </div>
                            <div>
                                <EditOutlined
                                    style={{ color: "#1a73e8", marginRight: 12, cursor: "pointer" }}
                                    onClick={() => handleEditCharger(chargerData)} // chargerData là dữ liệu trụ hiện tại
                                />
<DeleteOutlined style={{ color: "#d93025", cursor: "pointer" }} />
                            </div>
                        </div>
                        <div style={{ marginTop: 4, color: "#555" }}>CCS - 150kW</div>
                        <div style={{ marginTop: 8, display: "flex", gap: 16, fontSize: 14, color: "#555" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <UserOutlined />
                                <span>Nguyễn Văn A</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <ClockCircleOutlined />
                                <span>Bắt đầu: 14:30</span>
                            </div>
                        </div>
                    </Card>

                    <Card
                        style={{
                            flex: "1 1 250px",
                            borderRadius: 8,
                            boxShadow: "0 1px 2px rgb(0 0 0 / 0.1)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <b>Trụ #2</b>{" "}
                                <Tag
                                    style={{
                                        backgroundColor: "#eaf8e8",
                                        color: "#3b9d3b",
                                        fontWeight: 600,
                                        fontSize: 12,
                                        verticalAlign: "middle",
                                    }}
                                >
                                    Có sẵn
                                </Tag>
                            </div>
                            <div>
                                <EditOutlined style={{ color: "#1a73e8", marginRight: 12, cursor: "pointer" }} />
                                <DeleteOutlined style={{ color: "#d93025", cursor: "pointer" }} />
                            </div>
                        </div>
                        <div style={{ marginTop: 4, color: "#555" }}>CCS - 150kW</div>
                    </Card>

                    <Card
                        style={{
                            flex: "1 1 250px",
                            borderRadius: 8,
                            boxShadow: "0 1px 2px rgb(0 0 0 / 0.1)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <b>Trụ #3</b>{" "}
                                <Tag
                                    style={{
                                        backgroundColor: "#fff7db",
                                        color: "#a88613",
fontWeight: 600,
                                        fontSize: 12,
                                        verticalAlign: "middle",
                                    }}
                                >
                                    Đang sử dụng
                                </Tag>
                            </div>
                            <div>
                                <EditOutlined style={{ color: "#1a73e8", marginRight: 12, cursor: "pointer" }} />
                                <DeleteOutlined style={{ color: "#d93025", cursor: "pointer" }} />
                            </div>
                        </div>
                        <div style={{ marginTop: 4, color: "#555" }}>CHAdeMO - 50kW</div>
                        <div style={{ marginTop: 8, display: "flex", gap: 16, fontSize: 14, color: "#555" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <UserOutlined />
                                <span>Trần Thị B</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <ClockCircleOutlined />
                                <span>Bắt đầu: 15:00</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>


    );
};

export default StationDetail;