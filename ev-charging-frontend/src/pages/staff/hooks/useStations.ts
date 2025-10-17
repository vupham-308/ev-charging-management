"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { getStations } from "../services/stationService" 

interface StationStatus {
  available: number
  occupied: number
  reserved: number
  outOfService: number
}

export const useStations = () => {
  const [stations, setStations] = useState<StationStatus>({
    available: 0,
    occupied: 0,
    reserved: 0,
    outOfService: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchStations = async () => {
    setIsLoading(true)
    try {
      const data = await getStations()
      setStations(data)
      toast.success("Lấy danh sách trạm thành công!")
    } catch (error) {
      console.error("Error fetching stations:", error)
      toast.error("Không thể tải danh sách trạm!")
    } finally {
      setIsLoading(false)
    }
  }

  return { stations, isLoading, fetchStations }
}
