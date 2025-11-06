import api from "../../../config/axios";


// Gọi API để gửi email khôi phục mật khẩu
export const forgotPasswordApi = async (email) => {
  try {
    const response = await api.post("account/forgot-password", { email });
    return response.data; // Trả về data để xử lý ở hook
  } catch (error) {
    console.error("❌ Lỗi khi gọi API forgot password:", error);
    throw error.response?.data || error;
  }
};

export const verifyEmailApi = async ({ email, otp }) => {
  try {
    const response = await api.post("account/verify", { email, otp });
    return response.data; // Thường gồm message hoặc token reset
  } catch (error) {
    console.error("❌ Lỗi khi gọi API verify email:", error);
    throw error.response?.data || error;
  }
};
