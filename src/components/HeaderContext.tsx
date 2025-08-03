import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface HeaderContextType {
  onProfileClick: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const onProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const onChangePassword = useCallback(() => {
    navigate('/change-password');
  }, [navigate]);

  const onLogout = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Không tìm thấy token, vui lòng đăng nhập lại');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Đăng xuất thất bại');
      }

      localStorage.removeItem('access_token');
      toast.success('Đăng xuất thành công');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Đăng xuất thất bại');
    }
  }, [navigate]);

  return (
    <HeaderContext.Provider value={{ onProfileClick, onChangePassword, onLogout }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderActions = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderActions must be used within a HeaderProvider');
  }
  return context;
};