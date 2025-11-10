import { useState } from "react";
import { resetPasswordApi } from "../services/authService";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async ({ email, newPassword, otp }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await resetPasswordApi({ email, newPassword, otp });
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || "Lỗi không xác định khi đặt lại mật khẩu");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
};
