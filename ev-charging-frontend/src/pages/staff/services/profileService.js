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
