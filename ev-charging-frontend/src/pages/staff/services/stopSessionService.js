import api from "../../../config/axios";

// Dừng phiên sạc
export const stopSession = async (sessionId) => {
  try {
    const response = await api.post(`/stop/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error stopping session:", error);
    throw error;
  }
};