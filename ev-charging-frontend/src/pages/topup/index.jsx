import { useState } from "react";
import { Card, InputNumber, Select, Button, Typography, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const ManageTopup = () => {
  const [amount, setAmount] = useState(0.1);
  const [method, setMethod] = useState("VNPAY");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTopup = async () => {
    if (!amount || amount <= 0) {
      message.warning("Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/topup", {
        totalAmount: amount,
        paymentMethod: method,
      });

      const data = res.data;
      console.log("Topup Response:", data);

      // ✅ Kiểm tra nếu là link thanh toán (VNPay chưa redirect)
      if (typeof data === "string" && data.startsWith("http")) {
        message.success("Đang chuyển đến trang thanh toán...");
        window.location.href = data;
        return;
      }

      // ✅ Nếu backend trả về object giao dịch
      if (data && data.status === "COMPLETED") {
        message.success(
          `Nạp ${data.totalAmount.toLocaleString()} VND thành công!`
        );
        // (tuỳ chọn) điều hướng lại trang quản lý giao dịch
        navigate("/transaction");
      } else {
        message.warning("Giao dịch chưa hoàn tất hoặc không hợp lệ!");
      }
    } catch (error) {
      console.error("Topup error:", error);
      message.error("Nạp tiền thất bại!");
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

          <div>
            <Text strong>Số tiền nạp</Text>
            <InputNumber
              min={0.1}
              step={0.1}
              value={amount}
              onChange={setAmount}
              className="w-full mt-2"
              addonAfter="VND"
            />
          </div>

          <div>
            <Text strong>Phương thức thanh toán</Text>
            <Select
              value={method}
              onChange={setMethod}
              className="w-full mt-2"
              options={[
                { label: "VNPAY", value: "VNPAY" },
                { label: "Momo", value: "Momo" },
                { label: "ZaloPay", value: "ZaloPay" },
              ]}
            />
          </div>

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
