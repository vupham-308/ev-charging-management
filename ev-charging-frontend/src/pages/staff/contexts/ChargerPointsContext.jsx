import { createContext, useContext, useEffect, useState } from "react";
import { useChargerPoints } from "../hooks/useChargerPoints";
import { updatePointStatus as apiUpdatePointStatus } from "../services/pointStatusService";

const ChargerPointsContext = createContext();

export const ChargerPointsProvider = ({ children }) => {
  const { chargerPoints, isLoading, fetchChargerPoints } = useChargerPoints();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    console.log("ChargerPoints từ hook:", chargerPoints);
    setPoints(chargerPoints);
  }, [chargerPoints]);

  // SỬA LẠI HÀM updatePointStatus
  const updatePointStatus = async (pointID, newStatus) => {
    console.log(`Updating point ${pointID} to status: ${newStatus}`);
    
    const oldPoints = [...points];
    
    // Cập nhật local state ngay lập tức
    setPoints((prev) =>
      prev.map((p) => (p.id === pointID ? { ...p, status: newStatus } : p))
    );

    try {
      console.log("Gọi API update status...");
      await apiUpdatePointStatus(pointID, newStatus);
      
      console.log("API thành công, fetching lại data...");
      // QUAN TRỌNG: Đảm bảo fetchChargerPoints được gọi và hoạt động
      await fetchChargerPoints();
      
      console.log("Fetch completed, points mới:", points);
    } catch (error) {
      console.error("Failed to update status:", error);
      // rollback state về cũ
      setPoints(oldPoints);
      throw error; // QUAN TRỌNG: phải throw error để component bắt được
    }
  };

  return (
    <ChargerPointsContext.Provider
      value={{ 
        points, 
        setPoints, 
        isLoading, 
        fetchChargerPoints, 
        updatePointStatus 
      }}
    >
      {children}
    </ChargerPointsContext.Provider>
  );
};

export const useChargerPointsContext = () => useContext(ChargerPointsContext);