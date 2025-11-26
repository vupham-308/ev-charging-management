// --- giữ nguyên header import
import React, { useEffect, useState } from "react";
import "../admin/ChargingStations.css";
import api from "../../config/axios";
import { Spin, message, Modal, Form, Input, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ChargingStations = () => {
    const [stations, setStations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingStation, setEditingStation] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [assignForm] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const [messageApi, messageContextHolder] = message.useMessage();

    const navigate = useNavigate();

    // ================== FETCH STATIONS ==================
    const fetchStations = async () => {
        setLoading(true);
        try {
            const res = await api.get("station/getAllStations");
            const sorted = res.data.sort((a, b) => b.id - a.id);
            setStations(sorted);
        } finally {
            setLoading(false);
        }
    };

    // ================== FETCH EMPLOYEES ==================
    const fetchEmployees = async () => {
        try {
            const res = await api.get("/admin/users/getAllStaffs");
            setEmployees(res.data);
        } catch {
            messageApi.error("Không lấy được danh sách nhân viên");
        }
    };

    useEffect(() => {
        fetchStations();
        fetchEmployees();
    }, []);

    // ================== SEARCH ==================
    const handleSearch = (value) => setSearch(value);

    const filteredStations = stations.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase())
    );

    // ================== OPEN ADD/EDIT MODAL ==================
    const openModal = (station = null) => {
        setIsEditMode(!!station);
        setEditingStation(station);

        if (station) {
            form.setFieldsValue({
                ...station,
                status: station.status || "ACTIVE",
                latitude: station.latitude,
                longitude: station.longitude,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ status: "ACTIVE" });
        }

        setIsModalOpen(true);
    };

    // ================== SUBMIT ADD / UPDATE ==================
    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                latitude: Number(values.latitude),
                longitude: Number(values.longitude),
            };

            if (isEditMode) {
                await api.put(`station/admin/update/${editingStation.id}`, payload);
                messageApi.success("Cập nhật trạm sạc thành công!");
            } else {
                const res = await api.post("station/admin/create", payload);
                const newStation = { ...(res.data || {}), ...payload };
                if (!newStation.id) newStation.id = Date.now();
                setStations((prev) => [newStation, ...prev]);
                messageApi.success("Thêm trạm sạc mới thành công!");
            }

            setIsModalOpen(false);
        } catch {
            messageApi.error("Lưu dữ liệu thất bại!");
        }
    };

    // ================== ASSIGN STAFF ==================
    const handleAssignSubmit = async (values) => {
        try {
            await api.put(`/admin/users/${values.employeeId}/assign-station/${values.stationId}`);
            messageApi.success("Gắn nhân viên thành công!");
            setIsAssignModalOpen(false);
        } catch {
            messageApi.error("Gắn nhân viên thất bại!");
        }
    };

    // ================== UI ==================
    if (loading) {
        return (
            <div className="stations-page loading">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div className="stations-page">
            {messageContextHolder}
            {contextHolder}

            <div className="stations-header">
                <h3>Trạm sạc</h3>

                <div style={{ display: "flex", gap: 8, flexGrow: 1, justifyContent: "flex-end" }}>
                    <button className="btn add" onClick={() => setIsAssignModalOpen(true)}>
                        Gắn nhân viên
                    </button>
                    <button className="btn add" onClick={() => openModal()}>
                        + Thêm trạm mới
                    </button>
                </div>
            </div>

            <input
                className="search-inputt"
                type="text"
                placeholder="🔍 Tìm kiếm trạm sạc theo tên hoặc địa chỉ..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="stations-list">
                {filteredStations.map((s, i) => {
                    const available = s.pointChargerAvailable || 0;
                    const maintenance = s.pointChargerOutOfService || 0;
                    const total = s.pointChargerTotal || 0;

                    // ĐÚNG THEO API
                    let using = total - available - maintenance;
                    if (using < 0) using = 0;

                    const status = s.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động";
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
                                    </div>
                                </div>

                                <p className="station-address">📍 {s.address}</p>

                                {/* ==================== 3 trạng thái + tổng ==================== */}
                                <div className="station-stats">
                                    <div className="stat green">
                                        {available}
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

            {/* Modal Add/Edit */}
            <Modal
                title={isEditMode ? "Cập nhật trạm sạc" : "Thêm trạm sạc mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên trạm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true },
                            { pattern: /^\d{10}$/, message: "Số điện thoại phải đúng 10 chữ số" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Latitude */}
                    <Form.Item
                        name="latitude"
                        label="Vĩ độ (Latitude)"
                        rules={[
                            { required: true },
                            { pattern: /^-?\d+(\.\d{1,6})?$/, message: "Tối đa 6 chữ số sau dấu phẩy" },
                            {
                                validator(_, v) {
                                    const n = Number(v);
                                    if (n < -90 || n > 90) return Promise.reject("Vĩ độ phải từ -90 đến 90");
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Longitude */}
                    <Form.Item
                        name="longitude"
                        label="Kinh độ (Longitude)"
                        rules={[
                            { required: true },
                            { pattern: /^-?\d+(\.\d{1,6})?$/, message: "Tối đa 6 chữ số sau dấu phẩy" },
                            {
                                validator(_, v) {
                                    const n = Number(v);
                                    if (n < -180 || n > 180)
                                        return Promise.reject("Kinh độ phải từ -180 đến 180");
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
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

            {/* Modal Assign */}
            <Modal
                title="Gán nhân viên quản lý trạm sạc"
                open={isAssignModalOpen}
                onCancel={() => setIsAssignModalOpen(false)}
                footer={null}
            >
                <Form form={assignForm} layout="vertical" onFinish={handleAssignSubmit}>
                    <Form.Item name="employeeId" label="Chọn nhân viên" rules={[{ required: true }]}>
                        <Select showSearch optionFilterProp="children">
                            {employees.map((e) => (
                                <Option key={e.id} value={e.id}>{e.name || e.email}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="stationId" label="Chọn trạm" rules={[{ required: true }]}>
                        <Select showSearch optionFilterProp="children">
                            {stations.map((st) => (
                                <Option key={st.id} value={st.id}>{st.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Gán nhân viên
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChargingStations;
