import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { Spin } from "antd";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      window.alert("Bạn cần đăng nhập để truy cập trang này!");

    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;