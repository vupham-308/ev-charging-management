import api from "./../../../config/axios"

export const getStations = async () => {
  try {
    const response = await api.get("staff/station/status")
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching stations:", error)
    throw error
  }
}
