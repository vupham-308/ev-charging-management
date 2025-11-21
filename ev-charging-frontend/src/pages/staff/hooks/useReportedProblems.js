import { useEffect, useState } from "react";
import { getReportedProblems } from "../services/ReportedProblemsService";

export const useReportedProblems = () => {
  const [reportedProblems, setReportedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportedProblems = async () => {
    setIsLoading(true);
    try {
      const data = await getReportedProblems();
      setReportedProblems(data);
    } catch (error) {
      console.error("Error fetching reported problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedProblems();
  }, []);

  return {
    reportedProblems,
    isLoading,
    fetchReportedProblems,
    setReportedProblems,
  };
};
