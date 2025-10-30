import { useEffect, useState } from "react";
import {
  getProblems,
  updateProblemStatus,
  respondProblemReport,
} from "../services/problemService";

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

  const handleUpdateStatus = async (status, body) => {
    try {
      await updateProblemStatus(status, body);
      await fetchProblems(); // cập nhật lại danh sách sau khi sửa
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  

  const handleRespond = async (problemId, body) => {
    try {
      await respondProblemReport(problemId, body);
      await fetchProblems();
    } catch (error) {
      console.error("Error responding to problem:", error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return {
    problems,
    isLoading,
    fetchProblems,
    handleUpdateStatus,
    handleRespond,
  };
};
