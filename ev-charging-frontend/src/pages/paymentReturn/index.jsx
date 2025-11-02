import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const responseCode = query.get("vnp_ResponseCode");
    const amount = query.get("vnp_Amount");

    if (responseCode === "00") {
      // ✅ Hiển thị toast nạp tiền thành công
      toast.success(
        `Nạp ${Number(amount).toLocaleString("vi-VN")} VND thành công!`
      );

      // Chờ 1 chút rồi chuyển về trang transaction
      setTimeout(() => {
        navigate("/driver/transaction");
      });
    } else {
      // ❌ Hiển thị toast thất bại
      toast.error("Thanh toán thất bại hoặc bị hủy!");
      setTimeout(() => {
        navigate("/driver/transaction");
      });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center mt-20">
      <h2>Đang xử lý thanh toán...</h2>
      <p>Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default PaymentReturn;
