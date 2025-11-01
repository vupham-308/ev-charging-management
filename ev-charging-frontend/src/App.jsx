// jsx
// phối hợp JS & HTML 1 cách dễ dàng
import React, { useEffect } from "react";
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
import ManageChargingSession from "./pages/chargingSession";
import ManageConfirmBill from "./pages/confirmBill";
import ManageIncidentReport from "./pages/incidentReport";
import ManageStationReport from "./pages/stationReport";
import ManageStartChargingBooking from "./pages/startChargingBooking";
import ManageTransaction from "./pages/transaction";
import ManageTopup from "./pages/topup";
import { useDispatch } from "react-redux";
import { setAccount } from "./redux/accountSlice"; // sửa đúng path slice của bạn
import TermsPrivacyPage from "./pages/terms";
import PaymentReturn from "./pages/paymentReturn";
// 1. Component
// là 1 cái function
// trả về 1 cái giao diện
function AppContent() {
  const dispatch = useDispatch();

  // ✅ Khôi phục account từ localStorage khi load app (chỉ chạy 1 lần)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        dispatch(setAccount(parsedUser));
      } catch (err) {
        console.error("Error parsing user:", err);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

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
      path: "/terms",
      element: <TermsPrivacyPage />,
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
          path: "startCharging/:stationId",
          element: <ManageStartCharging />,
        },
        {
          path: "startCharging/:stationId/stationReport",
          element: <ManageStationReport />,
        },
        {
          path: "startChargingBooking/:stationId",
          element: <ManageStartChargingBooking />,
        },

        {
          path: "myBooking",
          element: <ManageMyBooking />,
        },
        {
          path: "confirmBill",
          element: <ManageConfirmBill />,
        },
        {
          path: "chargingSession",
          element: <ManageChargingSession />,
        },
        {
          path: "chargingSession/stationReport/:stationId",
          element: <ManageStationReport />,
        },

        {
          path: "incidentReport",
          element: <ManageIncidentReport />,
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
        {
          path: "profile",
          element: <ProfilePage />,
        },
        {
          path: "transaction",
          element: <ManageTransaction />,
        },
        {
          path: "topup",
          element: <ManageTopup />,
        },
        {
          path: "payment-return",
          element: <PaymentReturn />,
        },
      ],
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
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
