import React from "react";
import "./cssAdmin/HeaderAdmin.css";


const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h2>Quản trị hệ thống</h2>
                <div className="header-center">
                    <span className="name">Lê Văn Cường</span>
                    <span className="role">Quản trị viên</span>
                </div>
            </div>
            <div className="header-right">
                <button className="btn">Đổi mật khẩu</button>
                <button className="btn logout">Đăng xuất</button>
            </div>
        </header>
    );
};

export default Header;
