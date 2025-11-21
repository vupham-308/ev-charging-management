import { useState } from "react";
import { stopSession } from "../services/stopSessionService";

export const useStopSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stopSessionHandler = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await stopSession(sessionId);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Dừng phiên sạc thất bại";
      setError(errorMessage);
      throw err; // Chỉ throw error, không gọi message ở đây
    } finally {
      setLoading(false);
    }
  };

  return {
    stopSession: stopSessionHandler,
    loading,
    error,
  };
};