import api from "../../../config/axios";

export const updatePointStatus = async (pointID, status) => {
  try {
    const response = await api.post("chargerPoint/staff/point-status", {
      pointID,
      status,
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating point status:", error);
    throw error;
  }
};
