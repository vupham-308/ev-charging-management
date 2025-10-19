"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { getProblems } from "../services/problemService"

export const useProblems = () => {
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchProblems = async (stationId) => {
    if (!stationId) {
      toast.warning("Vui lòng nhập Station ID trước!")
      return
    }

    setIsLoading(true)
    try {
      const data = await getProblems(stationId)
      setProblems(data)
      toast.success("Lấy danh sách sự cố thành công!")
    } catch (error) {
      console.error("Error fetching problems:", error)
      toast.error("Không thể tải danh sách sự cố!")
    } finally {
      setIsLoading(false)
    }
  }

  return { problems, isLoading, fetchProblems }
}
