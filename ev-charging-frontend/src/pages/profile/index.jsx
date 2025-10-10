import React, { useState } from "react";
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
  FiSave, // Added for save button
  FiXCircle, // Added for cancel button
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "Nguyễn Văn An",
    email: "driver@demo.com",
    phone: "+84123456789",
    memberLevel: "Thành viên thân thiết",
    rewardPoints: 1250,
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSavePassword = () => {
    if (password.new !== password.confirm) {
      alert("❌ Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    // In a real application, you would send this to your backend
    alert("✅ Cập nhật mật khẩu thành công!");
    setPassword({ current: "", new: "", confirm: "" }); // Clear fields after successful update
  };

  const handleCancelPasswordChange = () => {
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    // Apply consistent background and text colors from homepage
    <div className="min-h-screen bg-dark-bg text-text-color font-sans">
      {/* Header nhỏ - Styled to match homepage header */}
      <div className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-lg border-b border-gray-700 z-50 flex items-center px-6 md:px-12 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-lg"
        >
          <FiArrowLeft /> Quay lại
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold text-white tracking-wide">
          Hồ sơ cá nhân
        </h1>
        <div className="w-[80px] md:w-[120px]"></div>{" "}
        {/* Spacer to balance title */}
      </div>

      {/* Nội dung chính */}
      <div className="pt-28 pb-20 px-6 md:px-12 max-w-5xl mx-auto space-y-10">
        {/* --- Thông tin cơ bản --- */}
        <section className="bg-secondary-bg p-8 rounded-2xl border border-border-color shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
            <FiUser className="text-primary" /> Thông tin cơ bản
          </h2>
          <p className="text-text-muted mb-6 text-lg">
            Cập nhật thông tin cá nhân của bạn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div>
              <p className="text-gray-500 text-sm mb-1">Họ và tên</p>
              <p className="font-semibold text-black text-lg">
                {user.fullName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="font-semibold flex items-center gap-2 text-lg">
                <FiMail className="text-primary" /> {user.email}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
              <p className="font-semibold flex items-center gap-2 text-lg">
                <FiPhone className="text-primary" /> {user.phone}
              </p>
            </div>
            {/* You might add an edit button here for basic info */}
            {/* <div className="md:col-span-2 text-right">
              <button className="px-6 py-2 bg-primary text-dark-bg font-semibold rounded-full hover:bg-black hover:-translate-y-1 transform transition-all duration-300 shadow-md shadow-primary/30">
                Chỉnh sửa
              </button>
            </div> */}
          </div>
        </section>

        {/* --- Chương trình thành viên --- */}
        <section className="bg-secondary-bg p-8 rounded-2xl border border-border-color shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
            <FiStar className="text-yellow-400" /> Chương trình thành viên
          </h2>
          <p className="text-text-muted mb-6 text-lg">
            Thông tin hạng thành viên và quyền lợi
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {user.memberLevel}
              </h3>
              <p className="text-yellow-400 font-medium text-lg">
                {user.rewardPoints.toLocaleString()} điểm thưởng
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-5 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-dark-bg transition-all duration-300 font-semibold transform hover:-translate-y-0.5">
                Xem quyền lợi
              </button>
              <button className="px-5 py-2 bg-primary text-dark-bg font-semibold rounded-full hover:bg-black hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-primary/30">
                Nâng hạng
              </button>
            </div>
          </div>
        </section>

        {/* --- Đổi mật khẩu --- */}
        <section className="bg-secondary-bg p-8 rounded-2xl border border-border-color shadow-lg hover:border-primary transition-all duration-300">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-black">
            <FiLock className="text-red-400" /> Đổi mật khẩu
          </h2>
          <p className="text-text-muted mb-6 text-lg">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </p>
          <div className="space-y-4">
            <input
              type="password"
              name="current"
              placeholder="Mật khẩu hiện tại"
              className="w-full p-4 rounded-lg bg-dark-bg border border-border-color text-black focus:border-primary outline-none transition-colors"
              value={password.current}
              onChange={handleChangePassword}
            />
            <input
              type="password"
              name="new"
              placeholder="Mật khẩu mới"
              className="w-full p-4 rounded-lg bg-dark-bg border border-border-color text-black focus:border-primary outline-none transition-colors"
              value={password.new}
              onChange={handleChangePassword}
            />
            <input
              type="password"
              name="confirm"
              placeholder="Xác nhận mật khẩu mới"
              className="w-full p-4 rounded-lg bg-dark-bg border border-border-color text-black focus:border-primary outline-none transition-colors"
              value={password.confirm}
              onChange={handleChangePassword}
            />
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleSavePassword}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-dark-bg font-semibold rounded-full hover:bg-black hover:-translate-y-1 transform transition-all duration-300 text-lg shadow-md shadow-primary/30"
              >
                <FiSave /> Lưu thay đổi
              </button>
              <button
                onClick={handleCancelPasswordChange}
                className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-600 rounded-full hover:bg-gray-700 text-gray-300 font-semibold transition-all duration-300 text-lg hover:-translate-y-1 transform"
              >
                <FiXCircle /> Hủy bỏ
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer nhỏ - Reusing homepage footer styles */}
      <footer
        id="lienhe"
        className="bg-[#0a0a0a] text-gray-300 py-10 px-6 md:px-20 mt-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Cột 1: Giới thiệu */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">EV CHARGE</h3>
            <p className="text-gray-400 leading-relaxed">
              Hệ thống trạm sạc xe điện hàng đầu Việt Nam, cung cấp dịch vụ sạc
              nhanh, an toàn và tiện lợi trên toàn quốc.
            </p>
          </div>

          {/* Cột 2: Hỗ trợ */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#faq"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FiPhoneCall /> Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#report"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FiEdit3 /> Báo cáo sự cố
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FiSettings /> Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FiCreditCard /> Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <p className="text-gray-400 mb-2">Email: support@evcharge.vn</p>
            <p className="text-gray-400 mb-2">Hotline: 1900 1234</p>
            <p className="text-gray-400">
              © 2025 EV CHARGE. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>

        {/* Dòng bản quyền nhỏ ở dưới cùng */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          Thiết kế bởi{" "}
          <span className="text-primary font-medium">EV Charging Team</span>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
