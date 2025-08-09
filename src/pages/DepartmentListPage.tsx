import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CreateDepartmentPopup from '../components/CreateDepartmentPopup';
import { createDepartment, getDepartments, type DepartmentRequest } from '../api/departmentApi';
import { toast } from 'react-toastify';
import Profile from './Profile';

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDepartmentClick = (departmentId: string) => {
    navigate(`/department/${departmentId}`);
  };

  const handleChangePassword = () => {
    console.log('Change password clicked');
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    setShowProfile(true);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleCreateDepartment = async (formData: DepartmentRequest) => {
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await createDepartment(formData, token);
      const data = (res as { data: { message: string } }).data;
      toast.success("Thêm mới đơn vị thành công!");
      setShowAddPopup(false);
      fetchDepartments(currentPage, searchText);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Tạo đơn vị thất bại. Vui lòng kiểm tra lại.';
      toast.error(message);
    }
  };

  const fetchDepartments = async (page = 0, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await getDepartments(token, page, 10, search);
      setDepartments(data.content || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.number);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Không thể tải danh sách phòng ban.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(0); // Reset về trang đầu tiên khi tìm
    setSearchKeyword(searchText); // Gán để useEffect gọi API
  };


  useEffect(() => {
    fetchDepartments(currentPage, searchKeyword);
  }, [currentPage, searchKeyword]);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
      <Header isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />

        {showProfile ? (
          <Profile />
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách phòng ban</h1>
              <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tìm phòng ban"
                  value={searchText}
                  onChange={handleSearchChange}
                />
                <button
                  onClick={handleSearchSubmit}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150 flex items-center gap-2"
                >
                  <span>🔍</span> Tìm kiếm
                </button>
                <button
                  onClick={() => setShowAddPopup(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150 flex items-center gap-2"
                >
                  <span>+</span> Tạo mới
                </button>
              </div>

              {loading && (
                <div className="text-center text-gray-500">
                  <svg className="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                  </svg>
                  <span className="ml-2">Đang tải...</span>
                </div>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              {!loading && !error && departments.length === 0 && (
                <div className="text-center text-gray-500">Không có đơn vị nào.</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow duration-150"
                    onClick={() => handleDepartmentClick(dept.id)}
                  >
                    <div className="text-lg font-semibold text-gray-900">{dept.name}</div>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div>👤 Người tạo: {dept.createdByName}</div>
                      <div>🕒 lúc: {new Date(dept.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors duration-150"
                >
                  &lt;
                </button>
                {[...Array(totalPages).keys()].map((n) => (
                  <button
                    key={n}
                    className={`px-3 py-1 rounded-lg ${n === currentPage
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    onClick={() => setCurrentPage(n)}
                  >
                    {n + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage + 1 === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors duration-150"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddPopup && (
          <CreateDepartmentPopup
            onClose={() => setShowAddPopup(false)}
            onSubmit={handleCreateDepartment}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentListPage;