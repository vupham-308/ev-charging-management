// src/pages/login/hooks/useForgotPassword.js
import { useState } from "react";
import { message } from "antd";
import { forgotPasswordApi } from "../services/authService";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (email) => {
    if (!email) {
      message.warning("Vui lòng nhập địa chỉ email!");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      message.success(res?.message || "Đã gửi mã xác thực qua email!");
      return true;
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      message.error(
        err?.message || "Không thể gửi mã, vui lòng kiểm tra lại email!"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleForgotPassword };
};
