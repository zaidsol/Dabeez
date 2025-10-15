// hooks/useAuth.js - ADD logout function
import { useState, useEffect } from 'react';
import { isAdmin, logout as authLogout } from '../lib/auth';

export const useAuth = () => {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAdminUser(false);
      setLoading(true);
      
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ADD: Logout function
  const logout = () => {
    authLogout();
    setIsAdminUser(false);
    alert('✅ Admin logged out successfully!'); // Alert message
  };

  return { isAdmin: isAdminUser, loading, logout }; // ADD: Return logout
};