import { useState, useEffect } from "react";
import { getChargerPoints } from "../services/stationService";

export const useChargerPoints = () => {
  const [chargerPoints, setChargerPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChargerPoints = async () => {
    setIsLoading(true);
    try {
      const data = await getChargerPoints();
      setChargerPoints(data);
    } catch (error) {
      console.error("Error fetching charger points:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChargerPoints();
  }, []);

  return { chargerPoints, isLoading, fetchChargerPoints };
};
