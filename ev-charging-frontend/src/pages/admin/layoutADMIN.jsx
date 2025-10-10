import React from "react";
import Header from "./headerADMIN";
import Navbar from "./navbarADMIN";
import { Outlet } from "react-router-dom";
import "./cssAdmin/layoutAdmin.css";

const Layout = () => {
    return (
        <div className="layout">
            <Header />
            <Navbar />
            <div className="content">
                <Outlet /> {/* nơi hiển thị các trang con */}
            </div>
        </div>
    );
};

export default Layout;
