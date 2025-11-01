"use client";
import { useState } from "react";
import { updatePassword } from "../services/updatePassService";

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]); // ✅ Mảng lỗi
  const [success, setSuccess] = useState(false);

  // ✅ Hàm kiểm tra độ mạnh mật khẩu
  const validatePasswordStrength = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return { hasUppercase, hasLowercase, hasNumber, hasMinLength };
  };

  const handleChangePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    setLoading(true);
    setErrors([]); // ✅ reset lỗi
    setSuccess(false);

    const newErrors = [];

    // ⚠️ Kiểm tra độ mạnh mật khẩu
    const { hasUppercase, hasLowercase, hasNumber, hasMinLength } =
      validatePasswordStrength(newPassword);

    if (!hasMinLength)
      newErrors.push("Mật khẩu phải có ít nhất 8 ký tự");
    if (!hasUppercase)
      newErrors.push("Mật khẩu phải có ít nhất 1 chữ cái viết hoa");
    if (!hasLowercase)
      newErrors.push("Mật khẩu phải có ít nhất 1 chữ cái viết thường");
    if (!hasNumber)
      newErrors.push("Mật khẩu phải có ít nhất 1 chữ số");

    // ⚠️ Xác nhận khớp
    if (newPassword !== confirmPassword)
      newErrors.push("Xác nhận mật khẩu không khớp");

    // ⚠️ Nếu có lỗi validation thì hiển thị luôn
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await updatePassword({
        currentPassword, 
        newPassword,
        confirmPassword,
      });

      console.log("🔍 API response:", response);

      if (typeof response === "string" && response.includes("thành công")) {
        setSuccess(true);
      } else {
        console.log("⚠️ Response không có success/status true, fallback error.");
        setErrors([response?.message || "Đổi mật khẩu thất bại."]);
      }
    } catch (err) {
      console.error("🔥 Caught error:", err);
      if (err?.message?.includes("hiện tại không đúng")) {
        setErrors(["Mật khẩu hiện tại không đúng."]);
      } else {
        setErrors([err?.message || "Đã xảy ra lỗi, vui lòng thử lại sau."]);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    handleChangePassword,
    loading,
    errors,
    success,
    validatePasswordStrength,
  };
};
