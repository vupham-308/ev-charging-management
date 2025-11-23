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

    // Lấy danh sách trạm
    const fetchStations = async () => {
        setLoading(true);
        try {
            const res = await api.get("station/getAllStations");

            // Sắp xếp theo ID mới nhất lên đầu
            const sorted = res.data.sort((a, b) => b.id - a.id);

            setStations(sorted);
        } finally {
            setLoading(false);
        }
    };
    // Lấy danh sách nhân viên
    const fetchEmployees = async () => {
        try {
            const res = await api.get("/admin/users/getAllStaffs");
            setEmployees(res.data);
        } catch (error) {
            console.error(error);
            messageApi.error("Không lấy được danh sách nhân viên");
        }
    };

    useEffect(() => {
        fetchStations();
        fetchEmployees();
    }, []);

    // Tìm kiếm trạm
    const handleSearch = async (value) => {
        setSearch(value);
        if (!value.trim()) {
            fetchStations();
            return;
        }

        try {
            const res = await api.get(`station/search?keyword=${encodeURIComponent(value)}`);
            setStations(res.data);
        } catch (error) {
            console.error(error);
            messageApi.error("Không thể tìm kiếm trạm!");
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
                latitude: station.latitude,
                longitude: station.longitude,
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
                    messageApi.success("Đã xóa trạm thành công!");
                    fetchStations();
                } catch (error) {
                    console.error(error);
                    messageApi.error("Xóa trạm thất bại!");
                }
            },
        });
    };

    // Submit form (Thêm hoặc cập nhật)
    const handleSubmit = async (values) => {
        try {
            if (isEditMode) {
                await api.put(
                    `station/admin/update/${editingStation.id}`,
                    {
                        name: values.name,
                        address: values.address,
                        phone: values.phone,
                        email: values.email,
                        status: values.status,
                        latitude: Number(values.latitude),
                        longitude: Number(values.longitude),
                    }
                );

                messageApi.success("Cập nhật trạm sạc thành công!");
            } else {
                const res = await api.post("station/admin/create", {
                    id: "",
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                    email: values.email,
                    status: values.status,
                    latitude: Number(values.latitude),
                    longitude: Number(values.longitude),
                });

                // Lấy station vừa tạo (từ BE trả về hoặc từ form nếu BE không trả ID)
                const newStation = {
                    ...(res.data || {}), // nếu backend return {id,...}
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                    email: values.email,
                    status: values.status,
                    latitude: Number(values.latitude),
                    longitude: Number(values.longitude),
                };

                // Nếu BE không trả ID → dùng Date.now để tạo ID tạm
                if (!newStation.id) newStation.id = Date.now();

                // ĐẨY LÊN ĐẦU LIST
                setStations(prev => [newStation, ...prev]);

                messageApi.success("Thêm trạm sạc mới thành công!");
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Lỗi khi lưu trạm:", error.response?.data || error);
            messageApi.error("Lưu dữ liệu thất bại!");
        }
    };

    // Mở modal gán nhân viên
    const openAssignModal = () => {
        assignForm.resetFields();
        setIsAssignModalOpen(true);
    };

    // Submit gắn nhân viên
const handleAssignSubmit = async (values) => {
        try {
            await api.put(`/admin/users/${values.employeeId}/assign-station/${values.stationId}`);

            messageApi.success("Gắn nhân viên thành công!");
            setIsAssignModalOpen(false);
        } catch (error) {
            console.error("❌ Gắn nhân viên thất bại:", error.response?.data || error);
            messageApi.error("Gắn nhân viên thất bại!");
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
            {messageContextHolder}
            {contextHolder}

            <div className="stations-header">
                <h3>Trạm sạc</h3>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexGrow: 1 }}>
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
                {stations.map((s, i) => {
                    const ready = s.pointChargerAvailable || 0;
                    const total = s.pointChargerTotal || 0;
                    const maintenance = s.pointChargerOutOfService || 0;
                    const using = total - ready - maintenance;

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
                                        <button onClick={() => navigate(`/admin/station/${s.id}`)}>
                                            👁 Xem
                                        </button>
<button onClick={() => openModal(s)}>✏️ Sửa</button>
                                    </div>
                                </div>

                                <p className="station-address">📍 {s.address}</p>

                                <div className="station-stats">
                                    <div className="stat green">
                                        {ready}
                                        <span>Có sẵn</span>
                                    </div>
                                    <div className="stat orange">
                                        {using < 0 ? 0 : using}
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

            {/* Modal Thêm/Sửa */}
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

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
{ pattern: /^[0-9]+$/, message: "Số điện thoại chỉ được nhập số" },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại..." />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input placeholder="Nhập email..." />
                    </Form.Item>

                    {/* Latitude */}
                    <Form.Item
                        name="latitude"
                        label="Vĩ độ (Latitude)"
                        rules={[
                            { required: true, message: "Vĩ độ không được để trống" },
                            {
                                validator(_, value) {
                                    if (value === "" || value === undefined || value === null)
                                        return Promise.reject("Vĩ độ không được để trống");

                                    const num = Number(value);
                                    if (isNaN(num)) return Promise.reject("Vĩ độ phải là số");
                                    if (num < -90 || num > 90)
                                        return Promise.reject("Vĩ độ phải từ -90 đến 90");

                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            step="0.000001"
                            min={-90}
                            max={90}
                            placeholder="Nhập vĩ độ (VD: 10.123456)"
                        />
                    </Form.Item>

                    {/* Longitude */}
                    <Form.Item
                        name="longitude"
                        label="Kinh độ (Longitude)"
                        rules={[
                            { required: true, message: "Kinh độ không được để trống" },
                            {
                                validator(_, value) {
                                    if (value === "" || value === undefined || value === null)
                                        return Promise.reject("Kinh độ không được để trống");

                                    const num = Number(value);
                                    if (isNaN(num)) return Promise.reject("Kinh độ phải là số");
                                    if (num < -180 || num > 180)
                                        return Promise.reject("Kinh độ phải từ -180 đến 180");
return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            step="0.000001"
                            min={-180}
                            max={180}
                            placeholder="Nhập kinh độ (VD: 106.123456)"
                        />
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

            {/* Modal Gắn nhân viên */}
            <Modal
                title="Gán nhân viên quản lý trạm sạc"
                open={isAssignModalOpen}
                onCancel={() => setIsAssignModalOpen(false)}
                footer={null}
            >
                <Form form={assignForm} layout="vertical" onFinish={handleAssignSubmit}>
                    <Form.Item
                        name="employeeId"
                        label="Chọn nhân viên"
                        rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
                    >
                        <Select
                            placeholder="Tìm kiếm nhân viên..."
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {employees.map((emp) => (
                                <Option key={emp.id} value={emp.id}>
                                    {emp.name || emp.username || emp.email || `ID: ${emp.id}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="stationId"
                        label="Chọn trạm sạc"
                        rules={[{ required: true, message: "Vui lòng chọn trạm sạc" }]}
                    >
                        <Select
                            placeholder="Tìm kiếm trạm sạc..."
                            showSearch
optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {stations.map((station) => (
                                <Option key={station.id} value={station.id}>
                                    {station.name}
                                </Option>
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