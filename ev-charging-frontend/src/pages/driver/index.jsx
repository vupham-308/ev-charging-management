import React, { useState, useEffect } from "react";
import {
  FiBatteryCharging, // Sạc pin
  FiMapPin, // Bản đồ trạm
  FiCreditCard, // Thanh toán/phiên sạc
  FiZap, // Tốc độ sạc
  FiRefreshCw, // Tùy chọn sạc
  FiSettings, // Quản lý xe
  FiEdit3, // Đặt chỗ
  FiUser, // Hồ sơ người dùng
  FiLogOut, // Đăng xuất
  FiShoppingCart, // Lịch sử đơn hàng (có thể đổi thành Lịch sử giao dịch)
  FiPhoneCall, // Hỗ trợ
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setAccount } from "../../redux/accountSlice";

// --- Custom Hook for Scroll-triggered Animations ---
const useAnimateOnScroll = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

const DriverDashboard = () => {
  useAnimateOnScroll();
  const account = useSelector((store) => store.account); // Redux state, adjust as needed

  // --- START: Authentication State (simulated for this example) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change to true to test logged in state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = {
    fullName: "", // Using 'fullName' to match Redux example
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=2080",
  };
  const dispatch = useDispatch();
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      dispatch(setAccount(parsedUser));
    }
  }, []);
  useEffect(() => {
    // Simulate checking if user is logged in based on Redux or other logic
    if (account && account.id) {
      // Assuming 'account' has an 'id' when logged in
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [account]);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/");
  };
  // --- END: Authentication State ---

  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0); // For the "Tính năng nổi bật" carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const chargingFeatures = [
    {
      name: "Sạc Nhanh DC",
      price: "1,200đ/kWh",
      image:
        "https://anfuenergy.com/wp-content/uploads/2024/06/EV_charging_stations_png-768x768.png",
      description:
        "Công nghệ sạc nhanh tiên tiến, đưa xe của bạn trở lại đường chỉ trong tích tắc.",
      specs: { capacity: "50-180 kW", connectors: "CCS, CHAdeMO" },
    },
    {
      name: "Sạc AC Tiêu Chuẩn",
      price: "800đ/kWh",
      image:
        "https://img.freepik.com/photos-premium/conception-neons-station-charge-voiture-electrique-voiture-ev-dans-concept-vehicule-futuriste-transport-futur-voiture-autonome-futuriste-ai-generative_159242-19719.jpg?w=2000",
      description:
        "Giải pháp sạc tiện lợi cho các điểm dừng dài hơn, lý tưởng cho sạc qua đêm.",
      specs: { capacity: "7-22 kW", connectors: "Type 2" },
    },
    {
      name: "Sạc Thông Minh",
      price: "Giá linh hoạt",
      image:
        "https://img.freepik.com/premium-photo/3d-printed-electric-vehicle-charging-station-modern-futurism-background_962764-133019.jpg?w=996", // Reusing an e-bike image as a placeholder for "smart tech"
      description:
        "Quản lý sạc qua ứng dụng, lên lịch sạc và theo dõi mức tiêu thụ năng lượng.",
      specs: { capacity: "Tùy chọn", connectors: "Mọi loại" },
    },
  ];
  const testimonials = [
    {
      quote:
        "Hệ thống trạm sạc EV Charge thực sự ấn tượng. Tôi luôn tìm thấy trạm gần nhất và tốc độ sạc cực nhanh. Rất khuyến khích!",
      author: "Nguyễn Văn An, Chủ xe VinFast",
      rating: 5,
    },
    {
      quote:
        "Việc quản lý phiên sạc qua ứng dụng rất tiện lợi. Tôi có thể theo dõi tiến độ từ xa và nhận thông báo khi xe đã đầy pin.",
      author: "Trần Thị Bình, Tài xế Tesla",
      rating: 4,
    },
    {
      quote:
        "Tôi đặc biệt thích các ưu đãi dành cho thành viên. Việc sạc xe giờ đây không chỉ nhanh mà còn tiết kiệm hơn rất nhiều.",
      author: "Lê Minh Cường, Chủ xe Hyundai Ioniq 5",
      rating: 5,
    },
  ];

  const nextFeature = () =>
    setCurrentFeature((prev) => (prev + 1) % chargingFeatures.length);
  const prevFeature = () =>
    setCurrentFeature(
      (prev) => (prev - 1 + chargingFeatures.length) % chargingFeatures.length
    );
  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  const sectionClasses = "py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto";

  const location = useLocation();
  const isMainPage =
    location.pathname === "/driver" || location.pathname === "/driver/";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-dark-bg text-text-color font-sans overflow-x-hidden">
      {/* CSS cho Reveal animation */}
      <style>{`.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; } .reveal.is-visible { opacity: 1; transform: translateY(0); }`}</style>

      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-4 z-50 transition-all duration-300 ${
          isHeaderScrolled
            ? "bg-black/90 backdrop-blur-lg border-b border-gray-700"
            : "bg-black border-transparent"
        }`}
      >
        {/* Logo */}
        <div
          className="text-3xl font-bold tracking-widest text-white cursor-pointer"
          onClick={() => navigate("/driver")}
        >
          EV Charge
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex gap-8 items-center text-white font-medium">
          <Link to="map" className="hover:text-primary transition-colors">
            Bản đồ trạm
          </Link>
          <Link
            to="chargingSession"
            className="hover:text-primary transition-colors"
          >
            Phiên Sạc
          </Link>
          <Link to="myCar" className="hover:text-primary transition-colors">
            Xe Của Tôi
          </Link>
          <Link to="booking" className="hover:text-primary transition-colors">
            Đặt Chỗ
          </Link>
          <Link
            to="incidentReport"
            className="hover:text-primary transition-colors"
          >
            Báo cáo sự cố
          </Link>
        </nav>

        {/* --- AUTH SECTION --- */}
        <div className="flex items-center gap-4">
          {account ? (
            <div
              className="text-white relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="hidden sm:inline font-semibold">
                  {account.fullName}
                </span>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] rounded-lg shadow-lg border border-gray-700 py-2">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:text-primary transition"
                  >
                    <FiUser /> Hồ sơ của tôi
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:text-primary transition"
                  >
                    <FiShoppingCart /> Lịch sử đơn hàng
                  </a>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    <FiLogOut /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="font-semibold px-5 py-2 rounded-full bg-transparent text-white border-2 border-primary hover:bg-primary hover:text-black transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="font-semibold px-5 py-2 rounded-full bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </header>
      {isMainPage ? (
        <>
          {/* --- Hero Section --- */}
          <section className="h-screen flex items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-zoom"
                style={{
                  backgroundImage: `url('https://qmerit.com/wp-content/uploads/2023/11/Exploring-the-Advantages-of-Commercial-Electric-Vehicle-Charging-Stations-featured.jpeg')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent"></div>
            </div>
            <div className="z-10 px-4">
              <h1
                className="text-5xl md:text-7xl font-bold mb-4 opacity-0 animate-fade-in-up text-white"
                style={{ animationDelay: "0.2s" }}
              >
                Sạc Tối Ưu, Vạn Dặm An Tâm.
              </h1>{" "}
              {/* CHỈNH CHU: Ngắn gọn, nhấn mạnh tối ưu và an tâm */}
              <p
                className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                Hệ thống trạm sạc thông minh toàn diện, mang đến trải nghiệm sạc
                xe điện đẳng cấp và tiện lợi.
              </p>{" "}
              {/* CHỈNH CHU: Tập trung vào hệ thống thông minh và trải nghiệm đẳng cấp */}
              <button
                onClick={() => navigate("/driver/map")}
                className="bg-primary text-dark-bg font-semibold px-10 py-4 rounded-full hover:bg-white hover:-translate-y-1 transform transition-all duration-300 text-lg shadow-lg shadow-primary/30 opacity-0 animate-fade-in-up"
              >
                Tìm Trạm Gần Nhất
              </button>
              {/* CHỈNH CHU: "Gần Nhất" cụ thể hơn */}
            </div>
            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2 animate-pulse-slow">
                <div className="w-1 h-2 bg-text-muted rounded-full"></div>
              </div>
            </div>
          </section>

          {/* --- Why Choose Us Section (formerly "Why VOLT?") --- */}
          <section className={sectionClasses}>
            <h2 className="text-4xl font-bold text-center mb-16 reveal">
              Vì Sao EV Charge Là Lựa Chọn Hàng Đầu?
            </h2>{" "}
            {/* CHỈNH CHU: Câu hỏi hấp dẫn hơn */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: FiMapPin,
                  title: "Mạng Lưới Rộng Khắp",
                  text: "Dễ dàng tìm kiếm và tiếp cận hàng trăm trạm sạc trên khắp các tỉnh thành Việt Nam.",
                }, // CHỈNH CHU: Nhấn mạnh "dễ dàng" và "khắp các tỉnh thành"
                {
                  icon: FiBatteryCharging,
                  title: "Tốc Độ Sạc Vượt Trội",
                  text: "Trải nghiệm công nghệ sạc nhanh DC và sạc AC tiện lợi, phù hợp cho mọi hành trình.",
                }, // CHỈNH CHU: Nhấn mạnh "trải nghiệm" và "mọi hành trình"
                {
                  icon: FiCreditCard,
                  title: "Thanh Toán Nhanh Gọn",
                  text: "Quy trình thanh toán đơn giản, linh hoạt qua ứng dụng, thẻ ngân hàng hoặc ví điện tử.",
                }, // CHỈNH CHU: Nhấn mạnh "quy trình" và "nhanh gọn"
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-secondary-bg p-8 rounded-2xl text-center border border-border-color hover:border-primary hover:-translate-y-2 transition-all duration-300 group reveal"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-block p-4 bg-dark-bg rounded-full mb-6 border border-border-color group-hover:bg-primary transition-colors duration-300">
                    <feature.icon className="text-4xl text-primary group-hover:text-dark-bg transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* --- Charging Features/Plans Section (formerly "Meet Your Next Ride") --- */}
          <section className={`${sectionClasses} bg-secondary-bg`}>
            <h2 className="text-4xl font-bold text-center mb-16 reveal">
              Khám Phá Các Giải Pháp Sạc Tiên Tiến
            </h2>{" "}
            {/* CHỈNH CHU: Tiêu đề chuyên nghiệp hơn */}
            <div className="relative max-w-6xl mx-auto">
              <div className="overflow-hidden rounded-2xl border border-border-color">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentFeature * 100}%)` }}
                >
                  {chargingFeatures.map((feature, index) => (
                    <div
                      key={feature.name}
                      className="flex-shrink-0 w-full grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-secondary-bg"
                    >
                      <div className="h-80 lg:h-full w-full">
                        <img
                          src={feature.image}
                          alt={feature.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h3 className="text-4xl font-bold mb-4 text-black">
                          {feature.name}
                        </h3>
                        <p className="text-text-muted mb-6 h-20">
                          {feature.description}
                        </p>
                        <div className="flex gap-8 mb-8 border-t border-b border-border-color py-4">
                          <div className="text-center">
                            <FiZap className="text-primary text-2xl mx-auto mb-1" />
                            <span className="font-bold text-lg text-black">
                              {feature.specs.capacity}
                            </span>
                            <p className="text-sm text-text-muted">Công suất</p>
                          </div>
                          <div className="text-center">
                            <FiRefreshCw className="text-primary text-2xl mx-auto mb-1" />
                            <span className="font-bold text-lg text-black">
                              {feature.specs.connectors}
                            </span>
                            <p className="text-sm text-text-muted">Đầu nối</p>
                          </div>
                        </div>
                        <div className="text-4xl font-semibold text-primary mb-6">
                          {feature.price}
                        </div>
                        <button className="bg-transparent text-primary font-semibold px-8 py-3 rounded-full border-2 border-primary hover:bg-primary hover:text-dark-bg transition-colors duration-300">
                          Tìm Trạm Hỗ Trợ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevFeature}
                className="absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 rounded-full bg-dark-bg/50 border border-border-color flex items-center justify-center hover:bg-primary hover:text-dark-bg transition-all backdrop-blur-sm z-10 text-xl"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={nextFeature}
                className="absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 rounded-full bg-dark-bg/50 border border-border-color flex items-center justify-center hover:bg-primary hover:text-dark-bg transition-all backdrop-blur-sm z-10 text-xl"
              >
                <FiChevronRight />
              </button>
            </div>
          </section>

          {/* --- Testimonials Section --- */}
          <section className={sectionClasses}>
            <h2 className="text-4xl font-bold text-center mb-16 reveal">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <div className="relative max-w-3xl mx-auto h-72 reveal">
              <FaQuoteLeft className="absolute top-0 left-0 text-8xl text-border-color/50 -z-10" />
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col justify-center items-center text-center p-4 transition-all duration-500 ease-in-out ${
                    index === currentTestimonial
                      ? "opacity-100 translate-x-0"
                      : "opacity-0"
                  } ${
                    index < currentTestimonial
                      ? "-translate-x-8"
                      : "translate-x-8"
                  }`}
                >
                  <div className="flex gap-1 mb-6 text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl italic text-text-muted mb-6">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-semibold text-lg text-black">
                    - {testimonial.author}
                  </p>
                </div>
              ))}
              <button
                onClick={prevTestimonial}
                className="absolute top-1/2 -translate-y-1/2 -left-12 text-2xl p-2 rounded-full hover:bg-secondary-bg transition-colors text-black"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute top-1/2 -translate-y-1/2 -right-12 text-2xl p-2 rounded-full hover:bg-secondary-bg transition-colors text-black"
              >
                <FiChevronRight />
              </button>
            </div>
          </section>

          {/* --- Call to Action Section (Ưu đãi) --- */}
          <section
            id="uudai"
            className="relative py-28 md:py-36 px-6 text-center overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://ecoswitch.vn/wp-content/uploads/2023_sac.jpg')",
              }}
            >
              {/* Add a stronger gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-dark-bg/80 md:bg-dark-bg/70 from-dark-bg/90 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-16 reveal">
                Ưu Đãi Đặc Biệt Chờ Đón Bạn!
              </h2>{" "}
              {/* CHỈNH CHU: Ngắn gọn và mời gọi hơn */}
              <p
                className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 reveal"
                style={{ transitionDelay: "150ms" }}
              >
                Tham gia cộng đồng EV Charge ngay hôm nay để không bỏ lỡ những
                chương trình khuyến mãi hấp dẫn và quyền lợi thành viên độc
                quyền.
              </p>{" "}
              {/* CHỈNH CHU: Thêm "cộng đồng" và "quyền lợi độc quyền" */}
              <button
                className="bg-primary text-dark-bg font-semibold px-10 py-4 rounded-full hover:bg-black hover:-translate-y-1 transform transition-all duration-300 text-lg shadow-xl shadow-primary/40 reveal"
                style={{ transitionDelay: "300ms" }}
              >
                Đăng Ký Ngay Để Nhận Ưu Đãi
              </button>{" "}
              {/* CHỈNH CHU: Cụ thể hóa hành động và lợi ích */}
            </div>
          </section>
        </>
      ) : (
        // 🔹 Nếu ở /driver/map hoặc /driver/myCar → chỉ hiện nội dung con
        <div style={{ paddingTop: "80px", paddingBottom: "40px" }}>
          <Outlet />
        </div>
      )}
      {/* --- Footer --- */}
      <footer
        id="lienhe"
        className="bg-[#0a0a0a] text-gray-300 py-10 px-6 md:px-20"
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

export default DriverDashboard;
