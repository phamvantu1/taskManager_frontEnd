
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useHeaderActions } from './HeaderContext';
import { getUserDetails, type UserInfo, updateUserInfo } from '../api/userApi';


interface HeaderProps {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/dashboard') return 'Tổng quan';
  if (pathname === '/projects') return 'Dự án';
  if (pathname.startsWith('/projects/')) return 'Chi tiết dự án';
  if (pathname === '/taskListPage') return 'Công việc';
  if (pathname === '/department') return 'Phòng ban';
  if (pathname === '/memberlistpage') return 'Người dùng';
  if (pathname === '/report') return 'Báo cáo';
  return 'Trang chủ';
};

const Header: React.FC<HeaderProps> = ({ isDropdownOpen, toggleDropdown }) => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const { onProfileClick, onChangePassword, onLogout } = useHeaderActions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserDetails();
        setUserInfo(user);
      } catch (error) {
      }
    };

    fetchData();
  }, [navigate]);

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
            {userInfo ? (
              `${userInfo.firstName?.charAt(0) ?? ''}${userInfo.lastName?.charAt(0) ?? ''}`.toUpperCase()
            ) : (
              '?'
            )}
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