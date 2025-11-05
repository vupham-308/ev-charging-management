"use client";
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
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  // Khi profile thay đổi (lần đầu load modal) -> fill dữ liệu
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  // Khi modal được mở: reset state thông báo để không còn message cũ
  useEffect(() => {
    if (open) {
      setErrors([]);
      setSuccess(false);
    }
  }, [open]);

  // Khi user thay đổi bất cứ input nào -> clear success (nếu trước đó đã success)
  useEffect(() => {
    if (success) {
      setSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fullName, formData.email, formData.phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // cũng có thể clear errors từng field ở đây nếu muốn
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    const { fullName, email, phone } = formData;
    const newErrors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)(\d{9})$/;

    if (!fullName.trim()) newErrors.push("Vui lòng nhập họ và tên!");
    if (!emailRegex.test(email)) newErrors.push("Email không hợp lệ!");
    if (!phoneRegex.test(phone))
      newErrors.push("Số điện thoại không hợp lệ! (VD: 0811609060)");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    if (!validateForm()) return;

    const res = await updateProfile(formData);
    if (res.success) {
      setSuccess(true);
      onSuccess?.();
      // vẫn giữ nhỏ delay để animation hiển thị, nhưng success sẽ auto-clear
      setTimeout(() => {
        onClose?.();
      }, 800);
    } else {
      setErrors(["Cập nhật thất bại, vui lòng thử lại!"]);
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
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Cập nhật thông tin cá nhân
              </h2>
            </div>

            {/* Error message */}
            {errors.length > 0 && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
                <XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg mb-4">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">Cập nhật thành công!</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    // nếu bấm Hủy thì reset state luôn
                    setErrors([]);
                    setSuccess(false);
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
