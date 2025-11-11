import { useEffect, useState } from "react";
import { Card, Button, Spin, message, Select, Tag, Modal, Divider } from "antd";
import {
  FaChargingStation,
  FaCarSide,
  FaBatteryHalf,
  FaMoneyBillWave,
  FaStar,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";
import {
  CheckCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

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

  // Modal confirm bill
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ⬇️ Thêm state mới ở đầu component
  const [showAllReviews, setShowAllReviews] = useState(false);

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

  // --- 🔁 Kích hoạt nút “Tiếp tục” khi đủ dữ liệu ---
  useEffect(() => {
    setCanContinue(
      selectedCar && chargerInfo && targetBattery && paymentMethod
    );
  }, [selectedCar, chargerInfo, targetBattery, paymentMethod]);

  // --- ⚡️ Tạo phiên sạc ---
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

      // Mở modal confirm bill
      setConfirmData({
        chargeData: res.data,
        station,
        selectedCar,
        selectedCharger: chargerInfo,
      });
      setShowConfirm(true);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Không thể tạo phiên sạc!";
      message.error(errorMsg);
      toast.warning(errorMsg);
    }
  };

  // --- ✅ Xác nhận và bắt đầu sạc ---
  const handleConfirm = async () => {
    if (!confirmData?.chargeData?.id) return;
    try {
      setConfirmLoading(true);
      await api.post(`/charging/${confirmData.chargeData.id}`);
      toast.success(" Phiên sạc đã bắt đầu!");
      setShowConfirm(false);
      navigate("/driver/chargingSession");
    } catch (err) {
      console.error("❌ Lỗi khi bắt đầu sạc:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "❌ Không thể bắt đầu sạc! Vui lòng thử lại.";

      // Hiển thị lỗi trả về từ backend
      message.error(errorMsg);
      toast.warning(errorMsg);
    } finally {
      setConfirmLoading(false);
    }
  };

  // State cho popup đánh giá
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    description: "",
    rating: null,
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  // Hàm gửi đánh giá
  const handleSubmitReview = async () => {
    if (!reviewForm.description || !reviewForm.rating) {
      message.warning("Vui lòng nhập đủ nội dung và chọn số sao!");
      return;
    }

    try {
      setReviewLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        stationId: Number(stationId),
        description: reviewForm.description,
        rating: reviewForm.rating,
        reviewDate: new Date().toISOString(),
      };

      await api.post("/review/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Gửi đánh giá thành công!");
      setShowReviewModal(false);
      setReviewForm({ description: "", rating: null });

      // Gọi lại API review để cập nhật danh sách
      const reviewRes = await api.get(`/review/station/${stationId}`);
      setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
    } catch (err) {
      console.error("❌ Lỗi khi gửi đánh giá:", err);
      message.error("Không thể gửi đánh giá!");
    } finally {
      setReviewLoading(false);
    }
  };

  // --- UI chính ---
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
          Bắt đầu sạc (Đặt trước)
        </h1>
        <p className="text-gray-500 mb-8">
          Bạn đã đặt trụ sạc trước, vui lòng xác nhận để bắt đầu
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Cột Trạm --- */}
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

          {/* --- Cột Cài đặt --- */}
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
            {/* Xe */}
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

            {/* Trụ sạc */}
            <div className="mt-4 mb-4">
              <p className="font-medium text-gray-700 mb-2">Trụ đã đặt:</p>
              <div className="p-3 bg-green-50 border border-green-400 rounded-lg text-green-700">
                {chargerInfo?.name} • {chargerInfo?.capacity}kW •{" "}
                {chargerInfo?.chargerCost?.portType} •{" "}
                {chargerInfo?.chargerCost?.cost?.toLocaleString("vi-VN")}đ/kWh
              </div>
            </div>

            {/* Mục tiêu pin */}
            <div className="mb-4">
              <p className="font-medium text-gray-700 mb-2">Mục tiêu pin</p>
              <Select
                placeholder="Chọn mức pin"
                style={{ width: "100%" }}
                disabled={!selectedCar}
                value={targetBattery}
                onChange={setTargetBattery}
              >
                {(() => {
                  if (!selectedCar) return [];
                  const current = selectedCar.initBattery || 0;
                  const arr = [];
                  for (
                    let i = Math.ceil((current + 10) / 10) * 10;
                    i <= 100;
                    i += 10
                  )
                    arr.push(i);
                  return arr.map((val) => (
                    <Select.Option key={val} value={val}>
                      {val}%
                    </Select.Option>
                  ));
                })()}
              </Select>
            </div>

            {/* Thanh toán */}
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

          {/* Cột 3: Đánh giá */}
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

            {reviews.length > 3 && (
              <Button
                type="link"
                onClick={() => setShowAllReviews(true)}
                className="p-0 text-blue-600"
              >
                Xem thêm đánh giá...
              </Button>
            )}
            <Button
              type="primary"
              className="w-full mt-3 font-semibold rounded-lg bg-black hover:bg-gray-800"
              onClick={() => setShowReviewModal(true)}
            >
              Viết đánh giá
            </Button>
          </Card>
        </div>
      </div>

      {/* --- 🧾 POPUP CONFIRM BILL --- */}
      <Modal
        title="Xác nhận thông tin sạc"
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        footer={null}
        centered
        width={600}
      >
        {confirmData ? (
          <div className="space-y-2">
            <Divider />
            <p>
              <strong>Xe:</strong> {confirmData.selectedCar.brand}
            </p>
            <p>
              <strong>Trụ sạc:</strong> {confirmData.selectedCharger.name} •{" "}
              {confirmData.selectedCharger.capacity}kW
            </p>
            <p>
              <strong>Trạm:</strong> {confirmData.station.name}
            </p>
            <p>
              <strong>Pin:</strong> {confirmData.chargeData.initBattery}% →{" "}
              {confirmData.chargeData.goalBattery}%
            </p>
            <p>
              <strong>Thanh toán:</strong>{" "}
              {confirmData.chargeData.paymentMethod === "BALANCE"
                ? "Số dư tài khoản"
                : "Tiền mặt"}
            </p>
            <p>
              <ClockCircleOutlined className="text-blue-500 mr-1" />
              <strong>Thời gian ước tính:</strong>{" "}
              {confirmData.chargeData.minute} phút
            </p>
            <p>
              <DollarOutlined className="text-green-600 mr-1" />
              <strong>Chi phí ước tính:</strong>{" "}
              {confirmData.chargeData.fee.toLocaleString("vi-VN")}đ
            </p>

            <Divider />

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setShowConfirm(false)}>Hủy</Button>
              <Button
                type="primary"
                loading={confirmLoading}
                onClick={handleConfirm}
                icon={<CheckCircleOutlined />}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        )}
      </Modal>

      {/* Popup hiển thị tất cả đánh giá */}
      <Modal
        title={`Tất cả đánh giá của trạm ${station.name}`}
        open={showAllReviews}
        onCancel={() => setShowAllReviews(false)}
        footer={null}
        centered
        width={700}
      >
        {reviews.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="mb-4 border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{r.userName}</p>
                  <span className="text-yellow-500 text-sm">⭐ {r.rating}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{r.description}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(r.reviewDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            Chưa có đánh giá nào cho trạm này.
          </p>
        )}
      </Modal>

      {/* Popup tạo đánh giá */}
      <Modal
        title="Đánh giá trạm sạc"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        footer={null}
        centered
        width={500}
      >
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2 text-gray-700">Số sao</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={28}
                  className={`cursor-pointer transition-all ${
                    star <= reviewForm.rating
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mb-2 text-gray-700">Nội dung đánh giá</p>
            <textarea
              rows={4}
              value={reviewForm.description}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, description: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hãy chia sẻ trải nghiệm của bạn..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button onClick={() => setShowReviewModal(false)}>Hủy</Button>
            <Button
              type="primary"
              loading={reviewLoading}
              onClick={handleSubmitReview}
              className="bg-black text-white hover:bg-gray-800 rounded-lg"
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </Modal>

      <Outlet />
    </div>
  );
};

export default ManageStartChargingBooking;
