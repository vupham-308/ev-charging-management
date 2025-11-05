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
        onSuccess?.();
        onClose?.();
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
        <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
      ) : (
        <XCircleIcon className="h-5 w-5 text-gray-300" />
      )}
      <span className={condition ? "text-emerald-600" : "text-gray-600"}>
        {text}
      </span>
    </li>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 animate-slideUp"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <LockClosedIcon className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Đổi mật khẩu
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Vui lòng nhập mật khẩu hiện tại và đặt mật khẩu mới an toàn hơn.
        </p>

        {/* Error or Success */}
        {errors.length > 0 && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
            <XCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-2 rounded-lg mb-4">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Đổi mật khẩu thành công!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              label: "Mật khẩu hiện tại",
              value: currentPassword,
              setValue: setCurrentPassword,
              show: showCurrent,
              setShow: setShowCurrent,
              placeholder: "Nhập mật khẩu hiện tại",
            },
            {
              label: "Mật khẩu mới",
              value: newPassword,
              setValue: setNewPassword,
              show: showNew,
              setShow: setShowNew,
              placeholder: "Nhập mật khẩu mới",
            },
            {
              label: "Xác nhận mật khẩu mới",
              value: confirmPassword,
              setValue: setConfirmPassword,
              show: showConfirm,
              setShow: setShowConfirm,
              placeholder: "Nhập lại mật khẩu mới",
            },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={field.placeholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => field.setShow(!field.show)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {field.show ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Password requirements */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium mb-2 text-gray-700">
              Yêu cầu mật khẩu:
            </p>
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-60"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
