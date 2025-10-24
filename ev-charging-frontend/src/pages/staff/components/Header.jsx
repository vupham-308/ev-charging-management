"use client";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Header = ({ userName, userRole, onLogout }) => {
  const { logout } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Quản lý trạm sạc
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                {userName}
              </span>
              <span className="text-gray-500">{userRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Trung tâm thương mại Vincom
              </p>
              <p className="text-sm font-semibold text-gray-900">
                123 Nguyễn Huệ, Quận 1
              </p>
            </div>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Đổi mật khẩu</span>
              </button>
              <button
                onClick={onLogout}
                className="font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          toast.warning("Vui lòng đăng nhập lại để xác nhận bảo mật 🔐", {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => logout(), 2200); // logout sau khi toast biến mất
        }}
      />
    </>
  );
};
