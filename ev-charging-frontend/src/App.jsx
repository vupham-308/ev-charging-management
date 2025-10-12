// jsx
// phối hợp JS & HTML 1 cách dễ dàng

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ManageBike from "./pages/bike";
import ManageCategory from "./pages/category";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import EbikeHomePage from "./pages/home";
import UserHomePage from "./pages/home";
import EVChargeHomePage from "./pages/home";
import AdminPage from "./pages/admin";
import StaffDashboard from "./pages/staff";
import AdminDashboard from "./pages/admin";
import DriverDashboard from "./pages/driver";
import ProfilePage from "./pages/profile";

// 1. Component
// là 1 cái function
// trả về 1 cái giao diện

function App() {
  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "bike",
          element: <ManageBike />, // Outlet
        },
        {
          path: "category",
          element: <ManageCategory />, // Outlet
        },
      ],
    },
    {
      path: "/",
      element: <EVChargeHomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
    {
      path: "/staff",
      element: <StaffDashboard />,
    },
    {
      path: "/driver",
      element: <DriverDashboard />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
