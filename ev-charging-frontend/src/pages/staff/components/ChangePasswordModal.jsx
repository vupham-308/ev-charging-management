"use client";
import { useEffect, useRef, useState } from "react";
import { useUpdatePassword } from "../hooks/useUpdatePass";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function ChangePasswordModal({ open, onClose, onSuccess }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const hasCalledSuccess = useRef(false);

  const {
    handleChangePassword,
    loading,
    errors,
    success,
    validatePasswordStrength,
  } = useUpdatePassword();

  useEffect(() => {
    if (success && !hasCalledSuccess.current) {
      hasCalledSuccess.current = true;
      setTimeout(() => {
        onSuccess?.(); // Gọi callback từ Header (trong đó gọi logout())
        onClose?.(); // Đóng modal
      }, 1500);
    }
  }, [success, onSuccess, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleChangePassword(currentPassword, newPassword, confirmPassword);
  };

  const { hasUppercase, hasLowercase, hasNumber, hasMinLength } =
    validatePasswordStrength(newPassword);

  const PasswordRequirement = ({ condition, text }) => (
    <li className="flex items-center gap-2">
      {condition ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
      ) : (
        <XCircleIcon className="h-5 w-5 text-gray-400" />
      )}
      <span className={condition ? "text-green-600" : "text-gray-600"}>
        {text}
      </span>
    </li>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <LockClosedIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Thay đổi mật khẩu để bảo mật tài khoản của bạn
        </p>

        {/* Error or Success */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showCurrent ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showNew ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showConfirm ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password requirements */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium mb-2">Yêu cầu mật khẩu:</p>
            <ul className="space-y-1">
              <PasswordRequirement
                condition={hasMinLength}
                text="Ít nhất 8 ký tự"
              />
              <PasswordRequirement
                condition={hasUppercase}
                text="Ít nhất 1 chữ cái viết hoa"
              />
              <PasswordRequirement
                condition={hasLowercase}
                text="Ít nhất 1 chữ cái viết thường"
              />
              <PasswordRequirement
                condition={hasNumber}
                text="Ít nhất 1 chữ số"
              />
            </ul>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg">
              <CheckCircleIcon className="h-5 w-5" />
              <span>Đổi mật khẩu thành công!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
