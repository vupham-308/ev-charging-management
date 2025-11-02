import api from "../../../config/axios";

export const getProblems = async () => {
  try {
    const response = await api.get("problem/get-all-by-staff");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw error;
  }
};

export const updateProblemStatus = async (status, body) => {
  try {
    const response = await api.put(`problem/admin/set/${status}`, body);
    return response.data;
  } catch (error) {
    console.error("Error updating problem status:", error);
    throw error;
  }
};

// Phản hồi problem report
export const respondProblemReport = async (problemId, body) => {
  try {
    const response = await api.put(`problem/response/${problemId}`, body);
    return response.data;
  } catch (error) {
    console.error("Error responding to problem:", error);
    throw error;
  }
};
