import React, { useEffect, useState } from "react";
import { FaBolt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import api from "../../config/axios";
import "../admin/ChargingRates.css";

const ChargingRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ server
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await api.get("admin/get");
        console.log("Dữ liệu từ server:", res.data);

        // map dữ liệu từ API về state
        const ratesData = res.data.map((item, index) => ({
          id: index + 1,
          power:
            item.portType === "AC"
              ? "22kW"
              : item.portType === "CHAdeMO"
              ? "75kW"
              : item.portType === "CCS"
              ? "120kW"
              : "N/A",
          type: item.portType,
          price: item.cost,
          editing: false,
        }));

        setRates(ratesData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu giá sạc!");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleEdit = (id) =>
    setRates(rates.map((r) => (r.id === id ? { ...r, editing: true } : r)));

  const handleCancel = (id) =>
    setRates(rates.map((r) => (r.id === id ? { ...r, editing: false } : r)));

  const handleChange = (id, value) =>
    setRates(rates.map((r) => (r.id === id ? { ...r, price: value } : r)));

  const handleSave = async (id) => {
    const rate = rates.find((r) => r.id === id);
    if (!rate) return;

    try {
      const res = await api.put(
        `admin/edit-cost/${rate.type}?newCost=${rate.price}`
      );

      alert(`✅ Cập nhật giá ${rate.type} thành công!`);
      console.log("Server response:", res.data);

      setRates(rates.map((r) => (r.id === id ? { ...r, editing: false } : r)));
    } catch (error) {
      console.error("Lỗi khi cập nhật giá:", error);
      const msg = error.response?.data || error.message;
      alert(`❌ Cập nhật thất bại: ${msg}`);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="charging-rates-container">
      <h2>Cài đặt hệ thống</h2>
      <p className="text-gray-600 mb-4">
        Điều chỉnh giá sạc theo từng loại cổng sạc và công suất. Giá tính theo
        VND/phút.
      </p>

      {rates.map((rate) => (
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
                <button
                  className="btn-save"
                  onClick={() => handleSave(rate.id)}
                >
                  <FaSave /> Lưu
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => handleCancel(rate.id)}
                >
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
