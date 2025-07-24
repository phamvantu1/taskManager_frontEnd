// src/components/Header.tsx
import React from 'react';
import '../style/header.css';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onProfileClick: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/dashboard':
      return 'Tổng quan';
    case '/projects':
      return 'Dự án';
    case '/taskListPage':
      return 'Công việc';
    case '/department':
      return 'Phòng ban';
    case '/memberlistpage':
      return 'Người dùng';
    case '/report':
      return 'Báo cáo';
    default:
      return 'Trang chủ';
  }
};


const Header: React.FC<HeaderProps> = ({
  onProfileClick,
  onChangePassword,
  onLogout,
  isDropdownOpen,
  toggleDropdown,
}) => {

  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="header">
      <div className="header-left">
        
        <div className="header-title">
          <span className="header-icon">🏠</span>
         <span>{pageTitle}</span> {/* HIỂN THỊ TÊN TRANG ĐỘNG */}
        </div>
      </div>
      <div className="header-right">
       
        <div className="user-menu">
          <span className="notification-icon">🔔</span>

          <div className="user-avatar-container">
            <div className="user-avatar cursor-pointer" onClick={toggleDropdown}>
              QM
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={onProfileClick}>Thông tin cá nhân</div>
                <div className="dropdown-item" onClick={onChangePassword}>Đổi mật khẩu</div>
                <div className="dropdown-item" onClick={onLogout}>Đăng xuất</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
