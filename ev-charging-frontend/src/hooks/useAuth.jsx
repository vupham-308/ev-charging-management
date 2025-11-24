import { useDispatch } from 'react-redux';
import { clearAccount } from '../redux/accountSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem('user');
    dispatch(clearAccount());
  };

  const getUser = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      logout();
      return null;
    }
  };

  const isAuthorized = (requiredRole = null) => {
    const user = getUser();
    
    if (!user) return false;
    if (!requiredRole) return true;
    
    return user.role === requiredRole;
  };

  return { getUser, isAuthorized, logout };
};