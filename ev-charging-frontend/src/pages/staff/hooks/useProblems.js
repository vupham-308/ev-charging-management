"use client";

import { useEffect, useState } from "react";
import { getProblems } from "../services/problemService";

export const useProblems = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const data = await getProblems();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return { problems, isLoading, fetchProblems };
};
