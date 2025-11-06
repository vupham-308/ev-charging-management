import api from "../../../config/axios";

// Gọi API để gửi email khôi phục mật khẩu
export const forgotPasswordApi = async (email) => {
  try {
    // Gửi email dạng text/plain chứ không phải JSON object
    const response = await api.post("account/forgot-password", email, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("✅ OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API forgot password:", error);
    throw error.response?.data || error;
  }
};

export const verifyEmailApi = async ({ email, otp }) => {
  try {
    const response = await api.post("account/verify", { email, otp });
    console.log("✅ Verify email success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API verify email:", error);
    throw error.response?.data || error;
  }
};
