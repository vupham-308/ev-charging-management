import React, { useState, useEffect, useRef } from "react";
import {
  FiBatteryCharging,
  FiMapPin,
  FiCreditCard,
  FiZap,
  FiRefreshCw,
  FiSettings,
  FiEdit3,
  FiUser,
  FiLogOut,
  FiShoppingCart,
  FiPhoneCall,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaStar,
  FaQuoteLeft,
  FaBolt,
  FaLeaf,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

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

const EVChargeHomePage = () => {
  useAnimateOnScroll();
  const account = useSelector((store) => store.account);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = {
    fullName: "",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=2080",
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (account && account.id) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [account]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionClasses = "py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto";
  const location = useLocation();
  const isMainPage = location.pathname === "/" || location.pathname === "//";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  // --- FAQ STATE ---
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      category: "🔋 Về dịch vụ sạc xe điện",
      questions: [
        {
          q: "Hệ thống hỗ trợ sạc cho xe điện hãng nào?",
          a: "Hệ thống hiện hỗ trợ sạc xe cho Vinfast, Hyundai, Nissan.",
        },
        {
          q: "Hệ thống hỗ trợ những loại cổng sạc nào?",
          a: "Hệ thống hiện hỗ trợ các chuẩn sạc phổ biến gồm AC cho xe Vinfast, CHAdeMo cho xe Nissan, CCS cho xe Hyundai.",
        },
        {
          q: "Có thể sạc xe ở trạm khác hãng không?",
          a: "Không, hiện tại chúng tôi chỉ hỗ trợ sạc xe cho Vinfast, Hyundai, Nissan.",
        },
        {
          q: "Mất bao lâu để sạc đầy pin từ 1%?",
          a: "• Sạc AC (22kW): khoảng 3-4h\n• Sạc CHAdeMo (75kW): 60-90 phút\n• Sạc CCS (120kW): khoảng 40 phút\n\nỨng dụng sẽ hiển thị thời gian dự kiến trước khi bạn bắt đầu.",
        },
      ],
    },
    {
      category: "💳 Thanh toán và ví điện tử",
      questions: [
        {
          q: "Tôi có thể thanh toán bằng hình thức nào?",
          a: "Hệ thống hỗ trợ VNPay để nạp tiền vào ví để thanh toán tự động. Bạn cũng có thể chọn Thanh toán tiền mặt trực tiếp với nhân viên trạm sạc.",
        },
        {
          q: "Tôi có thể yêu cầu hoàn tiền không?",
          a: "Nếu giao dịch bị lỗi hoặc không bắt đầu phiên sạc, bạn có thể gửi yêu cầu hoàn tiền qua email của chúng tôi evcharginginfo@gmail.com",
        },
        {
          q: "Nếu tôi bị dừng sạc giữa chừng, tôi bị trừ tiền như thế nào?",
          a: "Bạn chỉ bị trừ phí tương ứng với thời gian sạc thực tế, tính đến thời điểm kết thúc phiên sạc.",
        },
      ],
    },
    {
      category: "📅 Đặt chỗ và sử dụng trạm",
      questions: [
        {
          q: "Tôi có thể đặt trước trạm sạc không?",
          a: "Có. Bạn có thể đặt trước trước khi đến. Bạn sẽ được giữ chỗ 30 phút kể từ thời gian đặt. Đến thời gian đặt, hệ thống sẽ tự giữ chỗ cho bạn nếu trạm sạc còn trống. Nếu trạm sạc đang có người sạc trước khung giờ bạn đặt và sạc lấn sang khung giờ đặt trước của bạn, vui lòng chờ người phía trước bạn sạc xong. Hệ thống sẽ tự giữ chỗ ngay sau khi khách hàng phía trước của bạn sạc xong.",
        },
        {
          q: "Nếu tôi đến sớm hơn giờ đặt, có được sạc ngay không?",
          a: "Có thể — nếu trạm đang trống. Hệ thống sẽ xác nhận lại tình trạng đặt chỗ của bạn, vui lòng hủy đặt chỗ trước đó mà bắt đầu sạc như bình thường.",
        },
      ],
    },
    {
      category: "👤 Tài khoản và bảo mật",
      questions: [
        {
          q: "Tôi quên mật khẩu, làm sao để khôi phục?",
          a: 'Nhấn vào "Quên mật khẩu?" tại trang đăng nhập và nhập email đăng ký. Hệ thống sẽ gửi OTP để bạn đặt lại mật khẩu mới.',
        },
      ],
    },
    {
      category: "📖 Hướng dẫn sử dụng nhanh",
      questions: [
        {
          q: "Các bước để bắt đầu sạc xe là gì?",
          a: "1. Đăng nhập vào hệ thống (bắt buộc)\n2. Chọn Bản đồ trạm và chọn trạm bạn muốn trên bản đồ\n3. Nhấn Bắt đầu sạc\n4. Điền thông tin xe, trụ sạc, mục tiêu pin và phương thức thanh toán\n5. Nhấn 'Tiếp tục', kiểm tra lại thông tin phiên sạc\n6. Nếu chọn thanh toán tiền mặt, vui lòng giữ nguyên màn hình và liên hệ với nhân viên trạm sạc\n7. Nhấn xác nhận để bắt đầu phiên sạc",
        },
        {
          q: "Các bước để có thể đặt trước?",
          a: "1. Đăng nhập vào hệ thống (bắt buộc)\n2. Chọn Bản đồ trạm và chọn trạm bạn muốn\n3. Nhấn Đặt chỗ\n4. Điền thông tin trụ sạc, ngày, giờ mong muốn\n5. Nhấn xác nhận\n6. Kiểm tra lại phiên đặt chỗ tại mục Đặt chỗ\n7. Đến đúng thời gian đã đặt và Sạc ngay!",
        },
        {
          q: "Các bước để nạp tiền vào ví",
          a: "1. Đăng nhập vào hệ thống (bắt buộc)\n2. Nhấn vào biểu tượng hồ sơ (góc trái phía trên)\n3. Chọn Lịch sử giao dịch\n4. Nhấn Nạp tiền\n5. Chọn số tiền nạp mong muốn (tối thiểu 20.000VND)\n6. Chọn phương thức thanh toán\n7. Nhấn Nạp tiền\n8. Thanh toán và kiểm tra lại số dư của bạn tại Lịch sử giao dịch",
        },
      ],
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white font-sans overflow-x-hidden">
      {/* CSS Animations */}
      <style>{`
        .reveal { 
          opacity: 0; 
          transform: translateY(30px); 
          transition: opacity 0.8s ease-out, transform 0.8s ease-out; 
        } 
        .reveal.is-visible { 
          opacity: 1; 
          transform: translateY(0); 
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes background-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-background-zoom {
          animation: background-zoom 20s ease-in-out infinite alternate;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .charging-glow {
          box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }
        
        .charging-glow:hover {
          box-shadow: 0 0 50px rgba(102, 126, 234, 0.6);
          transform: translateY(-5px);
        }
      `}</style>

      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-4 z-50 transition-all duration-300 ${
          isHeaderScrolled
            ? "bg-black/90 backdrop-blur-lg border-b border-purple-500/30"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="text-3xl font-bold tracking-widest text-white cursor-pointer flex items-center gap-2">
          <FiBatteryCharging className="text-purple-500" />
          <span className="gradient-text">EV Charge</span>
        </div>

        <nav className="hidden md:flex gap-8 items-center text-white font-medium">
          <Link to="map" className="hover:text-purple-400 transition-colors">
            Bản đồ trạm
          </Link>
          <a href="login" className="hover:text-purple-400 transition-colors">
            Phiên Sạc
          </a>
          <Link to="login" className="hover:text-purple-400 transition-colors">
            Xe Của Tôi
          </Link>
          <Link to="login" className="hover:text-purple-400 transition-colors">
            Đặt Chỗ
          </Link>
          <Link to="login" className="hover:text-purple-400 transition-colors">
            Báo cáo sự cố
          </Link>
        </nav>

        {/* --- AUTH SECTION --- */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 cursor-pointer focus:outline-none"
              >
                <span className="hidden sm:inline font-semibold text-white">
                  {account.fullName || "User"}
                </span>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-purple-500/30 py-2 z-20"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-md transition"
                    >
                      <FiUser /> Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-md transition"
                    >
                      <FiShoppingCart /> Lịch sử đơn hàng
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors duration-300 hover:bg-red-500/10 rounded-md"
                    >
                      <FiLogOut /> Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="font-semibold px-5 py-2 rounded-full bg-transparent text-white border-2 border-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="font-semibold px-5 py-2 rounded-full bg-purple-600 text-white border-2 border-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
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
          <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-zoom"
                style={{
                  backgroundImage: `url('https://qmerit.com/wp-content/uploads/2023/11/Exploring-the-Advantages-of-Commercial-Electric-Vehicle-Charging-Stations-featured.jpeg')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/50 to-black"></div>
            </div>

            <div className="z-10 px-4 max-w-5xl mx-auto">
              <div className="animate-float mb-8">
                <FiBatteryCharging className="text-8xl text-purple-400 mx-auto mb-6" />
              </div>

              <h1
                className="text-5xl md:text-7xl font-bold mb-6 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="gradient-text">Sạc Xe Điện Thông Minh</span>
              </h1>

              <p
                className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                Trải nghiệm công nghệ sạc xe điện tiên tiến nhất Việt Nam. Nhanh
                chóng, an toàn và tiện lợi.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <Link
                  to="map"
                  className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex items-center gap-2"
                >
                  <FiMapPin /> Tìm Trạm Sạc
                </Link>
                <a
                  href="#faq"
                  className="bg-transparent text-white font-semibold px-8 py-4 rounded-full border-2 border-purple-500 hover:bg-purple-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Câu Hỏi Thường Gặp
                </a>
              </div>
            </div>
          </section>
          {/* --- Why Choose Us Section --- */}
          <section
            className={`${sectionClasses} bg-gradient-to-b from-black to-gray-900`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text reveal">
              Vì Sao Chọn EV Charge?
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto reveal">
              Chúng tôi mang đến giải pháp sạc xe điện toàn diện với công nghệ
              hiện đại nhất
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: FaBolt,
                  title: "Sạc Siêu Nhanh",
                  text: "Công nghệ sạc siêu nhanh chỉ trong 30 phút. Tiết kiệm thời gian tối đa.",
                  color: "from-yellow-400 to-orange-500",
                },
                {
                  icon: FaLeaf,
                  title: "Thân Thiện Môi Trường",
                  text: "Sử dụng xe điện góp phần bảo vệ môi trường và giảm khí thải carbon.",
                  color: "from-green-400 to-emerald-500",
                },
                {
                  icon: FaClock,
                  title: "Hoạt Động 24/7",
                  text: "Mạng lưới trạm sạc hoạt động liên tục, sẵn sàng phục vụ bạn mọi lúc mọi nơi.",
                  color: "from-blue-400 to-cyan-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="charging-glow bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-center border border-purple-500/30 group reveal"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`inline-block p-4 bg-gradient-to-br ${feature.color} rounded-full mb-6`}
                  >
                    <feature.icon className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
          {/* --- FAQ SECTION --- */}
          <section
            id="faq"
            className={`${sectionClasses} bg-gradient-to-b from-gray-900 to-black`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text reveal">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto reveal">
              Tìm câu trả lời cho những thắc mắc phổ biến về dịch vụ sạc xe điện
              của chúng tôi
            </p>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqData.map((category, catIndex) => (
                <div key={catIndex} className="reveal">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.questions.map((item, qIndex) => {
                      const globalIndex = `${catIndex}-${qIndex}`;
                      return (
                        <div
                          key={qIndex}
                          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-purple-500/30 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full flex justify-between items-center p-5 text-left hover:bg-purple-500/10 transition-colors"
                          >
                            <span className="text-white font-semibold pr-4">
                              {item.q}
                            </span>
                            {openFAQ === globalIndex ? (
                              <FiChevronUp className="text-purple-400 text-xl flex-shrink-0" />
                            ) : (
                              <FiChevronDown className="text-purple-400 text-xl flex-shrink-0" />
                            )}
                          </button>

                          {openFAQ === globalIndex && (
                            <div className="px-5 pb-5 text-gray-300 leading-relaxed border-t border-purple-500/20 pt-4">
                              {item.a.split("\n").map((line, i) => (
                                <p key={i} className="mb-2">
                                  {line}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="mt-16 text-center bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-purple-500/30 max-w-2xl mx-auto reveal">
              <FiPhoneCall className="text-5xl text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Vẫn cần hỗ trợ?
              </h3>
              <p className="text-gray-400 mb-6">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1">
                  📧 Email: evcharginginfo@gmail.com
                </a>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div style={{ paddingTop: "80px", paddingBottom: "40px" }}>
          <Outlet />
        </div>
      )}

      {/* --- Footer --- */}
      <footer
        id="lienhe"
        className="bg-black text-gray-300 py-10 px-6 md:px-20 border-t border-purple-500/30"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-3 flex items-center gap-2">
              <FiBatteryCharging /> EV CHARGE
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Hệ thống trạm sạc xe điện hàng đầu Việt Nam, cung cấp dịch vụ sạc
              nhanh, an toàn và tiện lợi trên toàn quốc.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#faq"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <FiPhoneCall /> Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#report"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <FiEdit3 /> Báo cáo sự cố
                </a>
              </li>

              <li>
                <Link
                  to="termsOfUse"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <FiCreditCard /> Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <p className="text-gray-400 mb-2">
              Email: evcharginginfo@gmail.com
            </p>
            <p className="text-gray-400">
              © 2025 EV CHARGE. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>

        <div className="border-t border-purple-500/30 mt-10 pt-6 text-center text-sm text-gray-500">
          Thiết kế bởi{" "}
          <span className="text-purple-400 font-medium">EV Charging Team</span>
        </div>
      </footer>
    </div>
  );
};

export default EVChargeHomePage;
