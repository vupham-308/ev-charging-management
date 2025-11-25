// components/AuthPageWrapper.js
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AuthPageWrapper = ({ children }) => {
  const { getUser, logout } = useAuth();

  useEffect(() => {
    const user = getUser();
    if (user) {
      console.log('Auto logout: User accessed auth page while logged in');
      logout();
      toast.info('🔄 Đã đăng xuất tài khoản hiện tại để đảm bảo bảo mật');
    }
  }, [getUser, logout]);

  return <>{children}</>;
};

export default AuthPageWrapper;