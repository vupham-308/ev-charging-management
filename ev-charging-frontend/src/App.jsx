import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import AuthContext from "./contexts/AuthContext";
import { Button, Layout, Space } from "antd";
import MainLayout from "./pages/MainLayout";

const { Header, Content } = Layout;

const Dashboard = () => {
  const { user, doLogout } = useContext(AuthContext);
  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>Dashboard</h2>
        <Space>
          <span style={{ color: 'white' }}>Chào, {user?.email}</span>
          <Button type="primary" danger onClick={doLogout}>
            Đăng xuất
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px' }}>
        <h1>Chào mừng bạn đến trang quản trị!</h1>
        <p>Đây là nội dung chỉ người đã đăng nhập mới thấy được.</p>
        <Link to="/">Về trang chủ</Link>
      </Content>
    </Layout>
  );
};

// Trang chủ (công khai)
const Home = () => (
  <div>
    <h1>Trang Chủ</h1>
    <p>Đây là trang công khai, ai cũng có thể xem.</p>
    <Link to="/dashboard">Đi tới Dashboard (yêu cầu đăng nhập)</Link>
  </div>
);

function MainApp() {
  return (
    <Routes>
      {/* Route cho trang Login, không dùng layout chung */}
      <Route path="/login" element={<LoginForm />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default MainApp;