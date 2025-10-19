import { CreditCardOutlined } from "@ant-design/icons"

export const PaymentTab = () => {
  return (
    <div className="text-center py-12">
      <CreditCardOutlined className="text-6xl text-green-400 mb-4" />
      <p className="text-gray-600 text-lg">
        Quản lý việc khởi động/dừng phiên sạc, ghi nhận thanh toán tại chỗ phí sạc xe.
      </p>
    </div>
  )
}
