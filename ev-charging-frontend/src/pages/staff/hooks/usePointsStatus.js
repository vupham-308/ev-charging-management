"use client";
import { useState } from "react";
import { updatePointStatus } from "../services/chargerPointService";

export const useChargerPoints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdateStatus = async (pointID, status) => {
    setIsLoading(true);
    try {
      const res = await updatePointStatus(pointID, status);
      setMessage(`Updated successfully: ${res.message || "OK"}`);
    } catch (error) {
        console.error("Error updating point status:", error);
      setMessage("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, message, handleUpdateStatus };
};
