import api from "../../../config/axios";

export const getReportedProblems = async () => {
  try {
    const response = await api.get("problem/getAll");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching reported problems:", error);
    throw error;
  }
};