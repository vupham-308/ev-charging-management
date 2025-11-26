import React, { useEffect, useState } from "react";
import { FaBolt, FaEdit, FaCar, FaTrash } from "react-icons/fa";
import api from "../../config/axios";
import "../admin/ChargingRates.css";

const ChargingRates = () => {
    const [rates, setRates] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // Popup state cho brand
    const [showBrandPopup, setShowBrandPopup] = useState(false);
    const [editBrand, setEditBrand] = useState(null);
    const [brandForm, setBrandForm] = useState({
        name: "",
        portType: "",
        battery: "",
    });

    // Popup state cho giá sạc
    const [showRatePopup, setShowRatePopup] = useState(false);
    const [editRate, setEditRate] = useState(null);
    const [rateForm, setRateForm] = useState({
        portType: "",
        capacity: "",
        cost: "",
    });

    useEffect(() => {
        fetchRates();
        fetchBrands();
    }, []);

    const fetchRates = async () => {
        try {
            const res = await api.get("charger-cost");
            const formatted = res.data.map((item) => ({
                id: item.id,
                type: item.portType,
                cost: item.cost,
                power: item.power ? item.power + "kW" : "N/A", // lấy từ API
            }));
            setRates(formatted);
        } catch {
            alert("Không thể tải giá sạc");
        }
    };


    const fetchBrands = async () => {
        try {
            const res = await api.get("car-branch/getAll");
            // Lọc chỉ những brand active/status = true
            const activeBrands = res.data.filter((brand) => brand.active === true);
            setBrands(activeBrands);
        } catch {
            alert("Không thể tải danh sách hãng xe");
        } finally {
            setLoading(false);
        }
    };

    // --- Rate popup ---
    const openAddRatePopup = () => {
        setEditRate(null);
        setRateForm({ portType: "", capacity: "", cost: "" });
        setShowRatePopup(true);
    };

    const openEditRatePopup = (rate) => {
        setEditRate(rate);
        setRateForm({
            portType: rate.type,
            capacity: rate.capacity,
            cost: rate.cost,
        });
        setShowRatePopup(true);
    };

    const closeRatePopup = () => setShowRatePopup(false);

    const saveRate = async () => {
        if (!rateForm.portType || !rateForm.capacity || rateForm.cost === "") {
            alert("Vui lòng nhập đầy đủ");
            return;
        }

        try {
            const payload = {
                portType: rateForm.portType,
                capacity: Number(rateForm.capacity),
                cost: Number(rateForm.cost),
            };

            if (editRate) {
                // Edit: luôn dùng PUT với id
                await api.put(`charger-cost/${editRate.id}`, payload);
            } else {
// Add mới: POST chỉ nếu portType chưa tồn tại
                const exists = rates.find(r => r.type === rateForm.portType);
                if (exists) {
                    alert("Loại cổng này đã tồn tại, vui lòng chọn chỉnh sửa!");
                    return;
                }
                await api.post(`charger-cost`, payload);
            }

            alert("Lưu thành công!");
            closeRatePopup();
            fetchRates();
        } catch (err) {
            console.log("Lỗi:", err.response?.data || err.message);
            alert("Lỗi khi lưu giá sạc!");
        }
    };


    // --- Brand popup ---
    const openAddBrandPopup = () => {
        setEditBrand(null);
        setBrandForm({ name: "", portType: "", battery: "" });
        setShowBrandPopup(true);
    };

    const openEditBrandPopup = (brand) => {
        setEditBrand(brand);
        setBrandForm({
            name: brand.brand || brand.name,
            portType: brand.portType,
            battery: brand.batteryCapacity || brand.battery,
        });
        setShowBrandPopup(true);
    };

    const closeBrandPopup = () => setShowBrandPopup(false);

    const saveBrand = async () => {
        if (!brandForm.name || !brandForm.portType || !brandForm.battery) {
            alert("Vui lòng nhập đầy đủ!");
            return;
        }

        try {
            const payload = {
                brand: brandForm.name,
                portType: brandForm.portType,
                batteryCapacity: Number(brandForm.battery),
                active: true,
            };

            if (editBrand) {
                await api.put(`car-branch/admin/edit/${editBrand.id}`, payload);
            } else {
                await api.post(`car-branch/admin/create`, payload);
            }

            alert("Lưu thành công!");
            closeBrandPopup();
            fetchBrands();
        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Lỗi khi lưu thương hiệu!");
        }
    };

    const deleteBrand = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa?")) return;
        try {
            await api.delete(`car-branch/admin/delete/${id}`);
            fetchBrands();
        } catch {
            alert("Không thể xóa!");
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="charging-rates-container">
            {/* ========== Phần giá sạc ========== */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div>
                    <h2>Cài đặt hệ thống</h2>
                    <p className="text-gray-600 mb-0">Điều chỉnh giá sạc theo loại cổng.</p>
                </div>
                <button className="btn-add-brand" onClick={openAddRatePopup}>
                    + Thêm giá trạm sạc
                </button>
            </div>

            {rates.map((rate) => (
                <div className="rate-card" key={rate.id}>
<div className="rate-info">
                        <FaBolt className="rate-icon" />
                        <div className="rate-text">
                            <div className="rate-header">
                                <span>{rate.power}</span>
                                <span className="rate-type">{rate.type}</span>
                            </div>
                            <p className="rate-price">{rate.cost} VND/phút</p>
                        </div>
                    </div>

                    <div className="rate-actions">
                        <button className="btn-edit" onClick={() => openEditRatePopup(rate)}>
                            <FaEdit /> Sửa
                        </button>
                    </div>
                </div>
            ))}

            {/* ========== Quản lý thương hiệu ========== */}
            <div className="brand-header">
                <div>
                    <h2>Quản lý thương hiệu xe</h2>
                    <p className="brand-desc">Danh sách thương hiệu xe điện.</p>
                </div>

                <button className="btn-add-brand" onClick={openAddBrandPopup}>
                    + Thêm thương hiệu
                </button>
            </div>

            {brands.map((brand) => (
                <div className="rate-card" key={brand.id}>
                    <div className="rate-info">
                        <FaCar className="rate-icon" />
                        <div>
                            <div className="rate-header">
                                <span>{brand.brand || brand.name}</span>
                                <span className="rate-type">{brand.portType}</span>
                            </div>
                            <p className="battery">Dung lượng pin: {brand.batteryCapacity || brand.battery} kWh</p>
                        </div>
                    </div>

                    <div className="rate-actions">
                        <button className="btn-edit" onClick={() => openEditBrandPopup(brand)}>
                            <FaEdit /> Sửa
                        </button>
                        <button className="btn-delete" onClick={() => deleteBrand(brand.id)}>
                            <FaTrash /> Xóa
                        </button>
                    </div>
                </div>
            ))}

            {/* Popup giá sạc */}
            {showRatePopup && (
                <div className="popup-overlay">
                    <div className="brand-popup">
                        <button className="popup-close" onClick={closeRatePopup}>
                            ×
                        </button>
                        <h2>{editRate ? "Chỉnh sửa giá trạm sạc" : "Thêm giá trạm sạc"}</h2>
                        <p className="popup-subtitle">Nhập thông tin giá trạm sạc.</p>

                        <div className="popup-field">
<label>Loại cổng sạc</label>
                            <select
                                value={rateForm.portType}
                                onChange={(e) => setRateForm({ ...rateForm, portType: e.target.value })}
                            >
                                <option value="">Chọn loại cổng</option>
                                <option value="AC">AC (22kW)</option>
                                <option value="CCS">CCS (250kW)</option>
                                <option value="CHAdeMO">CHAdeMO (100kW)</option>
                            </select>
                        </div>

                        <div className="popup-field">
                            <label>Công suất (kW)</label>
                            <input
                                type="number"
                                value={rateForm.capacity}
                                onChange={(e) => setRateForm({ ...rateForm, capacity: e.target.value })}
                                placeholder="Nhập công suất"
                            />
                        </div>

                        <div className="popup-field">
                            <label>Giá (VND/phút)</label>
                            <input
                                type="number"
                                value={rateForm.cost}
                                onChange={(e) => setRateForm({ ...rateForm, cost: e.target.value })}
                                placeholder="Nhập giá"
                            />
                        </div>

                        <div className="popup-actions">
                            <button className="btn-cancel" onClick={closeRatePopup}>
                                Hủy
                            </button>
                            <button className="btn-save-dark" onClick={saveRate}>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup thương hiệu */}
            {showBrandPopup && (
                <div className="popup-overlay">
                    <div className="brand-popup">
                        <button className="popup-close" onClick={closeBrandPopup}>
                            ×
                        </button>
                        <h2>{editBrand ? "Chỉnh sửa thương hiệu xe" : "Thêm thương hiệu xe"}</h2>
                        <p className="popup-subtitle">Nhập thông tin thương hiệu.</p>

                        <div className="popup-field">
                            <label>Tên thương hiệu / Model</label>
                            <input
                                value={brandForm.name}
                                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                            />
                        </div>
<div className="popup-field">
                            <label>Dung lượng pin (kWh)</label>
                            <input
                                type="number"
                                value={brandForm.battery}
                                onChange={(e) => setBrandForm({ ...brandForm, battery: e.target.value })}
                            />
                        </div>

                        <div className="popup-field">
                            <label>Loại cổng sạc</label>
                            <select
                                value={brandForm.portType}
                                onChange={(e) => setBrandForm({ ...brandForm, portType: e.target.value })}
                            >
                                <option value="">Chọn cổng</option>
                                <option value="AC">AC</option>
                                <option value="CCS">CCS</option>
                                <option value="CHAdeMO">CHAdeMO</option>
                            </select>
                        </div>

                        <div className="popup-actions">
                            <button className="btn-cancel" onClick={closeBrandPopup}>
                                Hủy
                            </button>
                            <button className="btn-save-dark" onClick={saveBrand}>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChargingRates;
