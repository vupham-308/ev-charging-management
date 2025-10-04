import { createContext, useState } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userEmail: null,
  token: null,
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [token, setToken] = useState(null);

  const doLogin = (userEmail, password) => {
    //1. truyen du lieu back-end
    //2. backend tra lai ket qua
    //3a. Neu dung back-end tra lai email kem' token
    //3b. Neu sai bao loi
    setIsLoggedIn(true);
    setUserEmail(userEmail);
    setToken("Token");
  };

  const doSignUp = (
    userEmail,
    phoneNumber,
    fullName,
    password,
    confirmPassword
  ) => {
    //  validation (email dung format chua, sdt dung vung VN khong, cac field khong duoc bo trong. confirmPass co trung password khong?)
    //  truyen du lieu len back-end
    //  tra lai token
    // Neu dung back-end tra lai email kem' token
    // Neu sai bao loi
    setUserEmail(userEmail);
    setIsLoggedIn(true);
    setToken("Token");
  };

  const doLogout = () => {
    setUserEmail(null);
    setIsLoggedIn(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        doLogin,
        doSignUp,
        doLogout,
        userEmail,
        isLoggedIn,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
