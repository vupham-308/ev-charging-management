import { useState } from "react";
import { message } from "antd";
import { cancelReservation } from "../services/cancelReserveService";

export const useCancelReserve = () => {
  const [loading, setLoading] = useState(false);

  const cancel = async (reservationId) => {
    setLoading(true);
    try {
      const res = await cancelReservation(reservationId);
      message.success("Reservation cancelled successfully!");
      return res;
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to cancel reservation!"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { cancel, loading };
};
