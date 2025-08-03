import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Profile from '../pages/Profile';
import { getDepartments, type Department } from '../api/departmentApi';
import { getDashboardUserTask, exportDashboardUserTask } from '../api/dashboardApi';
import { toast } from 'react-toastify';

interface ReportData {
  name: string;
  departmentName: string;
  processing: number;
  overdue: number;
  waitCompleted: number;
  completed: number;
  pending: number;
  totalTasks: number;
  plusPoint: number;
  totalPoint: number;
  minusPoint: number;
}

const ReportPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-12-31');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const data = await getDashboardUserTask(
        departmentId,
        search,
        fromDate,
        toDate,
        currentPage,
        pageSize
      );
      setReportData(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error('Không thể tải dữ liệu báo cáo');
      console.error('Error fetching report data:', error);
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

      const response = await getDepartments(token, 0, 100);
      setDepartments(response.content);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Không thể tải danh sách phòng ban');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchReportData();
  }, [currentPage, pageSize, departmentId, search, fromDate, toDate]);

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

  const handleExportExcel = async () => {
    try {
      await exportDashboardUserTask(departmentId, search, fromDate, toDate);
      toast.success('Xuất Excel thành công');
    } catch (error) {
      toast.error('Lỗi khi xuất Excel');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tìm kiếm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={departmentId || ''}
                  onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">Tất cả phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <span className="text-gray-600">→</span>
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  onClick={handleExportExcel}
                >
                  Xuất Excel
                </button>
              </div>

              {loading ? (
                <div className="text-center text-gray-500">
                  <svg className="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                  </svg>
                  <span className="ml-2">Đang tải dữ liệu...</span>
                </div>
              ) : reportData.length === 0 ? (
                <div className="text-center text-gray-500">Không có dữ liệu để hiển thị</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-sm font-semibold text-gray-700">Nhân sự</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Phòng ban</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Chờ xử lý</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Đang thực hiện</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Chờ duyệt hoàn thành</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Hoàn thành</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Quá hạn</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Tổng số công việc</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Điểm cộng</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Điểm trừ</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Tổng điểm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((user, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="p-3 text-sm text-gray-800">{user.name}</td>
                            <td className="p-3 text-sm text-gray-800">{user.departmentName}</td>
                            <td className="p-3 text-sm text-gray-800">{user.pending}</td>
                            <td className="p-3 text-sm text-gray-800">{user.processing}</td>
                            <td className="p-3 text-sm text-gray-800">{user.waitCompleted}</td>
                            <td className="p-3 text-sm text-gray-800">{user.completed}</td>
                            <td className="p-3 text-sm text-gray-800">{user.overdue}</td>
                            <td className="p-3 text-sm text-gray-800">{user.totalTasks}</td>
                            <td className="p-3 text-sm text-gray-800">{user.plusPoint}</td>
                            <td className="p-3 text-sm text-gray-800">{user.minusPoint}</td>
                            <td className="p-3 text-sm text-gray-800">{user.totalPoint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col items-center mt-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Hiển thị {reportData.length === 0 ? 0 : currentPage * pageSize + 1} -{' '}
                      {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements} bản ghi
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        } transition-colors duration-150`}
                      >
                        ««
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        } transition-colors duration-150`}
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
                              className={`px-3 py-1 rounded-lg ${
                                currentPage === i
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } transition-colors duration-150`}
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
                        className={`px-3 py-1 rounded-lg ${
                          currentPage >= totalPages - 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        } transition-colors duration-150`}
                      >
                        ›
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage >= totalPages - 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        } transition-colors duration-150`}
                      >
                        »»
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;