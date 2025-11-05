import api from "../../../config/axios";

export const getProfileData = async () => {
  try {
    const response = await api.get("profile/get");
    console.log("👤 Profile API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

export const updateProfileData = async ({ fullName, email, phone }) => {
  try {
    const payload = { fullName, email, phone };

    console.log("📤 Sending payload:", payload);

    const response = await api.put("profile/update", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Profile updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile data:",
      error.response?.data || error
    );
    throw error;
  }
};
