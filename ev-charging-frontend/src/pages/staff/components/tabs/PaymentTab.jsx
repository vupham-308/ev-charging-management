// Updated PaymentTab with user.phone under Người dùng
import { Card, Tag, Button, message } from "antd";
import { formatDateTime } from "../../utils/dateHelpers";
import { useChargingSessions } from "../../hooks/useChargingSessions";
import { useCashChargingSession } from "../../hooks/useCashChargingSession";
import { useState } from "react";

export const PaymentTab = () => {
  const { sessions, isLoading, updateSessionStatus } = useChargingSessions();
  const { handleCashChargingSession } = useCashChargingSession();
  const [processingId, setProcessingId] = useState(null);

  const handlePayment = async (sessionId) => {
    setProcessingId(sessionId);
    try {
      await handleCashChargingSession(sessionId);
      message.success("✅ Thanh toán tiền mặt thành công!");
      updateSessionStatus(sessionId, "COMPLETED");
    } catch (error) {
      message.error("❌ Không thể xử lý thanh toán, vui lòng thử lại!");
      console.log(error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "ONGOING":
        return "blue";
      case "WAITING_TO_PAY":
      case "PENDING_PAYMENT":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ONGOING":
        return "ĐANG SẠC";
      case "WAITING_TO_PAY":
      case "PENDING_PAYMENT":
        return "CHỜ THANH TOÁN";
      case "COMPLETED":
        return "HOÀN THÀNH";
      default:
        return status;
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "ONGOING":
        return "text-blue-600";
      case "WAITING_TO_PAY":
      case "PENDING_PAYMENT":
        return "text-orange-600";
      default:
        return "text-gray-900";
    }
  };

  const isPendingPayment = (status) =>
    status === "WAITING_TO_PAY" || status === "PENDING_PAYMENT";

  return (
    <div className="w-full bg-gray-50 min-h-screen flex justify-center py-5">
      <div className="w-[80%] max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Tất cả phiên sạc
        </h2>
        <p className="text-gray-500 mt-1 mb-6">
          Xem tất cả phiên sạc và xử lý thanh toán tiền mặt
        </p>

        {isLoading ? (
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {[...sessions]
              .sort((a, b) => {
                const getTime = (s) =>
                  new Date(
                    s.endDate || s.startDate || s.date || s.createdAt || 0
                  ).getTime();

                return getTime(b) - getTime(a);
              })
              .map((session, idx) => (
                <Card
                  key={session.id || idx}
                  className={`rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all ${
                    session.status === "ONGOING"
                      ? "bg-blue-50 border-blue-200"
                      : isPendingPayment(session.status)
                      ? "bg-orange-50 border-orange-200"
                      : ""
                  }`}
                  styles={{ body: { padding: "0" } }}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      {/* LEFT SIDE */}
                      <div className="space-y-4">
                        {/* USER */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="text-gray-700 font-medium">
                            Người dùng:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {session.car?.user?.fullName ||
                              session.user?.fullName ||
                              "Nguyễn Văn Nam"}
                          </span>
                        </div>

                        {/* PHONE */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="text-gray-600 text-sm">
                            Số điện thoại:
                          </span>
                          <span className="text-gray-800 text-sm">
                            {session.car?.user?.phone ||
                              session.user?.phone ||
                              "0123 456 789"}
                          </span>
                        </div>

                        {/* SESSION ID */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="text-gray-700 font-medium">
                            Phiên sạc:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            #{session.id || session.sessionId || idx + 1}
                          </span>
                        </div>

                        {/* CHARGER */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="text-gray-700 font-medium">
                            Trụ sạc:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {session.charger?.id ||
                              session?.point?.name ||
                              "CH001"}
                            {session.point?.chargerCost?.portType &&
                              ` (${session.point.chargerCost.portType} ${session.point.chargerCost.power} kW)`}
                          </span>
                        </div>

                        {/* START TIME */}
                        {!isPendingPayment(session.status) && (
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-gray-700 font-medium">
                              Bắt đầu:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {formatDateTime(
                                session.startDate || session.date
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="space-y-4">
                        {/* END OR REMAINING TIME */}
                        {!isPendingPayment(session.status) && (
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-gray-700 font-medium">
                              {session.status === "ONGOING"
                                ? "Thời gian còn lại:"
                                : "Kết thúc:"}
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {session.status === "ONGOING"
                                ? `Khoảng ~ ${session?.minute || 0} phút`
                                : session.endDate
                                ? formatDateTime(session.endDate)
                                : "—"}
                            </span>
                          </div>
                        )}

                        {/* ENERGY DELIVERED */}
                        {!isPendingPayment(session.status) && (
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-gray-700 font-medium">
                              Năng lượng đã nạp:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {session.energyDelivered ||
                              session.consumedEnergy ||
                              session.energyConsumed
                                ? (
                                    parseFloat(
                                      session.energyDelivered ??
                                        session.consumedEnergy ??
                                        session.energyConsumed
                                    ) || 0
                                  ).toFixed(2) + " kWh"
                                : "—"}
                            </span>
                          </div>
                        )}

                        {/* PAYMENT METHOD */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="text-gray-700 font-medium">
                            Payment Method:
                          </span>
                          <Tag
                            color={
                              session.paymentMethod === "CASH"
                                ? "orange"
                                : "default"
                            }
                            className={`text-gray-600 border-0 font-medium ${
                              session.paymentMethod === "CASH"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {session.paymentMethod ||
                              session.paymentType ||
                              "BALANCE"}
                          </Tag>
                        </div>

                        {/* TOTAL PRICE */}
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <span className="text-gray-700 font-medium">
                            {session.status === "ONGOING" ||
                            isPendingPayment(session.status)
                              ? "Tổng tiền (ước tính):"
                              : "Tổng tiền:"}
                          </span>

                          <span
                            className={`font-bold text-lg ${getStatusTextColor(
                              session.status
                            )}`}
                          >
                            {session.status === "ONGOING" ||
                            isPendingPayment(session.status)
                              ? (session.estimatedFee ?? 0).toLocaleString(
                                  "vi-VN"
                                )
                              : session.fee
                              ? session.fee.toLocaleString("vi-VN")
                              : "0"}{" "}
                            VND
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Trạng thái:
                        </span>
                        <strong>
                          <Tag
                            color={getStatusColor(session.status)}
                            className="font-bold text-sm"
                          >
                            {getStatusText(session.status)}
                          </Tag>
                        </strong>
                      </div>

                      {session.paymentMethod === "CASH" &&
                        isPendingPayment(session.status) && (
                          <Button
                            loading={processingId === session.id}
                            onClick={() => handlePayment(session.id)}
                            type="default"
                            className="!bg-black hover:!bg-gray-900 !text-white !font-semibold !rounded-full !px-6 !py-2 !h-auto !text-[14px] !shadow-sm transition-all duration-200"
                          >
                            {processingId === session.id
                              ? "Đang xử lý..."
                              : "Xác nhận thanh toán"}
                          </Button>
                        )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
