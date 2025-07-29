import React from 'react';
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
    <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
      <div className="flex items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl transform transition-transform hover:scale-110">🏠</span>
          <span className="text-xl font-bold text-gray-900 tracking-tight">{pageTitle}</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <span className="text-2xl cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors duration-200">🔔</span>
        <div className="relative">
          <div
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full cursor-pointer hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-md"
            onClick={toggleDropdown}
          >
            QM
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-20 animate-fadeIn">
              <div
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2 transition-colors duration-150"
                onClick={onProfileClick}
              >
                Thông tin cá nhân
              </div>
              <div
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2 transition-colors duration-150"
                onClick={onChangePassword}
              >
                Đổi mật khẩu
              </div>
              <div
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md mx-2 transition-colors duration-150"
                onClick={onLogout}
              >
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;