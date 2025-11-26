import { useState } from "react";
import { Card, InputNumber, Select, Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { Text } = Typography;

const ManageTopup = () => {
  const [amount, setAmount] = useState(20000);
  const [method, setMethod] = useState("VNPAY");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTopup = async () => {
    // ✅ Kiểm tra số tiền nạp tối thiểu
    if (!amount || amount < 20000) {
      toast.warning(" Số tiền nạp tối thiểu là 20.000 VND!");
      return; // ❌ Không gọi API, không chuyển trang
    }

    setLoading(true);
    try {
      const res = await api.post("/topup", {
        totalAmount: amount,
        paymentMethod: method,
      });

      const data = res.data;
      console.log("Topup Response:", data);

      // ✅ Nếu backend trả về link thanh toán VNPay
      if (typeof data === "string" && data.startsWith("http")) {
        toast.info("🔄 Đang chuyển đến trang thanh toán...");
        window.location.href = data;
        return;
      }

      // ✅ Nếu backend trả về object giao dịch hoàn tất
      if (data && data.status === "COMPLETED") {
        toast.success(
          `✅ Nạp ${data.totalAmount.toLocaleString("vi-VN")} VND thành công!`
        );
        navigate("/driver/transaction");
      } else {
        toast.warning("⚠️ Giao dịch chưa hoàn tất hoặc không hợp lệ!");
      }
    } catch (error) {
      console.error("Topup error:", error);
      toast.error("❌ Nạp tiền thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <Card
        title={
          <div className="flex items-center gap-2">
            <ArrowLeftOutlined
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <span>Nạp tiền vào ví</span>
          </div>
        }
        className="w-full max-w-md rounded-2xl shadow-lg"
      >
        <div className="space-y-4">
          <Text className="text-gray-600">
            Chọn số tiền và phương thức thanh toán
          </Text>

          {/* 💰 Nhập số tiền nạp */}
          <div>
            <Text strong>Số tiền nạp</Text>
            <InputNumber
              min={1000}
              step={1000}
              value={amount}
              onChange={(val) => setAmount(Math.floor(val || 0))}
              className="w-full mt-2"
              addonAfter="VND"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </div>

          {/* 💳 Phương thức thanh toán */}
          <div>
            <Text strong>Phương thức thanh toán</Text>
            <Select
              value={method}
              onChange={setMethod}
              className="w-full mt-2"
              options={[{ label: "VNPAY", value: "VNPAY" }]}
            />
          </div>

          {/* 🧭 Nút hành động */}
          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => navigate(-1)}>Hủy</Button>
            <Button type="primary" loading={loading} onClick={handleTopup}>
              Nạp tiền
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManageTopup;
