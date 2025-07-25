import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/departmentlist.css';
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
      fetchDepartments(currentPage, searchText); // reload
      // TODO: refresh lại danh sách nếu cần
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
    setCurrentPage(0); // reset về page 0 khi search
  };



  useEffect(() => {
    fetchDepartments(currentPage, searchText);
  }, [currentPage]); // chỉ gọi lại khi chuyển trang






  return (
    <div className="department-container">
      <Sidebar />
      <div className="main-content">
        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
        <h2 className="page-title">Danh sách đơn vị</h2>


        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm đơn vị"
            value={searchText}
            onChange={handleSearchChange}
          />
          <button onClick={() => fetchDepartments(0, searchText)}>🔍 Tìm kiếm</button>
          <button onClick={() => setShowAddPopup(true)}>+ Tạo mới</button>
        </div>

        {showAddPopup && (
          <CreateDepartmentPopup
            onClose={() => setShowAddPopup(false)}
            onSubmit={handleCreateDepartment}
          />
        )}

        <div className="card-grid">
          {departments.map((dept, index) => (
            <div
              key={dept.id}
              className="dept-card"
              onClick={() => handleDepartmentClick(dept.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="dept-title">{dept.name}</div>
              <div className="dept-meta">
                <span className="created-by">👤 Người tạo {dept.createdByName}</span>
                <span className="created-at">
                  🕒 lúc {new Date(dept.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>



        <div className="pagination">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
            &lt;
          </button>
          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              className={n === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(n)}
            >
              {n + 1}
            </button>
          ))}
          <button
            disabled={currentPage + 1 === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>

      </div>


    </div>
  );
};

export default DepartmentListPage;
