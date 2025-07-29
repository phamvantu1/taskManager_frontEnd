import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Profile from '../pages/Profile';

interface ReportData {
  name: string;
  department: string;
  doing: number;
  overdue: number;
  pending: number;
  doneOnTime: number;
  doneLate: number;
  total: number;
  avgScore: number;
  evalPoint: number;
  minusPoint: number;
}

const reportData: ReportData[] = [
  {
    name: 'Vũ Đức Việt',
    department: 'Phòng Phát triển phần mềm 2',
    doing: 0,
    overdue: 0,
    pending: 0,
    doneOnTime: 0,
    doneLate: 0,
    total: 0,
    avgScore: 0,
    evalPoint: 0,
    minusPoint: 0,
  },
  {
    name: 'Nguyễn Hồng Nhung',
    department: 'Phòng Phát triển phần mềm 2',
    doing: 0,
    overdue: 0,
    pending: 0,
    doneOnTime: 0,
    doneLate: 0,
    total: 0,
    avgScore: 0,
    evalPoint: 0,
    minusPoint: 0,
  },
  // Thêm các dòng dữ liệu khác ở đây...
];

const ReportPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2025-07-31');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages] = useState(Math.ceil(reportData.length / 10)); // Dynamic based on data
  const [loading] = useState(false); // Placeholder for future API integration

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

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log('Export Excel clicked');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredData = reportData
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (department === '' || user.department === department)
    )
    .slice(currentPage * pageSize, (currentPage + 1) * pageSize);

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
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📊</span> Báo cáo
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Báo cáo theo thành viên</option>
                </select>
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tìm kiếm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Phòng ban</option>
                  <option value="Phòng Phát triển phần mềm 2">Phòng Phát triển phần mềm 2</option>
                  <option value="Tổ QC">Tổ QC</option>
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
              ) : filteredData.length === 0 ? (
                <div className="text-center text-gray-500">Không có dữ liệu để hiển thị</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-sm font-semibold text-gray-700">Nhân sự</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Phòng ban</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Đang thực hiện</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Quá hạn</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Chờ duyệt hoàn thành</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Hoàn thành đúng hạn</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Hoàn thành không đúng hạn</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Tổng số công việc</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Điểm công việc trung bình</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Điểm cộng đánh giá</th>
                          <th className="p-3 text-sm font-semibold text-gray-700">Điểm trừ đánh giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((user, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="p-3 text-sm text-gray-800">{user.name}</td>
                            <td className="p-3 text-sm text-gray-800">{user.department}</td>
                            <td className="p-3 text-sm text-gray-800">{user.doing}</td>
                            <td className="p-3 text-sm text-gray-800">{user.overdue}</td>
                            <td className="p-3 text-sm text-gray-800">{user.pending}</td>
                            <td className="p-3 text-sm text-gray-800">{user.doneOnTime}</td>
                            <td className="p-3 text-sm text-gray-800">{user.doneLate}</td>
                            <td className="p-3 text-sm text-gray-800">{user.total}</td>
                            <td className="p-3 text-sm text-gray-800">{user.avgScore}</td>
                            <td className="p-3 text-sm text-gray-800">{user.evalPoint}</td>
                            <td className="p-3 text-sm text-gray-800">{user.minusPoint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col items-center mt-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Hiển thị {filteredData.length === 0 ? 0 : currentPage * pageSize + 1} -{' '}
                      {Math.min((currentPage + 1) * pageSize, reportData.length)} của {reportData.length} bản ghi
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