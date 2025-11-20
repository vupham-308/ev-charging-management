import { createContext, useContext, useEffect, useState } from "react";
import { useChargerPoints } from "../hooks/useChargerPoints";
import { updatePointStatus as apiUpdatePointStatus } from "../services/pointStatusService";

const ChargerPointsContext = createContext();

export const ChargerPointsProvider = ({ children }) => {
  const { chargerPoints, isLoading, fetchChargerPoints } = useChargerPoints();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    setPoints(chargerPoints);
  }, [chargerPoints]);

  // Update trạng thái trụ ngay trên UI, có rollback nếu API thất bại
  const updatePointStatus = async (pointID, newStatus) => {
    // Lưu state cũ để rollback nếu cần
    const oldPoints = [...points];
    // Cập nhật local state ngay lập tức
    setPoints((prev) =>
      prev.map((p) => (p.id === pointID ? { ...p, status: newStatus } : p))
    );

    try {
      await apiUpdatePointStatus(pointID, newStatus);
      // Nếu muốn, có thể fetch lại toàn bộ từ server để chắc chắn đồng bộ
      await fetchChargerPoints();
    } catch (error) {
      console.error("Failed to update status:", error);
      // rollback state về cũ
      setPoints(oldPoints);
    }
  };

  return (
    <ChargerPointsContext.Provider
      value={{ points, setPoints, isLoading, fetchChargerPoints, updatePointStatus }}
    >
      {children}
    </ChargerPointsContext.Provider>
  );
};

export const useChargerPointsContext = () => useContext(ChargerPointsContext);
