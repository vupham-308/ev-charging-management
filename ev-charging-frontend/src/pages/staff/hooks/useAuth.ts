import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const useAuth = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    sessionStorage.clear()
    toast.success("Đăng xuất thành công!")
    navigate("/", { replace: true })
  }

  return { logout }
}
