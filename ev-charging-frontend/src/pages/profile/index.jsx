import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiStar,
  FiLock,
  FiArrowLeft,
  FiPhoneCall,
  FiEdit3,
  FiSettings,
  FiCreditCard,
  FiSave,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // 🔹 Lấy dữ liệu người dùng khi mở trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // hoặc sessionStorage nếu bạn lưu ở đó
        if (!token) {
          console.error("❌ Chưa có token đăng nhập!");
          return;
        }

        const response = await api.get("/profile/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("📦 API Response:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin người dùng:", error);
        alert("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Xử lý khi chỉnh sửa input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Lưu thông tin người dùng (PUT /account/profile)
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put("/profile/update", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Lỗi cập nhật thông tin:", error);
      toast.warning("Không thể cập nhật thông tin!");
    }
  };

  // 🔹 Lưu mật khẩu (PUT /account/password)
  const handleSavePassword = async () => {
    if (password.new !== password.confirm) {
      toast.warning("❌ Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/profile/update-password",
        {
          currentPassword: password.current,
          newPassword: password.new,
          confirmPassword: password.confirm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Cập nhật mật khẩu thành công!");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      toast.warning("Đổi mật khẩu thất bại!");
    }
  };

  const handleCancelPasswordChange = () => {
    setPassword({ current: "", new: "", confirm: "" });
  };

  localStorage.setItem("user", JSON.stringify(user));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-color font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-lg border-b border-gray-700 z-50 flex items-center px-6 md:px-12 py-4">
        <button
          onClick={() => {
            navigate("/driver");
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-lg"
        >
          <FiArrowLeft /> Quay lại
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold text-white tracking-wide">
          Hồ sơ cá nhân
        </h1>
        <div className="w-[80px] md:w-[120px]"></div>
      </div>

      {/* Nội dung */}
      <div className="pt-28 pb-20 px-6 md:px-12 max-w-5xl mx-auto space-y-10">
        {/* --- Thông tin cơ bản --- */}
        <section className="bg-secondary-bg p-8 rounded-2xl border border-border-color shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
            <FiUser className="text-primary" /> Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div>
              <p className="text-gray-500 text-sm mb-1">Họ và tên</p>
              {isEditing ? (
                <input
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-lg text-black"
                />
              ) : (
                <p className="font-semibold text-black text-lg">
                  {user?.fullName}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              {isEditing ? (
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-lg text-black"
                />
              ) : (
                <p className="font-semibold flex items-center gap-2 text-lg">
                  <FiMail className="text-primary" /> {user?.email}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
              {isEditing ? (
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-400 rounded-lg text-black"
                />
              ) : (
                <p className="font-semibold flex items-center gap-2 text-lg">
                  <FiPhone className="text-primary" /> {user?.phone}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-dark-bg rounded-full font-semibold hover:bg-black hover:text-primary transition-all"
                >
                  <FiSave /> Lưu thay đổi
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-500 text-gray-500 rounded-full font-semibold hover:bg-gray-700 transition-all"
                >
                  <FiXCircle /> Hủy
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-primary text-dark-bg font-semibold rounded-full hover:bg-black hover:text-primary transition-all"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </section>

        {/* --- Chương trình thành viên --- */}
        <section className="bg-secondary-bg p-8 rounded-2xl border border-border-color shadow-lg">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
            <FiStar className="text-yellow-400" /> Chương trình thành viên
          </h2>
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">
              {user?.memberLevel}
            </h3>
            <p className="text-yellow-400 font-medium text-lg">
              {user?.rewardPoints?.toLocaleString()} điểm thưởng
            </p>
          </div>
        </section>

        {/* --- Đổi mật khẩu --- */}
        <section className="bg-secondary-bg p-8 rounded-2xl border border-border-color shadow-lg">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
            <FiLock className="text-red-400" /> Đổi mật khẩu
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              name="current"
              placeholder="Mật khẩu hiện tại"
              className="w-full p-4 rounded-lg border border-border-color text-black"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
            />
            <input
              type="password"
              name="new"
              placeholder="Mật khẩu mới"
              className="w-full p-4 rounded-lg border border-border-color text-black"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
            />
            <input
              type="password"
              name="confirm"
              placeholder="Xác nhận mật khẩu mới"
              className="w-full p-4 rounded-lg border border-border-color text-black"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
            />
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleSavePassword}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-dark-bg font-semibold rounded-full hover:bg-black transition-all"
              >
                <FiSave /> Lưu thay đổi
              </button>
              <button
                onClick={handleCancelPasswordChange}
                className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-600 rounded-full text-gray-300 hover:bg-gray-700 transition-all"
              >
                <FiXCircle /> Hủy bỏ
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
