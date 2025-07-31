import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Profile from '../pages/Profile';
import { getDepartments, type Department } from '../api/departmentApi';
import { toast } from 'react-toastify';

interface User {
  id: number;
  fullName: string;
  role: string | null;
}

interface Dashboard {
  admins: User[];
  leaderDepartments: User[];
  projectManagers: User[];
  members: User[];
}

interface ApiResponse {
  code: string;
  message: string;
  data: {
    dashboard: Dashboard;
    totalMembers: number;
    totalPages: number;
    currentPage: number;
  };
}

const roleStyles = {
  Owner: 'bg-purple-100 text-purple-800',
  Admin: 'bg-orange-100 text-orange-800',
  Member: 'bg-teal-100 text-teal-800',
};

const MemberListPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard>({
    admins: [],
    leaderDepartments: [],
    projectManagers: [],
    members: [],
  });
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [departmentId, setDepartmentId] = useState<string>(''); // Changed from unitFilter to departmentId
  const [departments, setDepartments] = useState<Department[]>([]); // Store department list

  const fetchUserDashboard = async (
    page: number = 0,
    size: number = 10,
    searchKeyword: string = '',
    departmentId?: string
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (searchKeyword.trim()) {
        params.append('textSearch', searchKeyword.trim());
      }

      if (departmentId && departmentId !== 'all') {
        params.append('departmentId', departmentId);
      }

      const response = await fetch(
        `http://localhost:8080/api/users/get-user-dashboard?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          toast.error('Phiên đăng nhập hết hạn');
          navigate('/login');
          return;
        }
        throw new Error('Không thể tải dữ liệu');
      }

      const data: ApiResponse = await response.json();

      if (data.code === 'SUCCESS') {
        setDashboard(data.data.dashboard);
        setTotalMembers(data.data.totalMembers);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.currentPage);
      } else {
        toast.error(data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Không thể tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await getDepartments(token, 0, 100); // Fetch all departments (large size)
      setDepartments(response.content);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Không thể tải danh sách phòng ban');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUserDashboard(currentPage, pageSize, keyword, departmentId);
  }, [currentPage, pageSize]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChangePassword = () => {
    console.log('Change password clicked');
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    setShowProfile(true);
    setIsDropdownOpen(false);
  };

  const handleBackToDashboard = () => {
    setShowProfile(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchUserDashboard(0, pageSize, keyword, departmentId);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentId(value);
    setCurrentPage(0);
  };

  const extractEmailFromFullName = (fullName: string) => {
    const match = fullName.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  };

  const extractNameFromFullName = (fullName: string) => {
    return fullName.replace(/\s*\([^)]*\)/, '').trim();
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0];
    return words[0][0] + words[words.length - 1][0];
  };

  const renderUserGroup = (
    title: string,
    users: User[],
    groupRole?: string,
    showPagination: boolean = false
  ) => {
    if (users.length === 0 && !showPagination) return null;

    return (
      <div key={title} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title}{' '}
          <span className="text-sm text-gray-500">
            ({showPagination ? totalMembers : users.length})
          </span>
        </h3>
        {users.length === 0 && showPagination ? (
          <div className="text-center text-gray-500">Không có thành viên nào</div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => {
              const name = extractNameFromFullName(user.fullName);
              const email = extractEmailFromFullName(user.fullName);
              const role = user.role || groupRole || 'Member';

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
                    {getInitials(name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium">
                      {name} - <span className="text-gray-600">{email}</span>
                    </div>
                    <div className="text-sm text-gray-500">Phòng Phát triển phần mềm 2</div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-xl ${
                      roleStyles[role as keyof typeof roleStyles] || roleStyles.Member
                    }`}
                  >
                    {role}
                  </span>
                  
                </div>
              );
            })}
          </div>
        )}
        {showPagination && renderPagination()}
      </div>
    );
  };

  const renderPagination = () => {
    return (
      <div className="flex flex-col items-center mt-6">
        <div className="text-sm text-gray-600 mb-2">
          Hiển thị {totalMembers === 0 ? 0 : Math.min(currentPage * pageSize + 1, totalMembers)} -{' '}
          {Math.min((currentPage + 1) * pageSize, totalMembers)} của {totalMembers} thành viên
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5/trang</option>
            <option value={10}>10/trang</option>
            <option value={20}>20/trang</option>
            <option value={50}>50/trang</option>
          </select>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-all duration-200`}
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-all duration-200`}
            >
              ‹
            </button>
            {(() => {
              const pages = [];
              const maxVisiblePages = 5;
              let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

              if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(0, endPage - maxVisiblePages + 1);
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                      currentPage === i
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-all duration-200`}
                  >
                    {i + 1}
                  </button>
                );
              }
              return pages;
            })()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                currentPage >= totalPages - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-all duration-200`}
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                currentPage >= totalPages - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-all duration-200`}
            >
              »»
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
        {showProfile ? (
          <Profile onBack={handleBackToDashboard} />
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách thành viên</h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Từ khóa (tên hoặc email)"
                  value={keyword}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <select
                  value={departmentId}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tất cả phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </button>
              </div>

              {loading ? (
                <div className="text-center text-gray-500">
                  <svg
                    className="animate-spin h-5 w-5 inline-block"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h-8z"
                    />
                  </svg>
                  <span className="ml-2">Đang tải dữ liệu...</span>
                </div>
              ) : (
                <>
                  {renderUserGroup('Quản trị hệ thống', dashboard.admins, 'Quản trị hệ thống')}
                  {renderUserGroup('Lãnh đạo đơn vị', dashboard.leaderDepartments, 'Lãnh đạo đơn vị')}
                  {renderUserGroup('Quản lý dự án', dashboard.projectManagers, 'Quản lý dự án')}
                  {renderUserGroup('Thành viên', dashboard.members, 'Thành viên', true)}
                  {totalMembers === 0 &&
                    dashboard.admins.length === 0 &&
                    dashboard.leaderDepartments.length === 0 &&
                    dashboard.projectManagers.length === 0 && (
                      <div className="text-center text-gray-500">
                        Không có dữ liệu để hiển thị
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberListPage;