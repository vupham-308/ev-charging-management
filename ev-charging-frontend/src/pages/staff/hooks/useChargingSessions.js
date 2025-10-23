import { useEffect, useState } from "react";
import { getChargingSession } from "../services/chargingSessionService";

export const useChargingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getChargingSession();
      setSessions(data);
    } catch (err) {
      console.error("Error fetching charging sessions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return { sessions, isLoading, fetchSessions };
};
