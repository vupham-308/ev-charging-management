import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "../../config/axios";

const ManagePaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const url = new URL(window.location.href);
        const id = url.pathname.split("/").pop();

        // 🔑 Lấy token từ localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          message.error("Bạn chưa đăng nhập!");
          navigate("/login");
          return;
        }

        // 🔥 Gọi API với Authorization header
        const res = await api.get(`/payment/success/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        message.success(
          `Nạp ${res.data.totalAmount.toLocaleString("vi-VN")} VND thành công!`
        );

        navigate("/transaction");
      } catch (err) {
        console.error("Error verifying payment:", err);
        message.error("Xác nhận giao dịch thất bại!");
        navigate("/transaction");
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center mt-20">
      <h2>Đang xác nhận thanh toán...</h2>
      <p>Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default ManagePaymentSuccess;
