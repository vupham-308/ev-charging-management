import api from "../../../config/axios";

export const updatePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  try {
    console.log("🔹 Sending data:", { currentPassword, newPassword, confirmPassword }); // Log gửi đi
    const response = await api.put("profile/update-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    console.log("Password updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    console.error("❌ error.response:", error.response);
    throw error.response?.data || { message: "Lỗi hệ thống, vui lòng thử lại sau." };
  }
};


