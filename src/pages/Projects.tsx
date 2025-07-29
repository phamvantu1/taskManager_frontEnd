import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from '../pages/Profile';
import AddProjectPopup from '../components/AddProjectPopup';
import { getAllProjects } from '../api/projectApi';
import { useHeader } from '../components/HeaderContext';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { isDropdownOpen, toggleDropdown, onProfileClick, onChangePassword, onLogout, showProfile, setShowProfile } = useHeader();
  const [projects, setProjects] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [filters, setFilters] = useState({
    textSearch: '',
    status: '',
    startTime: '',
    endTime: '',
  });
  const pageSize = 6;

  const fetchProjects = async () => {
    try {
      const pageData = await getAllProjects(
        page,
        pageSize,
        undefined, // departmentId (not used in this example)
        filters.textSearch,
        filters.status,
        filters.startTime,
        filters.endTime
      );
      setProjects(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dự án:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const handleFilterClick = (status: string) => {
    const newStatus = status === 'Tất cả' ? '' : status.toUpperCase().replace(' ', '_'); // Map to API status
    handleFilterChange('status', newStatus);
  };

  const handleResetFilters = () => {
    setFilters({
      textSearch: '',
      status: '',
      startTime: '',
      endTime: '',
    });
    setPage(0);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 flex flex-col">
        <Header
          onProfileClick={onProfileClick}
          onChangePassword={onChangePassword}
          onLogout={onLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
        {showProfile ? (
          <Profile onBack={() => setShowProfile(false)} />
        ) : (
          <div className="flex-1 p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-md"
                  onClick={() => setShowAddPopup(true)}
                >
                  + Thêm mới dự án
                </button>
                <div className="flex space-x-3">
                  {['Tất cả', 'Đang thực hiện', 'Hoàn thành', 'Trễ hạn'].map((filter) => (
                    <div
                      key={filter}
                      className={`px-5 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-150 ${
                        (filter === 'Tất cả' && !filters.status) ||
                        filters.status === filter.toUpperCase().replace(' ', '_')
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                      }`}
                      onClick={() => handleFilterClick(filter)}
                    >
                      {filter}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={filters.textSearch}
                  onChange={(e) => handleFilterChange('textSearch', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={filters.startTime}
                  onChange={(e) => handleFilterChange('startTime', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={filters.endTime}
                  onChange={(e) => handleFilterChange('endTime', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-150"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {project.name || 'Không tên'}
                      </h3>
                      <div
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          project.status === 'DONE'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'OVERDUE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {project.status}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 font-medium">Phân loại: {project.type}</p>
                    <div className="text-sm text-gray-500 space-y-2">
                      <div className="flex items-center">
                        <span className="mr-2">📅</span> Ngày bắt đầu: {project.startTime}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🏁</span> Ngày kết thúc: {project.endTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Trang trước
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page + 1 >= totalPages}
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {showAddPopup && (
        <AddProjectPopup
          onClose={() => setShowAddPopup(false)}
          onAddSuccess={() => {
            fetchProjects();
            setShowAddPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Projects;