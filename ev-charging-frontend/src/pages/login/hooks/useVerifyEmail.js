import { useState } from "react";
import { verifyEmailApi } from "../services/authService";

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

  const verifyEmail = async ({ email, otp }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyEmailApi({ email, otp });
      setVerified(true);
      return res;
    } catch (err) {
      console.error("❌ Xác thực thất bại:", err);
      setError(err.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyEmail, loading, verified, error };
};
