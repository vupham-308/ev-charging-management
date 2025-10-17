import React from "react";
import { NavLink } from "react-router-dom";
import "../admin/navbarAdmin.css";

const Navbar = () => {
    const tabs = [
        { name: "Tổng quan", path: "/dashboardadmin" },
        { name: "Trạm sạc", path: "/stations" },
        { name: "Người dùng", path: "/users" },
        { name: "Quản lý sự cố", path: "/incidents" },
        { name: "Cài đặt", path: "/settings" },
    ];

    return (
        <nav className="navbar-tabs">
            {tabs.map((t) => (
                <NavLink
                    key={t.path}
                    to={t.path}
                    className={({ isActive }) => (isActive ? "tab active" : "tab")}
                >
                    {t.name}
                </NavLink>
            ))}
        </nav>
    );
};

export default Navbar;
