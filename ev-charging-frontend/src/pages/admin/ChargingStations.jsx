import React, { useEffect, useState } from "react";
import "../admin/ChargingStations.css";
import api from "../../config/axios";
import { Spin, message, Modal, Form, Input, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ChargingStations = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingStation, setEditingStation] = useState(null);
    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const navigate = useNavigate();

    // Lấy danh sách trạm
    const fetchStations = async () => {
        setLoading(true);
        try {
            const res = await api.get("station/getAllStations");
            setStations(res.data);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải danh sách trạm sạc!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    // Tìm kiếm trạm
    const handleSearch = async (value) => {
        setSearch(value);
        if (!value.trim()) {
            fetchStations();
            return;
        }

        try {
            const res = await api.get(
                `station/search?keyword=${encodeURIComponent(value)}`
            );
            setStations(res.data);
        } catch (error) {
            console.error(error);
            message.error("Không thể tìm kiếm trạm!");
        }
    };

    // Xem chi tiết trạm
    const handleView = async (id) => {
        try {
            const res = await api.get(`station/admin/detail/${id}`);
            const data = res.data;
            Modal.info({
                title: "Chi tiết trạm sạc",
                content: (
                    <div>
                        <p><b>Tên:</b> {data.name}</p>
                        <p><b>Địa chỉ:</b> {data.address}</p>
                        <p><b>Trụ sạc sẵn sàng:</b> {data.pointChargerAvailable}</p>
                        <p><b>Trụ đang bảo trì:</b> {data.pointChargerMaintenance}</p>
                        <p><b>Tổng trụ sạc:</b> {data.pointChargerTotal}</p>
                        <p><b>Cổng hỗ trợ:</b> {data.portType?.join(", ")}</p>
                    </div>
                ),
            });
        } catch (error) {
            message.error("Không thể tải chi tiết trạm!");
        }
    };

    // Mở form thêm hoặc sửa
    const openModal = (station = null) => {
        setIsEditMode(!!station);
        setEditingStation(station);

        if (station) {
            form.setFieldsValue({
                ...station,
                status: station.status || "ACTIVE",
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ status: "ACTIVE" });
        }

        setIsModalOpen(true);
    };

    // Xóa trạm
    const handleDelete = async (id) => {
        modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc muốn xóa trạm này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            okButtonProps: { danger: true },
            async onOk() {
                try {
                    await api.delete(`station/admin/delete/${id}`);
                    message.success("Đã xóa trạm thành công!");
                    fetchStations();
                } catch (error) {
                    console.error(error);
                    message.error("Xóa trạm thất bại!");
                }
            },
        });
    };

    // Submit form (Thêm hoặc Cập nhật)
    const handleSubmit = async (values) => {
        try {
            if (isEditMode) {
                await api.put(`station/admin/update/${editingStation.id}`, {
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                    email: values.email,
                    status: values.status,
                });
                message.success("Cập nhật trạm thành công!");
            } else {
                await api.post("station/admin/create", {
                    id: "",
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                    email: values.email,
                    status: values.status,
                });
                message.success("Thêm trạm mới thành công!");
            }

            setIsModalOpen(false);
            fetchStations();
        } catch (error) {
            console.error("Lỗi khi lưu trạm:", error.response?.data || error);
            message.error("Lưu dữ liệu thất bại!");
        }
    };

    if (loading) {
        return (
            <div className="stations-page loading">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div className="stations-page">
            <div className="stations-header">
                <h3>Trạm sạc</h3>
                <button className="btn add" onClick={() => openModal()}>
                    + Thêm trạm mới
                </button>
            </div>

            <input
                className="search-inputt"
                type="text"
                placeholder="🔍 Tìm kiếm trạm sạc theo tên hoặc địa chỉ..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="stations-list">
                {stations.map((s, i) => {
                    const ready = s.pointChargerAvailable || 0;
                    const total = s.pointChargerTotal || 0;
                    const maintenance = s.pointChargerMaintenance || 0;
                    const using = total - ready - maintenance;
                    //  Hiển thị trạng thái theo DB (ACTIVE / INACTIVE)
                    const status = s.status === "ACTIVE" ? "Hoạt động" : "Bảo trì";
                    const color = s.status === "ACTIVE" ? "green" : "red";

                    return (
                        <div key={i} className="station-card">
                            <div className="station-left">
                                <div className="station-header-actions">
                                    <div className="station-header">
                                        <h4>{s.name}</h4>
                                        <span className={`status-text ${color}`}>{status}</span>
                                    </div>

                                    <div className="station-actions">
                                        <button onClick={() => navigate(`/admin/station/${s.id}`)}>👁 Xem</button>
                                        <button onClick={() => openModal(s)}>✏️ Sửa</button>
                                        <button onClick={() => handleDelete(s.id)}>🗑 Xóa</button>
                                    </div>
                                </div>

                                <p className="station-address">📍 {s.address}</p>

                                <div className="station-stats">
                                    <div className="stat green">
                                        {ready}
                                        <span>Có sẵn</span>
                                    </div>
                                    <div className="stat orange">
                                        {using}
                                        <span>Đang sử dụng</span>
                                    </div>
                                    <div className="stat red">
                                        {maintenance}
                                        <span>Bảo trì</span>
                                    </div>
                                    <div className="stat total">
                                        {total}
                                        <span>Tổng cộng</span>
                                    </div>
                                </div>

                                <p className="port-types">
                                    Cổng hỗ trợ: <b>{s.portType?.join(", ")}</b>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal thêm/sửa */}
            <Modal
                title={isEditMode ? "Cập nhật trạm sạc" : "Thêm trạm sạc mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ status: "ACTIVE" }}
                >
                    <Form.Item
                        name="name"
                        label="Tên trạm"
                        rules={[{ required: true, message: "Vui lòng nhập tên trạm" }]}
                    >
                        <Input placeholder="Nhập tên trạm..." />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                    >
                        <Input placeholder="Nhập địa chỉ..." />
                    </Form.Item>

                    <Form.Item name="phone" label="Số điện thoại">
                        <Input placeholder="Nhập số điện thoại..." />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input placeholder="Nhập email..." />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                    >
                        <Select>
                            <Option value="ACTIVE">Hoạt động</Option>
                            <Option value="INACTIVE">Ngưng hoạt động</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {isEditMode ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Context holder cho Modal.confirm */}
            {contextHolder}
        </div>
    );
};

export default ChargingStations;
