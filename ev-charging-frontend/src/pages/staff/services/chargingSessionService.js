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

export const cashChargingSession = async (sessionId) => {
  try {
    const response = await api.post(`cash/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error cashing Charging Session:", error);
    throw error;
  }
};
