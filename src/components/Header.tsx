import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHeaderActions } from './HeaderContext';
import { getUserDetails, type UserInfo, updateUserInfo } from '../api/userApi';
import { getAllNotifications, markNotificationAsRead } from '../api/notificationApi';
import { getTaskDetailById } from '../api/taskApi';
import TaskDetailPopup from './TaskDetailPopup'; // Adjust the import path as needed

interface HeaderProps {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean | null;
  createdAt: string | null;
  referenceType: string;
  referenceId: number;
}

interface NotificationResponse {
  code: string;
  message: string;
  data: {
    content: Notification[];
    totalPages: number;
    totalElements: number;
    number: number;
  };
}

interface TaskDetail {
  id: number;
  // Add other task fields based on your API response, e.g., title, description, etc.
  data: any; // Adjust this type based on your task API response
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserDetails();
        setUserInfo(user);
      } catch (error) {}
    };
    fetchData();
    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        throw new Error('No access token found');
      }
      const response: NotificationResponse = await getAllNotifications(token, currentPage, 10);
      setNotifications(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('access_token') || '';
      await markNotificationAsRead(token, notificationId);
      setNotifications(notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate or open popup based on referenceType
    if (notification.referenceType === 'PROJECT' && notification.referenceId) {
      navigate(`/projects/${notification.referenceId}`);
    } else if (notification.referenceType === 'TASK' && notification.referenceId) {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const taskDetail = await getTaskDetailById(token, notification.referenceId);
          setSelectedTask(taskDetail); // Store task detail
          setIsTaskPopupOpen(true); // Open popup
        }
      } catch (error) {
        console.error('Failed to fetch task detail:', error);
        navigate('/taskListPage'); // Fallback
      }
    }

    // Close notification dropdown
    setIsNotificationOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchNotifications();
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle popup close
  const handlePopupClose = () => {
    setIsTaskPopupOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Tiêu đề trang */}
      <div className="flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-lg">
            <span className="text-blue-600 text-xl">🏠</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            className="relative p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
            onClick={async () => {
              setIsNotificationOpen(!isNotificationOpen);
              if (!isNotificationOpen) await fetchNotifications();
            }}
          >
            <svg className="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM4 19v-7a8 8 0 1 1 16 0v7M9 21h6" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19v-7a8 8 0 1 1 16 0v7" />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">Không có thông báo</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-all duration-200 ${
                          !notification.isRead 
                            ? 'border-l-sky-300 bg-sky-50 hover:bg-sky-100' 
                            : 'border-l-transparent bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.createdAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString('vi-VN')}
                              </p>
                            )}
                          </div>
                          {!notification.isRead && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <span className="text-xs text-gray-500">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      Tiếp
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={toggleDropdown}
          >
            {userInfo ? (
              <span className="text-sm font-medium">
                {`${userInfo.firstName?.charAt(0) ?? ''}${userInfo.lastName?.charAt(0) ?? ''}`.toUpperCase()}
              </span>
            ) : (
              <span className="text-sm">?</span>
            )}
          </button>

          {/* User Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={onProfileClick}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Thông tin cá nhân
                </div>
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={onChangePassword}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2M7 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
                  </svg>
                  Đổi mật khẩu
                </div>
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                onClick={onLogout}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Popup */}
      {isTaskPopupOpen && selectedTask && (
        <TaskDetailPopup
          task={selectedTask.data} // Pass the task data
          onClose={handlePopupClose}
          onComplete={() => {
            setIsTaskPopupOpen(false);
            fetchNotifications(); // Refresh notifications after completion
          }}
          onSave={(updatedTask) => {
            setIsTaskPopupOpen(false);
            // Optionally refresh notifications or task list if needed
          }}
          onDelete={() => {
            setIsTaskPopupOpen(false);
            fetchNotifications(); // Refresh notifications after deletion
          }}
        />
      )}
    </div>
  );
};

export default Header;