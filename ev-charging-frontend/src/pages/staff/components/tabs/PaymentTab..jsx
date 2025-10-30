import { Card, Tag, Button, message } from "antd";
import { formatDateTime } from "../../utils/dateHelpers";
import { useChargingSessions } from "../../hooks/useChargingSessions";
import { useCashChargingSession } from "../../hooks/useCashChargingSession";
import { useState } from "react";

export const PaymentTab = () => {
  const { sessions, isLoading, updateSessionStatus } = useChargingSessions();
  const { handleCashChargingSession } = useCashChargingSession();
  const [processingId, setProcessingId] = useState(null); // id đang xử lý

  const handlePayment = async (sessionId) => {
    setProcessingId(sessionId);
    try {
      await handleCashChargingSession(sessionId);
      message.success("✅ Thanh toán tiền mặt thành công!");
      // ✅ Cập nhật trực tiếp UI thay vì reload
      updateSessionStatus(sessionId, "PAID");
    } catch (error) {
      message.error("❌ Không thể xử lý thanh toán, vui lòng thử lại!");
      console.log(error)
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen flex justify-center py-5">
      {/* Container chính */}
      <div className="w-[80%] max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800">Tất cả phiên sạc</h2>
        <p className="text-gray-500 mt-1 mb-6">
          Xem tất cả phiên sạc và xử lý thanh toán tiền mặt
        </p>

        {isLoading ? (
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all"
                styles={{ body: { padding: "16px 20px" } }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-base">
                        {session.car?.user?.fullName || "Người dùng ẩn danh"}
                      </span>
                      <Tag color="default">{session?.point?.id || "N/A"}</Tag>
                      <Tag
                        color="default"
                        className="text-gray-600 bg-gray-100"
                      >
                        {session.paymentMethod || "Không xác định"}
                      </Tag>
                    </div>

                    <p className="text-gray-500 text-sm mt-1">
                      {formatDateTime(session.date)} •{" "}
                      {session?.point?.capacity} kWh
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 min-w-[120px] text-right">
                      {session.fee.toLocaleString("vi-VN")} VND
                    </span>

                    {session.status === "PAID" ? (
                      <Tag
                        color="green"
                        className="!rounded-full !px-4 !py-1 text-sm font-medium animate-fade-in"
                      >
                        ✅ Đã thanh toán
                      </Tag>
                    ) : (
                      session.paymentMethod === "CASH" &&
                      session.status === "WAITING_TO_PAY" && (
                        <Button
                          loading={processingId === session.id}
                          onClick={() => handlePayment(session.id)}
                          type="default"
                          className="!bg-black hover:!bg-gray-900 !text-white !font-medium !rounded-full !px-5 !py-1.5 !h-auto !text-[13px] !shadow-sm transition-all duration-200"
                        >
                          {processingId === session.id
                            ? "Đang xử lý..."
                            : "Xử lý thanh toán"}
                        </Button>
                      )
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
