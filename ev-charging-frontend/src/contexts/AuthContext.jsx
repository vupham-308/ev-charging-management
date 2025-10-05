import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // Giả sử bạn có một API để xác thực token và lấy thông tin người dùng
      // fetchUserInfo(savedToken).then(userInfo => {
      //   setUser(userInfo);
      //   setToken(savedToken);
      // });
      // Ở đây ta giả lập: nếu có token là user đã đăng nhập
      setUser({ email: localStorage.getItem("userEmail") });
      setToken(savedToken);
    }
    setIsLoading(false); 
  }, []);

  const doLogin = async (email, password) => {
    console.log("Đang đăng nhập với:", email, password);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@test.com" && password === "123456") {
        const fakeToken = "fake-jwt-token-" + Math.random();
        const userInfo = { email: email };

        localStorage.setItem("token", fakeToken);
        localStorage.setItem("userEmail", email);

        setToken(fakeToken);
        setUser(userInfo);

        navigate("/dashboard");
        return { success: true };
      } else {
        throw new Error("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, message: error.message };
    }
  };

// const doLogin = async (email, password) => {
//     try {
//       const response = await fetch("http://localhost:8080/api/account/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const data = await response.json(); 

//         const receivedToken = data.token; 
//         const userInfo = { email: data.email };

//         if (!receivedToken) {
//           throw new Error("API không trả về token!");
//         }

//         localStorage.setItem("token", receivedToken);
//         localStorage.setItem("userEmail", userInfo.email);

//         setToken(receivedToken);
//         setUser(userInfo);

//         message.success("Đăng nhập thành công!");
//         navigate("/dashboard");
//         return { success: true };

//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Email hoặc mật khẩu không đúng!");
//       }
//     } catch (error) {
//       console.error("Lỗi đăng nhập:", error);
//       return { success: false, message: error.message };
//     }
//   };

  // Hàm đăng xuất
  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    // Reset state
    setToken(null);
    setUser(null);

    navigate("/login");
  };

  const contextValue = {
    isLoggedIn: !!token, 
    token,
    user,
    isLoading,
    doLogin,
    doLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;