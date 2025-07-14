// src/components/Header.tsx
import React from 'react';
import '../style/header.css';

interface HeaderProps {
  onProfileClick: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onProfileClick,
  onChangePassword,
  onLogout,
  isDropdownOpen,
  toggleDropdown,
}) => {
  return (
    <div className="header">
      <div className="header-left">
        <button className="back-button">‹</button>
        <div className="header-title">
          <span className="header-icon">🏠</span>
          <span>Trang chủ</span>
        </div>
      </div>
      <div className="header-right">
        <div className="search-container">
          <input type="text" placeholder="Tìm kiếm" className="search-input" />
          <span className="search-icon">🔍</span>
        </div>
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
