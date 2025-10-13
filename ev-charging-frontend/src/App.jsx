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
// Add
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Users from "./pages/admin/Users"
import IncidentManagement from "./pages/admin/IncidentManagement";
import ChargingRates from "./pages/admin/ChargingRates";
import ChargingStations from "./pages/admin/ChargingStations";


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
          element: <ManageBike />,
        },
        {
          path: "category",
          element: <ManageCategory />,
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
      path: "/register",
      element: <RegisterPage />,
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
    //  Route dành cho Admin có layout dùng Outlet
    {
      path: "/admin",
      element: <AdminDashboard />,
      children: [
        {
          index: true, // khi vào /admin sẽ mặc định hiện DashboardAdmin
          element: <DashboardAdmin />
        },
        {
          path: "dashboardadmin",
          element: <DashboardAdmin />
        },
        {
          path: "users",
          element: <Users />
        },
        {
          path: "stations",
          element: <ChargingStations />
        },
        {
          path: "incidents",
          element: <IncidentManagement />
        },
        {
          path: "settings",
          element: <ChargingRates />
        },
      ]
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
