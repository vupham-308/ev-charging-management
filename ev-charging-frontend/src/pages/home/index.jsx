"use client"

import { useState, useEffect } from "react"
import {
  FiBatteryCharging,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
  FiUser,
  FiLogOut,
  FiActivity,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi"
import { FaStar, FaQuoteLeft } from "react-icons/fa"

// --- Custom Hook for Scroll-triggered Animations ---
const useAnimateOnScroll = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".reveal")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

const EVChargingManagement = () => {
  useAnimateOnScroll()

  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const user = {
    name: "Quản Trị Viên",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=2080",
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsDropdownOpen(false)
  }

  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)
  const [currentStation, setCurrentStation] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const stations = [
    {
      name: "Trạm Trung Tâm Thành Phố",
      location: "Đường Chính, Trung Tâm Thành Phố",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2062",
      description: "Trạm sạc hàng đầu của chúng tôi với 12 bộ sạc siêu nhanh ngay tại trung tâm thành phố.",
      specs: { chargers: "12 cổng", power: "350 kW", status: "Hoạt động" },
    },
    {
      name: "Trạm Nghỉ Cao Tốc",
      location: "Cao Tốc 95, Cột Mốc 47",
      image: "https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&q=80&w=2062",
      description: "Vị trí chiến lược cho khách hàng di chuyển đường dài với 8 cổng sạc tốc độ cao.",
      specs: { chargers: "8 cổng", power: "250 kW", status: "Hoạt động" },
    },
    {
      name: "Trung Tâm Thương Mại",
      location: "Westfield Plaza, Tầng Đỗ Xe 2",
      image: "https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?auto=format&fit=crop&q=80&w=2062",
      description: "Sạc xe tiện lợi trong khi mua sắm, với 6 bộ sạc tiêu chuẩn và nhanh.",
      specs: { chargers: "6 cổng", power: "150 kW", status: "Hoạt động" },
    },
  ]

  const testimonials = [
    {
      quote:
        "Hệ thống quản lý đã thay đổi hoàn toàn cách chúng tôi vận hành mạng lưới sạc. Giám sát thời gian thực và phân tích đã tăng hiệu quả của chúng tôi lên 40%.",
      author: "Trần Minh Khoa, Quản Lý Mạng Lưới",
      rating: 5,
    },
    {
      quote:
        "Nền tảng xuất sắc! Bảng điều khiển trực quan giúp dễ dàng theo dõi mức sử dụng, quản lý bảo trì và tối ưu hóa hiệu suất trạm sạc.",
      author: "Nguyễn Thu Hương, Giám Đốc Vận Hành",
      rating: 5,
    },
    {
      quote:
        "Đầu tư tốt nhất mà chúng tôi từng thực hiện. Hệ thống tự hoàn vốn nhờ cải thiện thời gian hoạt động và phân bổ tài nguyên tốt hơn trên hơn 50 trạm của chúng tôi.",
      author: "Lê Văn Đức, Quản Lý Đội Xe",
      rating: 5,
    },
  ]

  const nextStation = () => setCurrentStation((prev) => (prev + 1) % stations.length)
  const prevStation = () => setCurrentStation((prev) => (prev - 1 + stations.length) % stations.length)
  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const sectionClasses = "py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto"

  return (
    <div className="bg-dark-bg text-text-color font-sans overflow-x-hidden">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; } 
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        
        /* Added custom color variables for EV charging theme */
        :root {
          --dark-bg: #0a0e1a;
          --secondary-bg: #141824;
          --primary: #3b82f6;
          --primary-hover: #60a5fa;
          --text-color: #ffffff;
          --text-muted: #94a3b8;
          --border-color: #1e293b;
        }
        
        .bg-dark-bg { background-color: var(--dark-bg); }
        .bg-secondary-bg { background-color: var(--secondary-bg); }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        .hover\\:bg-primary:hover { background-color: var(--primary); }
        .hover\\:text-primary:hover { color: var(--primary); }
        .hover\\:border-primary:hover { border-color: var(--primary); }
        .text-text-color { color: var(--text-color); }
        .text-text-muted { color: var(--text-muted); }
        .border-border-color { border-color: var(--border-color); }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        
        @keyframes background-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-background-zoom { animation: background-zoom 20s ease-in-out infinite alternate; }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
      `}</style>

      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-4 z-50 transition-all duration-300 ${isHeaderScrolled ? "bg-dark-bg/90 backdrop-blur-lg border-b border-border-color" : "bg-transparent border-transparent"}`}
      >
        <div className="text-3xl font-bold tracking-widest cursor-pointer">SẠC XE ĐIỆN</div>

        <nav className="hidden md:flex gap-8 items-center">
          <a href="#dashboard" className="text-white hover:text-primary transition-colors">
            Bảng Điều Khiển
          </a>
          <a href="#stations" className="text-white hover:text-primary transition-colors">
            Trạm Sạc
          </a>
          <a href="#analytics" className="text-white hover:text-primary transition-colors">
            Phân Tích
          </a>
          <a href="#contact" className="text-white hover:text-primary transition-colors">
            Liên Hệ
          </a>
        </nav>

        {/* --- DYNAMIC AUTH SECTION --- */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div
              className="text-white relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="hidden sm:inline font-semibold">{user.name}</span>
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt="Ảnh Đại Diện"
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-secondary-bg rounded-lg shadow-lg border border-border-color py-2 animate-fade-in-up animation-delay-0">
                  <a
                    href="#"
                    className="text-white flex items-center gap-3 px-4 py-2 text-sm text-text-color hover:bg-dark-bg transition-colors"
                  >
                    <FiUser /> Hồ Sơ Của Tôi
                  </a>
                  <a
                    href="#"
                    className="text-white flex items-center gap-3 px-4 py-2 text-sm text-text-color hover:bg-dark-bg transition-colors"
                  >
                    <FiSettings /> Cài Đặt
                  </a>
                  <div className="border-t border-border-color my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-dark-bg transition-colors"
                  >
                    <FiLogOut /> Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-white flex items-center gap-4">
              <a href="/login">
                <button className="font-semibold px-5 py-2 rounded-full bg-transparent border border-border-color text-text-muted hover:border-primary hover:text-primary transition-all duration-300">
                  Đăng Nhập
                </button>
              </a>
              <a href="/register">
                <button className="text-white font-semibold px-5 py-2 rounded-full bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5">
                  Đăng Ký
                </button>
              </a>
            </div>
          )}
        </div>
      </header>

      <section className="h-screen flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-background-zoom"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2062')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent"></div>
        </div>
        <div className="z-10 px-4">
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Nguồn Năng Lượng Tương Lai.
          </h1>
          <p
            className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            Quản lý trạm sạc xe điện toàn diện. Giám sát, phân tích và tối ưu hóa toàn bộ mạng lưới của bạn từ một nền tảng mạnh mẽ.
          </p>
          <button
            className="bg-primary text-white font-semibold px-10 py-4 rounded-full hover:bg-white hover:text-primary hover:-translate-y-1 transform transition-all duration-300 text-lg shadow-lg shadow-primary/30 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            Xem Bảng Điều Khiển
          </button>
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

      <section id="dashboard" className={sectionClasses}>
        <h2 className="text-4xl font-bold text-center mb-16 reveal">Tại Sao Chọn Nền Tảng Của Chúng Tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: FiActivity,
              title: "Giám Sát Thời Gian Thực",
              text: "Theo dõi trạng thái trạm, phiên sạc và mức tiêu thụ năng lượng trên toàn bộ mạng lưới của bạn theo thời gian thực.",
            },
            {
              icon: FiBarChart2,
              title: "Phân Tích Nâng Cao",
              text: "Có được cái nhìn sâu sắc với các báo cáo toàn diện, mẫu sử dụng và phân tích doanh thu để tối ưu hóa hoạt động.",
            },
            {
              icon: FiZap,
              title: "Cảnh Báo Thông Minh",
              text: "Nhận thông báo ngay lập tức về nhu cầu bảo trì, sự cố và vấn đề hiệu suất để tối đa hóa thời gian hoạt động.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-secondary-bg p-8 rounded-2xl text-center border border-border-color hover:border-primary hover:-translate-y-2 transition-all duration-300 group reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-block p-4 bg-dark-bg rounded-full mb-6 border border-border-color group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stations" className={`${sectionClasses} bg-secondary-bg`}>
        <h2 className="text-4xl font-bold text-center mb-16 reveal">Mạng Lưới Sạc Của Chúng Tôi</h2>
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentStation * 100}%)` }}
            >
              {stations.map((station) => (
                <div
                  key={station.name}
                  className="flex-shrink-0 w-full grid grid-cols-1 lg:grid-cols-2 gap-0 items-center"
                >
                  <div className="h-80 lg:h-full w-full">
                    <img
                      src={station.image || "/placeholder.svg"}
                      alt={station.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-12 bg-secondary-bg">
                    <h3 className="text-4xl font-bold mb-4">{station.name}</h3>
                    <p className="text-text-muted mb-2 flex items-center gap-2">
                      <FiMapPin className="text-primary" />
                      {station.location}
                    </p>
                    <p className="text-text-muted mb-6 h-20">{station.description}</p>
                    <div className="flex gap-8 mb-8 border-t border-b border-border-color py-4">
                      <div className="text-center">
                        <FiBatteryCharging className="text-primary text-2xl mx-auto mb-1" />
                        <span className="font-bold text-lg">{station.specs.chargers}</span>
                        <p className="text-sm text-text-muted">Bộ Sạc</p>
                      </div>
                      <div className="text-center">
                        <FiZap className="text-primary text-2xl mx-auto mb-1" />
                        <span className="font-bold text-lg">{station.specs.power}</span>
                        <p className="text-sm text-text-muted">Công Suất Tối Đa</p>
                      </div>
                      <div className="text-center">
                        <FiActivity className="text-primary text-2xl mx-auto mb-1" />
                        <span className="font-bold text-lg">{station.specs.status}</span>
                        <p className="text-sm text-text-muted">Trạng Thái</p>
                      </div>
                    </div>
                    <button className="bg-transparent text-primary font-semibold px-8 py-3 rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-300">
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevStation}
            className="absolute top-1/2 -translate-y-1/2 -left-6 w-12 h-12 rounded-full bg-dark-bg/50 border border-border-color flex items-center justify-center hover:bg-primary hover:text-white transition-all backdrop-blur-sm z-10"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={nextStation}
            className="absolute top-1/2 -translate-y-1/2 -right-6 w-12 h-12 rounded-full bg-dark-bg/50 border border-border-color flex items-center justify-center hover:bg-primary hover:text-white transition-all backdrop-blur-sm z-10"
          >
            <FiChevronRight />
          </button>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="analytics" className={sectionClasses}>
        <h2 className="text-4xl font-bold text-center mb-16 reveal">Được Tin Tưởng Bởi Các Nhà Lãnh Đạo Ngành</h2>
        <div className="relative max-w-3xl mx-auto h-72 reveal">
          <FaQuoteLeft className="absolute top-0 left-0 text-8xl text-border-color/50 -z-10" />
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col justify-center items-center text-center p-4 transition-all duration-500 ease-in-out ${index === currentTestimonial ? "opacity-100 translate-x-0" : "opacity-0"} ${index < currentTestimonial ? "-translate-x-8" : "translate-x-8"}`}
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-xl md:text-2xl italic text-text-muted mb-6">"{testimonial.quote}"</p>
              <p className="font-semibold text-lg">- {testimonial.author}</p>
            </div>
          ))}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -translate-y-1/2 -left-12 text-2xl p-2 rounded-full hover:bg-secondary-bg transition-colors"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -translate-y-1/2 -right-12 text-2xl p-2 rounded-full hover:bg-secondary-bg transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>
      </section>

      <section className="relative py-28 px-6 text-center bg-secondary-bg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&q=80&w=2670')",
          }}
        ></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 reveal">Sẵn Sàng Tối Ưu Hóa Mạng Lưới Của Bạn?</h2>
          <p className="text-xl text-text-muted mb-8 reveal" style={{ transitionDelay: "100ms" }}>
            Bắt đầu quản lý trạm sạc xe điện của bạn hiệu quả hơn ngay hôm nay với nền tảng toàn diện của chúng tôi.
          </p>
          <button
            className="bg-primary text-white font-semibold px-10 py-4 rounded-full hover:bg-white hover:text-primary hover:-translate-y-1 transform transition-all duration-300 text-lg shadow-lg shadow-primary/30 reveal"
            style={{ transitionDelay: "200ms" }}
          >
            Yêu Cầu Demo
          </button>
        </div>
      </section>

      <footer id="contact" className="bg-dark-bg text-text-muted py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-2">SẠC XE ĐIỆN</h3>
            <p className="max-w-xs">Cung cấp năng lượng cho tương lai của di động điện với các giải pháp sạc thông minh.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Nền Tảng</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Bảng Điều Khiển
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Phân Tích
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Trạm Sạc
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Báo Cáo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Công Ty</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Tuyển Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Đối Tác
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Theo Dõi Chúng Tôi</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-color text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Hệ Thống Quản Lý Sạc Xe Điện. Tất Cả Các Quyền Được Bảo Lưu.</p>
        </div>
      </footer>
    </div>
  )
}

export default EVChargingManagement
