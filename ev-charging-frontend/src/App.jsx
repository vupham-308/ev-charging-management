// jsx
// phối hợp JS & HTML 1 cách dễ dàng

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import EVChargeHomePage from "./pages/home";
import StaffDashboard from "./pages/staff";
import AdminDashboard from "./pages/admin";
import DriverDashboard from "./pages/driver";
import ProfilePage from "./pages/profile";
// Add
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Users from "./pages/admin/Users";
import IncidentManagement from "./pages/admin/IncidentManagement";
import ChargingRates from "./pages/admin/ChargingRates";
import ChargingStations from "./pages/admin/ChargingStations";

import ManageMap from "./pages/map";
import ManageMyCar from "./pages/myCar";
import ManageAddCar from "./pages/addCar";
import ManageEditCar from "./pages/editCar";
import ManageDeleteCar from "./pages/deleteCar";
import ManageBooking from "./pages/booking";
import ManageMyBooking from "./pages/myBooking";
import ManageStartCharging from "./pages/startCharging";

// 1. Component
// là 1 cái function
// trả về 1 cái giao diện

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <EVChargeHomePage />,
      children: [
        {
          path: "map",
          element: <ManageMap />,
        },
      ],
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
      children: [
        {
          path: "map",
          element: <ManageMap />,
        },
        {
          path: "booking/:stationId",
          element: <ManageBooking />,
        },
        {
          path: "startCharging",
          element: <ManageStartCharging />,
        },
        {
          path: "myBooking",
          element: <ManageMyBooking />,
        },
        {
          path: "myCar",
          element: <ManageMyCar />,
          children: [
            {
              path: "addCar",
              element: <ManageAddCar />,
            },
            {
              path: "editCar/:id",
              element: <ManageEditCar />,
            },
            {
              path: "deleteCar/:id",
              element: <ManageDeleteCar />,
            },
          ],
        },
      ],
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
          element: <DashboardAdmin />,
        },
        {
          path: "dashboardadmin",
          element: <DashboardAdmin />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "stations",
          element: <ChargingStations />,
        },
        {
          path: "incidents",
          element: <IncidentManagement />,
        },
        {
          path: "settings",
          element: <ChargingRates />,
        },
      ],
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
