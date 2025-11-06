import { createContext, useContext, useEffect, useState } from "react";
import { useChargerPoints } from "../hooks/useChargerPoints";

const ChargerPointsContext = createContext();

export const ChargerPointsProvider = ({ children }) => {
  const { chargerPoints, isLoading, fetchChargerPoints } = useChargerPoints();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    setPoints(chargerPoints);
  }, [chargerPoints]);

  return (
    <ChargerPointsContext.Provider
      value={{ points, setPoints, isLoading, fetchChargerPoints }}
    >
      {children}
    </ChargerPointsContext.Provider>
  );
};

export const useChargerPointsContext = () => useContext(ChargerPointsContext);
