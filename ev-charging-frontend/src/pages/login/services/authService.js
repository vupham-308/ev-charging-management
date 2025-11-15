import api from "../../../config/axios";

// Gọi API để gửi email khôi phục mật khẩu
export const forgotPasswordApi = async (email) => {
  try {
    const response = await api.post("account/forgot-password", email, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("✅ OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API forgot password:", error);
    throw error;
  }
};

export const resetPasswordApi = async ({ email, otp, newPassword }) => {
  try {
    const response = await api.post(
      "account/reset-password",
      { email, otp, newPassword },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Reset password success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi đặt lại mật khẩu:", error);
    throw error.response?.data || error;
  }
};
