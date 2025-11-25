// components/ProtectedRoute.js (phiên bản tốt nhất)
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { getUser, isAuthorized: checkAuth, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthorization();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthorization = () => {
    try {
      const user = getUser();

      if (!user) {
        toast.warning(
          "Vui lòng thực hiện thao tác đăng nhập trước khi tiếp tục"
        );
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Kiểm tra role
      if (!checkAuth(requiredRole)) {
        const roleNames = {
          STAFF: "Nhân viên",
          ADMIN: "Quản trị viên",
          USER: "Tài xế",
        };

        toast.error(
          `🚫Bạn cần quyền ${roleNames[requiredRole]} để vào được trang này`
        );
        toast.info('🔄 Đã đăng xuất tài khoản hiện tại để đảm bảo bảo mật');
        logout();
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Lỗi kiểm tra quyền truy cập:", error);
      toast.error("❌ Có lỗi xảy ra khi kiểm tra quyền truy cập");

      // Logout khi có lỗi
      logout();
      setIsAuthorized(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return <LoadingSpinner message="Đang kiểm tra quyền truy cập..." />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
