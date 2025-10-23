import { useEffect, useState } from "react";
import { Card, Button, Spin, message, Tag, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const ManageStartCharging = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [cars, setCars] = useState([]);
  const [chargers, setChargers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [targetBattery, setTargetBattery] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationRes, carRes, chargerRes, reviewRes] = await Promise.all([
          api.get(`/station/get/${stationId}`),
          api.get(`/cars`),
          api.get(`/chargerPoint/getAllAvailable/${stationId}`),
          api.get(`/review/station/${stationId}`),
        ]);

        setStation(stationRes.data);
        setCars(carRes.data);
        setChargers(chargerRes.data);
        setReviews(reviewRes.data);

        if (reviewRes.data.length > 0) {
          const avg =
            reviewRes.data.reduce((sum, r) => sum + r.rating, 0) /
            reviewRes.data.length;
          setAverageRating(avg.toFixed(1));
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        message.error("❌ Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stationId]);

  useEffect(() => {
    setCanContinue(
      selectedCar && selectedCharger && targetBattery && paymentMethod
    );
  }, [selectedCar, selectedCharger, targetBattery, paymentMethod]);

  const getBatteryOptions = () => {
    if (!selectedCar) return [];
    const current = selectedCar.initBattery;
    const options = [];
    for (let i = Math.ceil((current + 10) / 10) * 10; i <= 100; i += 10) {
      options.push(i);
    }
    return options;
  };

  const handleContinue = () => {
    if (!canContinue) {
      message.warning("⚠️ Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    navigate("/driver/confirmBill", {
      state: {
        station,
        selectedCar,
        selectedCharger,
        targetBattery,
        paymentMethod,
      },
    });
  };

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );

  if (!station)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        Không có dữ liệu trạm sạc
      </p>
    );

  const { name, address, pointChargerAvailable, pointChargerTotal } = station;

  return (
    <div style={{ padding: "30px 60px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Bắt đầu sạc
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Chọn trạm sạc và bắt đầu phiên sạc
      </p>

      {/* Layout 3 cột */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
        }}
      >
        {/* --- Cột 1: Thông tin trạm --- */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 8, fontWeight: 600 }}>Trạm đã chọn</h3>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{name}</p>
          <p style={{ color: "#777", marginBottom: 8 }}>{address}</p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <p style={{ color: "#1890ff" }}>
              {pointChargerAvailable}/{pointChargerTotal} trụ trống
            </p>
          </div>

          <Tag color="green" style={{ borderRadius: 12 }}>
            Sạc nhanh
          </Tag>

          <Button
            danger
            type="default"
            style={{
              width: "100%",
              marginTop: 16,
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            Báo cáo sự cố
          </Button>
        </Card>

        {/* --- Cột 2: Cài đặt sạc --- */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 8, fontWeight: 600 }}>Cài đặt sạc</h3>
          <p style={{ color: "#777", marginBottom: 16 }}>Chọn xe và trụ sạc</p>

          {/* Chọn xe */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 500, marginBottom: 6 }}>Xe của bạn</p>
            <Select
              placeholder="Chọn xe"
              style={{ width: "100%" }}
              onChange={(id) =>
                setSelectedCar(cars.find((car) => car.id === id))
              }
            >
              {cars.map((car) => (
                <Select.Option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.initBattery}%)
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Chọn trụ sạc */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 500, marginBottom: 6 }}>Trụ sạc</p>
            <Select
              placeholder="Chọn trụ sạc"
              style={{ width: "100%" }}
              onChange={(id) =>
                setSelectedCharger(chargers.find((c) => c.id === id))
              }
            >
              {chargers.map((ch) => (
                <Select.Option key={ch.id} value={ch.id}>
                  {ch.name} • {ch.capacity}kW • {ch.chargerCost?.portType} •{" "}
                  {ch.chargerCost?.cost?.toLocaleString("vi-VN")}đ/kWh
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Mục tiêu pin */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 500, marginBottom: 6 }}>Mục tiêu pin (%)</p>
            <Select
              placeholder="Chọn mức pin"
              style={{ width: "100%" }}
              disabled={!selectedCar}
              onChange={setTargetBattery}
            >
              {getBatteryOptions().map((val) => (
                <Select.Option key={val} value={val}>
                  {val}%
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Phương thức thanh toán */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontWeight: 500, marginBottom: 6 }}>
              Phương thức thanh toán
            </p>
            <Select
              placeholder="Chọn phương thức"
              style={{ width: "100%" }}
              onChange={setPaymentMethod}
            >
              <Select.Option value="BALANCE">Số dư tài khoản</Select.Option>
              <Select.Option value="CASH">Tiền mặt</Select.Option>
            </Select>
          </div>

          {/* Nút tiếp tục */}
          <Button
            type="primary"
            block
            size="large"
            disabled={!canContinue}
            onClick={handleContinue}
            style={{
              borderRadius: 8,
              backgroundColor: canContinue ? "#1677ff" : "#ccc",
              fontWeight: 600,
            }}
          >
            Tiếp tục
          </Button>
        </Card>

        {/* --- Cột 3: Đánh giá trạm --- */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 8, fontWeight: 600 }}>
            Đánh giá trạm sạc
          </h3>
          <p style={{ color: "#777", marginBottom: 12 }}>
            Chia sẻ từ các tài xế khác
          </p>

          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "#faad14",
                marginRight: 8,
              }}
            >
              {averageRating}
            </span>
            <span style={{ color: "#faad14" }}>⭐</span>
            <span style={{ color: "#777", marginLeft: 8 }}>
              {reviews.length} đánh giá
            </span>
          </div>

          {reviews.slice(0, 3).map((r) => (
            <div
              key={r.id}
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: 10,
                marginBottom: 10,
              }}
            >
              <p style={{ fontWeight: 500 }}>{r.userName}</p>
              <p style={{ color: "#555", fontSize: 14 }}>{r.description}</p>
              <p style={{ color: "#999", fontSize: 12 }}>
                {new Date(r.reviewDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ManageStartCharging;
