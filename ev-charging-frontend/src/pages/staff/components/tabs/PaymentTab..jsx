import { Card, Tag, Button } from "antd"
import { formatDateTime } from "../../utils/dateHelpers"
import { useChargingSessions } from "../../hooks/useChargingSessions"

export const PaymentTab = () => {
  const { sessions, isLoading } = useChargingSessions()

  return (
    <div className="w-full bg-gray-50 min-h-screen flex justify-center py-5">
      {/* Container chính */}
      <div className="w-[80%] max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800">Tất cả phiên sạc</h2>
        <p className="text-gray-500 mt-1 mb-6">Xem tất cả phiên sạc và xử lý thanh toán tiền mặt</p>

        {isLoading ? (
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all"
                styles={{ body: { padding: "16px 20px" } }} //
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-base">
                        {session.car?.user?.fullName || "Người dùng ẩn danh"}
                      </span>
                      <Tag color="default">{session?.point?.id|| "N/A"}</Tag>
                      <Tag color="default" className="text-gray-600 bg-gray-100">
                        {session.paymentMethod || "Không xác định"}
                      </Tag>
                    </div>

                    <p className="text-gray-500 text-sm mt-1">
                      {formatDateTime(session.date)} • {session?.point?.capacity} kWh
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900 min-w-[120px] text-right">
                      {session.fee.toLocaleString("vi-VN")} VND
                    </span>

                    {session.paymentMethod === "Cash" && (
                      <Button
                        type="primary"
                        className="bg-black hover:bg-gray-800 text-white rounded-lg px-4"
                      >
                        Xử lý thanh toán
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
  )
}
