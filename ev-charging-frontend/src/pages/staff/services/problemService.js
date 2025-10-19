import api from "./../../../config/axios" // hoặc chỉnh lại đường dẫn phù hợp

export const getProblems = async (stationId) => {
  try {
    const response = await api.get("problem/get-all-by-staff", { params: { stationId } })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching problems:", error)
    throw error
  }
}
