"use client";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useProfile } from "../hooks/useProfile";

export const Header = () => {
  const { logout } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const { profile, isLoading, error } = useProfile();

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Quản lý trạm sạc
            </h1>

            {isLoading ? (
              <p className="text-sm text-gray-400">Đang tải thông tin...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Lỗi tải hồ sơ</p>
            ) : (
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {profile?.fullName || "Không rõ tên"}
                </span>
                <span className="text-gray-500">{profile?.role}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-s text-gray-500">
                {profile?.station.name}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {profile?.station.address}
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
                onClick={logout}
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
          toast.success("Đổi mật khẩu thành công! 🎉\nVui lòng đăng nhập lại!", {
            icon: <CheckCircleIcon className="h-5 w-5 text-white" />,
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          setTimeout(() => logout(), 2200);
        }}
      />
    </>
  );
};
