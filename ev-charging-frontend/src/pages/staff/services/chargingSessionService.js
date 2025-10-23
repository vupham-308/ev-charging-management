import api from "../../../config/axios";

export const getChargingSession = async () => {
  try {
    const response = await api.get("getAllByStaff");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Charging Session:", error);
    throw error;
  }
};
