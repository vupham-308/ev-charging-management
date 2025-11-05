import { useEffect, useState } from "react";
import { Card, Button, Spin, message, Select, Tag } from "antd";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import {
  FaChargingStation,
  FaCarSide,
  FaBatteryHalf,
  FaMoneyBillWave,
  FaStar,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";

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

  // --- Lấy dữ liệu cơ bản ---
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

  // --- 🔁 Tự động bật nút "Tiếp tục" khi đủ thông tin ---
  useEffect(() => {
    setCanContinue(
      selectedCar && chargerInfo && targetBattery && paymentMethod
    );
  }, [selectedCar, chargerInfo, targetBattery, paymentMethod]);

  // --- ⚡️ Gọi API /get-draft để khôi phục dữ liệu ---
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await api.get("/get-draft");
        const draft = res.data;

        if (draft && draft.status === "WAITING_TO_PAY") {
          console.log("📄 Khôi phục draft:", draft);

          // Điền lại thông tin từ draft
          setPaymentMethod(draft.paymentMethod);
          setTargetBattery(draft.goalBattery);

          // Tìm xe tương ứng trong danh sách xe
          const car = cars.find((c) => c.id === draft.car.id);
          if (car) setSelectedCar(car);

          // Cập nhật thông tin trụ sạc
          if (draft.chargerPoint) {
            setChargerInfo(draft.chargerPoint);
          }
        }
      } catch (err) {
        console.log(
          "ℹ️ Không có draft để khôi phục hoặc lỗi khi tải draft",
          err
        );
      }
    };

    if (cars.length > 0) {
      fetchDraft();
    }
  }, [cars]);

  // --- Tạo danh sách mức pin khả dụng ---
  const getBatteryOptions = () => {
    if (!selectedCar) return [];
    const current = selectedCar.initBattery || 0;
    const options = [];
    for (let i = Math.ceil((current + 10) / 10) * 10; i <= 100; i += 10) {
      options.push(i);
    }
    return options;
  };

  // --- Tạo phiên sạc ---
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
          from: "startBooking",
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

  // --- UI ---
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );

  if (!station)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Không có dữ liệu trạm sạc
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <FaChargingStation className="text-blue-700" />
          Bắt đầu sạc
        </h1>
        <p className="text-gray-500 mb-8">
          Bạn đã đặt trụ sạc trước, vui lòng xác nhận để bắt đầu
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trạm sạc */}
          <Card
            bordered={false}
            className="shadow-md rounded-2xl hover:shadow-lg transition-all duration-300"
            title={
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <FaChargingStation />
                Trạm sạc
              </div>
            }
          >
            <p className="text-lg font-medium">{station.name}</p>
            <p className="text-gray-500 mb-3">{station.address}</p>
            <Tag color="green" style={{ borderRadius: 12 }}>
              Sạc nhanh
            </Tag>

            <Button
              danger
              icon={<FaExclamationTriangle />}
              className="w-full mt-5 font-medium rounded-lg"
              onClick={() =>
                navigate(
                  `/driver/startChargingBooking/${stationId}/stationReport`
                )
              }
            >
              Báo cáo sự cố
            </Button>
          </Card>

          {/* Cài đặt */}
          <Card
            bordered={false}
            className="shadow-md rounded-2xl hover:shadow-lg transition-all duration-300"
            title={
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <FaBatteryHalf />
                Cài đặt sạc
              </div>
            }
          >
            <div className="mb-4">
              <p className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCarSide className="text-blue-500" /> Xe của bạn
              </p>
              <Select
                placeholder="Chọn xe"
                style={{ width: "100%" }}
                value={selectedCar?.id}
                onChange={(id) =>
                  setSelectedCar(cars.find((car) => car.id === id))
                }
              >
                {cars.map((car) => (
                  <Select.Option key={car.id} value={car.id}>
                    {car.brand} ({car.initBattery}%)
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="mt-4">
              <p className="font-medium text-gray-700 mb-2">Trụ đã đặt:</p>
              <div className="p-3 bg-green-50 border border-green-400 rounded-lg text-green-700">
                {chargerInfo?.name} • {chargerInfo?.capacity}kW •{" "}
                {chargerInfo?.chargerCost?.portType} •{" "}
                {chargerInfo?.chargerCost?.cost?.toLocaleString("vi-VN")}đ/kWh
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-700 mb-2">Mục tiêu pin</p>
              <Select
                placeholder="Chọn mức pin"
                style={{ width: "100%" }}
                disabled={!selectedCar}
                value={targetBattery}
                onChange={setTargetBattery}
              >
                {getBatteryOptions().map((val) => (
                  <Select.Option key={val} value={val}>
                    {val}%
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="mb-6">
              <p className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-600" /> Phương thức thanh
                toán
              </p>
              <Select
                placeholder="Chọn phương thức"
                style={{ width: "100%" }}
                value={paymentMethod}
                onChange={setPaymentMethod}
              >
                <Select.Option value="BALANCE">Số dư tài khoản</Select.Option>
                <Select.Option value="CASH">Tiền mặt</Select.Option>
              </Select>
            </div>

            <Button
              type="primary"
              icon={<FaArrowRight />}
              size="large"
              disabled={!canContinue}
              onClick={handleContinue}
              className={`w-full font-semibold rounded-lg ${
                canContinue
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Tiếp tục
            </Button>
          </Card>

          {/* Đánh giá */}
          <Card
            bordered={false}
            className="shadow-md rounded-2xl hover:shadow-lg transition-all duration-300"
            title={
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <FaStar className="text-yellow-500" />
                Đánh giá trạm
              </div>
            }
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl font-bold text-yellow-500">
                {averageRating}
              </span>
              <span className="text-yellow-500">⭐</span>
              <span className="text-gray-500">({reviews.length} đánh giá)</span>
            </div>

            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="mb-3 border-b border-gray-100 pb-2">
                <p className="font-medium text-gray-800">{r.userName}</p>
                <p className="text-gray-600 text-sm">{r.description}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(r.reviewDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default ManageStartChargingBooking;
