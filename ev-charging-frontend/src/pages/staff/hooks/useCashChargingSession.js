// src/hooks/useCashChargingSession.js
import { useState } from "react";
import { cashChargingSession } from "../services/chargingSessionService";
import { message } from "antd";

export const useCashChargingSession = () => {
  const [loading, setLoading] = useState(false);

  const handleCashChargingSession = async (sessionId) => {
    setLoading(true);
    try {
      const result = await cashChargingSession(sessionId);
      message.success("Xử lý thanh toán tiền mặt thành công!");
      console.log("Cash response:", result);
      return result;
    } catch (error) {
      console.error("Error in cash payment:", error);
      message.error("Không thể xử lý thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return { handleCashChargingSession, loading };
};
