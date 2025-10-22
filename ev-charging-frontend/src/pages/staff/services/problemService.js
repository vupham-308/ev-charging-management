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
