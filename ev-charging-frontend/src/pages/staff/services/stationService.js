import api from "../../../config/axios";

export const getStations = async () => {
  try {
    const response = await api.get("staff/station/status");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stations:", error);
    throw error;
  }
};

export const getChargerPoints = async () => {
  try {
    const response = await api.get("chargerPoint/staff/points")
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching charger points:", error)
    throw error
  }
}
