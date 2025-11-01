import { useEffect, useState } from "react";
import { Card, Button, Spin, message, Tag, Select } from "antd";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

const ManageStartChargingBooking = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [cars, setCars] = useState([]);
  const [chargerInfo, setChargerInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedCar, setSelectedCar] = useState(null);
  const [targetBattery, setTargetBattery] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myRes = await api.get("/reservations/my");
        const myActiveBooking = myRes.data.find(
          (r) => r.stationId === Number(stationId) && r.status !== "CANCELLED"
        );

        if (!myActiveBooking) {
          message.warning("⚠️ Bạn chưa có đặt chỗ nào cho trạm này!");
          setLoading(false);
          return;
        }

        const pointID = myActiveBooking.chargerpointId;

        const [stationRes, carRes, chargerRes, reviewRes] = await Promise.all([
          api.get(`/station/get/${stationId}`),
          api.get(`/cars`),
          api.get(`/chargerPoint/get/${pointID}`),
          api.get(`/review/station/${stationId}`),
        ]);

        setStation(stationRes.data);
        setCars(carRes.data);
        setChargerInfo(chargerRes.data);
        setReviews(reviewRes.data);

        if (reviewRes.data.length > 0) {
          const avg =
            reviewRes.data.reduce((sum, r) => sum + r.rating, 0) /
            reviewRes.data.length;
          setAverageRating(avg.toFixed(1));
        }
      } catch (error) {
        console.error(error);
        message.error("❌ Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  useEffect(() => {
    setCanContinue(
      selectedCar && chargerInfo && targetBattery && paymentMethod
    );
  }, [selectedCar, chargerInfo, targetBattery, paymentMethod]);

  const getBatteryOptions = () => {
    if (!selectedCar) return [];
    const current = selectedCar.initBattery;
    const options = [];
    for (let i = Math.ceil((current + 10) / 10) * 10; i <= 100; i += 10) {
      options.push(i);
    }
    return options;
  };

  const handleContinue = async () => {
    if (!canContinue) {
      message.warning("⚠️ Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        carId: selectedCar.id,
        pointId: chargerInfo.id,
        goalBattery: targetBattery,
        paymentMethod,
      };

      const res = await api.post("/charge", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/driver/confirmBill", {
        state: {
          chargeData: res.data,
          station,
          selectedCar,
          selectedCharger: chargerInfo,
          targetBattery,
          paymentMethod,
        },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Không thể tạo phiên sạc!";
      message.error(errorMsg);
      toast.warning(errorMsg);
    }
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

  return (
    <div style={{ padding: "30px 60px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Bắt đầu sạc
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Trụ sạc đã được bạn đặt trước đó
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
        }}
      >
        {/* --- Cột 1: Trạm --- */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 8, fontWeight: 600 }}>Trạm đã chọn</h3>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{station.name}</p>
          <p style={{ color: "#777", marginBottom: 8 }}>{station.address}</p>
          <Tag color="green" style={{ borderRadius: 12 }}>
            Sạc nhanh
          </Tag>
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

          {/* Xe */}
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

          {/* Trụ sạc đã đặt */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                color: "#28a745",
                fontWeight: 600,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#28a745",
                }}
              ></span>
              Trụ sạc đã đặt
            </p>

            <Card
              style={{
                width: "100%", // ✅ bằng với Select box
                border: "1px solid #28a745",
                borderRadius: 10,
                backgroundColor: "#f6fff8",
                color: "#155724",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                padding: "10px 16px",
                fontWeight: 500,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap", // ✅ tự xuống dòng nếu nhỏ
                }}
              >
                <strong>{chargerInfo?.name}</strong>
                <span>• {chargerInfo?.capacity}kW</span>
                <span>• {chargerInfo?.chargerCost?.portType}</span>
                <span>
                  • {chargerInfo?.chargerCost?.cost?.toLocaleString("vi-VN")}{" "}
                  đ/kWh
                </span>
              </p>
            </Card>
          </div>

          {/* Mức pin */}
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

          {/* Thanh toán */}
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

        {/* --- Cột 3: Đánh giá --- */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 8, fontWeight: 600 }}>Đánh giá trạm</h3>
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
      <Outlet />
    </div>
  );
};

export default ManageStartChargingBooking;
