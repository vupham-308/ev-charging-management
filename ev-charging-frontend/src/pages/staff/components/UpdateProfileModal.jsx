"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useProfile } from "../contexts/ProfileContext";

const UpdateProfileModal = ({ open, onClose, onSuccess }) => {
  const { profile, isUpdating, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Validation trước khi gửi
  const validateForm = () => {
    const { fullName, email, phone } = formData;
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại không hợp lệ! (VD: 0811609060)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await updateProfile(formData);

    if (res.success) {
      if (onSuccess) onSuccess(); // 🔥 gọi callback từ Header
      onClose();
    } else {
      toast.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Cập nhật thông tin cá nhân
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
