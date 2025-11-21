import { useState } from "react";
import { createProblem } from "../services/problemService";

export const useCreateProblem = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateProblem = async (stationId, problemData) => {
    setLoading(true);
    try {
      const newProblem = await createProblem(stationId, problemData);
      return newProblem; // Trả về problem mới
    } catch (error) {
      console.error("Error creating problem:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreateProblem,
    loading,
  };
};
