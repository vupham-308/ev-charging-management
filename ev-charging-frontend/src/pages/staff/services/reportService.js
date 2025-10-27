import api from "../../../config/axios";

export const getReportData = async () => {
  try {
    const response = await api.get("staff/dashboard-status");
    console.log("📊 Report API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
};
