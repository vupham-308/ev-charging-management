import api from "../../../config/axios";

export const cancelReservation = async (id) => {
  try {
    const response = await api.put(`reservations/cancel/${id}`);
    console.log("🚫 Cancel Reservation Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error cancelling reservation:", error);
    throw error;
  }
};
