import { useState, useEffect } from "react";
import { useProfile } from "../contexts/ProfileContext";
import {
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const UpdateProfileModal = ({ open, onClose, onSuccess }) => {
  const { profile, isUpdating, updateProfile } = useProfile();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Lưu lỗi theo từng field
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Thông báo tổng (success hoặc fail)
  const [message, setMessage] = useState({ type: "", text: [] });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (open) {
      setMessage({ type: "", text: [] });
      setFieldErrors({ fullName: "", email: "", phone: "" });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Khi user gõ lại -> clear lỗi field đó
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const { fullName, email, phone } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)(\d{9})$/;
    const fullNameRegex = /^[a-zA-ZÀ-ỹ\s']+$/;

    const newErrors = {};
    const messages = [];

    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên!";
      messages.push(newErrors.fullName);
    } else if (!fullNameRegex.test(fullName.trim())) {
      newErrors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng!";
      messages.push(newErrors.fullName);
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email!";
      messages.push(newErrors.email);
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Email không hợp lệ!";
      messages.push(newErrors.email);
    }

    // Phone
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại!";
      messages.push(newErrors.phone);
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (ví dụ: 0811609060).";
      messages.push(newErrors.phone);
    }

    setFieldErrors(newErrors);

    if (messages.length > 0) {
      setMessage({ type: "error", text: messages });
      return false;
    }

    setMessage({ type: "", text: [] });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: [] });

    if (!validateForm()) return;

    // ✅ Kiểm tra nếu người dùng không thay đổi gì
    const isUnchanged =
      formData.fullName === (profile.fullName || "") &&
      formData.email === (profile.email || "") &&
      formData.phone === (profile.phone || "");

    if (isUnchanged) {
      setMessage({
        type: "info",
        text: ["Bạn chưa thay đổi thông tin nào để cập nhật!"],
      });
      setTimeout(() => {
        onClose?.();
      }, 900);
      return;
    }

    // ✅ Gọi API nếu có thay đổi
    const res = await updateProfile(formData);
    if (res.success) {
      setMessage({ type: "success", text: ["Cập nhật thành công!"] });
      onSuccess?.();
      setTimeout(() => onClose?.(), 1000);
    } else {
      setMessage({
        type: "error",
        text: ["Cập nhật thất bại, vui lòng thử lại!"],
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            className="bg-white rounded-2xl shadow-2xl w-[420px] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Cập nhật thông tin cá nhân
              </h2>
            </div>

            {/* Thông báo tổng */}
            {message.type === "error" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
                <XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {message.text.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {message.type === "success" && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg mb-4">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">{message.text[0]}</span>
              </div>
            )}

            {message.type === "info" && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 px-3 py-2 rounded-lg mb-4">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">{message.text[0]}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className={`w-full border rounded-lg p-2.5 text-sm transition focus:ring-2 ${
                    fieldErrors.fullName
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className={`w-full border rounded-lg p-2.5 text-sm transition focus:ring-2 ${
                    fieldErrors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className={`w-full border rounded-lg p-2.5 text-sm transition focus:ring-2 ${
                    fieldErrors.phone
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMessage({ type: "", text: [] });
                    setFieldErrors({ fullName: "", email: "", phone: "" });
                    onClose?.();
                  }}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 transition"
                >
                  {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfileModal;
