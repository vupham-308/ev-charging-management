import api from "./../../../config/axios"  // hoặc đường dẫn phù hợp với cấu trúc thư mục của bạn

export const getProblems = async (stationId: string) => {
  try {
    const response = await api.get("problem/get-all-by-staff", { params: { stationId } })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching problems:", error)
    throw error
  }
}
