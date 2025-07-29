import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderContextType {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  onProfileClick: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const onProfileClick = () => {
    setShowProfile(true);
    setIsDropdownOpen(false);
  };
  const onChangePassword = () => setIsDropdownOpen(false);
  const onLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <HeaderContext.Provider
      value={{
        isDropdownOpen,
        toggleDropdown,
        onProfileClick,
        onChangePassword,
        onLogout,
        showProfile,
        setShowProfile,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};