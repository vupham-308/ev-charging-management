"use client";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import UpdateProfileModal from "./UpdateProfileModal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useProfile } from "../contexts/ProfileContext";

export const Header = () => {
  const { logout } = useAuth();
  const { profile, isLoading, error } = useProfile();

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

  const handleLogout = () => {
    setTimeout(() => logout(), 500);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-900">
              ⚡ Quản lý trạm sạc
            </h1>

            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">Không tải được hồ sơ ❌</p>
            ) : (
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Tên nhân viên: {profile?.fullName || "Người dùng"}
                </span>
                <span className="text-gray-500">
                  Email: {profile?.email || "Chưa có email"}
                </span>
                {profile?.phone && (
                  <span className="text-gray-500">
                    Số điện thoại 📞: {profile.phone}
                  </span>
                )}
                <span className="text-blue-600">
                  Role: {profile?.role || "N/A"}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-8">
            {profile?.station ? (
              <div className="text-right">
                <p className="text-xs text-gray-500">{profile.station.name}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {profile.station.address}
                </p>
              </div>
            ) : (
              <div className="text-right text-sm text-gray-400">
                <p>Chưa có thông tin trạm</p>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
              <button
                onClick={() => setOpenUpdateProfile(true)}
                className="flex items-center gap-2 font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-blue-50 transition"
              >
                <span className="text-sm font-medium">Cập nhật hồ sơ</span>
              </button>

              <button
                onClick={() => setOpenChangePassword(true)}
                className="flex items-center gap-2 font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Đổi mật khẩu</span>
              </button>

              <button
                onClick={handleLogout}
                className="font-medium text-gray-800 border border-gray-300 rounded-lg px-4 py-1 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        onSuccess={() => {
          toast.success("🎉 Đổi mật khẩu thành công! Vui lòng đăng nhập lại.", {
            icon: <CheckCircleIcon className="h-5 w-5 text-white" />,
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          setTimeout(() => logout(), 2200);
        }}
      />

      {/* Modal cập nhật hồ sơ */}
      <UpdateProfileModal
        open={openUpdateProfile}
        onClose={() => setOpenUpdateProfile(false)}
      />
    </>
  );
};
