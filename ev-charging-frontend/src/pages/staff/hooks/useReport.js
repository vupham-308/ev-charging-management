import { useEffect, useState } from "react";
import { getReportData } from "../services/reportService";

export const useReport = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const data = await getReportData();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return { report, isLoading, fetchReport };
};
