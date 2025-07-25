import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CreateDepartmentPopup from '../components/CreateDepartmentPopup';
import { createDepartment, getDepartments, type DepartmentRequest } from '../api/departmentApi';
import { toast } from 'react-toastify';

const DepartmentListPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');

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
      const token = localStorage.getItem('access_token') || '';
      const data = await getDepartments(token, page, 10, search);
      setDepartments(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Không thể tải danh sách đơn vị.';
      toast.error(message);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(0);
  };

  useEffect(() => {
    fetchDepartments(currentPage, searchText);
  }, [currentPage]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />

        <div className="mt-8 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm đơn vị"
            value={searchText}
            onChange={handleSearchChange}
          />
          <button 
            onClick={() => fetchDepartments(0, searchText)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            🔍 Tìm kiếm
          </button>
          <button 
            onClick={() => setShowAddPopup(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            + Tạo mới
          </button>
        </div>

        {showAddPopup && (
          <CreateDepartmentPopup
            onClose={() => setShowAddPopup(false)}
            onSubmit={handleCreateDepartment}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
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
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
          >
            &lt;
          </button>
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              className={`px-3 py-1 rounded-md ${
                n === currentPage 
                  ? 'bg-blue-500 text-white' 
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
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentListPage;