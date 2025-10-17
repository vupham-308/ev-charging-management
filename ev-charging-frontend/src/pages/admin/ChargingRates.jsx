import React, { useState } from "react";
import { FaBolt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "../admin/ChargingRates.css";

const ChargingRates = () => {
    const [rates, setRates] = useState([
        { id: 1, power: "7kW", type: "AC", price: 120, editing: false },
        { id: 2, power: "22kW", type: "CHAdeMO", price: 180, editing: false },
        { id: 3, power: "50kW", type: "CCS", price: 320, editing: false },
    ]);

    const handleEdit = (id) =>
        setRates(rates.map(r => r.id === id ? { ...r, editing: true } : r));

    const handleCancel = (id) =>
        setRates(rates.map(r => r.id === id ? { ...r, editing: false } : r));

    const handleChange = (id, value) =>
        setRates(rates.map(r => r.id === id ? { ...r, price: value } : r));

    const handleSave = (id) =>
        setRates(rates.map(r => r.id === id ? { ...r, editing: false } : r));

    return (
        <div className="charging-rates-container">
            <h2>Cài đặt hệ thống</h2>
            <p className="text-gray-600 mb-4">
                Điều chỉnh giá sạc theo từng loại cổng sạc và công suất. Giá tính theo VND/phút.
            </p>

            {rates.map(rate => (
                <div className="rate-card" key={rate.id}>
                    <div className="rate-info">
                        <FaBolt className="rate-icon" />
                        <div className="rate-text">
                            <div className="rate-header">
                                <span>{rate.power}</span>
                                <span className="rate-type">{rate.type}</span>
                            </div>

                            {rate.editing ? (
                                <div className="rate-edit">
                                    <label>Giá (VND/phút): </label>
                                    <input
                                        type="number"
                                        value={rate.price}
                                        onChange={(e) => handleChange(rate.id, e.target.value)}
                                    />
                                </div>
                            ) : (
                                <p className="rate-price">{rate.price} VND/phút</p>
                            )}
                        </div>
                    </div>

                    <div className="rate-actions">
                        {rate.editing ? (
                            <>
                                <button className="btn-save" onClick={() => handleSave(rate.id)}>
                                    <FaSave /> Lưu
                                </button>
                                <button className="btn-cancel" onClick={() => handleCancel(rate.id)}>
                                    <FaTimes /> Hủy
                                </button>
                            </>
                        ) : (
                            <button className="btn-edit" onClick={() => handleEdit(rate.id)}>
                                <FaEdit /> Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChargingRates;
