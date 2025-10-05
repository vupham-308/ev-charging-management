import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MainApp from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "antd/dist/reset.css";
import { App } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App>
          <MainApp />
        </App>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);