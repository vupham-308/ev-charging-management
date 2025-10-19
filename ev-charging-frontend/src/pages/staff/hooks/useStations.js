"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { getStations } from "../services/stationService";

export const useStations = () => {
  const [stations, setStations] = useState({
    available: 0,
    occupied: 0,
    reserved: 0,
    outOfService: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStations = async () => {
    setIsLoading(true);
    try {
      const data = await getStations();

      // ✅ Validate and safely set station data
      if (data && typeof data === "object") {
        setStations({
          available: data.available ?? 0,
          occupied: data.occupied ?? 0,
          reserved: data.reserved ?? 0,
          outOfService: data.outOfService ?? 0,
        });
      } else {
        console.warn("Unexpected station data format:", data);
        toast.warning("Dữ liệu trạm không hợp lệ.");
      }

      toast.success("Lấy danh sách trạm thành công!");
    } catch (error) {
      console.error("Error fetching stations:", error);
      toast.error("Không thể tải danh sách trạm!");
    } finally {
      setIsLoading(false);
    }
  };

  return { stations, isLoading, fetchStations };
};
