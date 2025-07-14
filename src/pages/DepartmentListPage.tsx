import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/departmentlist.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';


const departments = [
  {
    name: 'Đơn Vị A',
    createdBy: 'tham.tranthi@mobifone.vn',
    createdAt: '20/06/2022 00:00',
    teams: 0,
    projects: 0,
    members: ['H'],
  },
  {
    name: 'Phòng A kv3',
    createdBy: 'tham.tranthi@mobifone.vn',
    createdAt: '04/08/2022 10:53',
    teams: 0,
    projects: 0,
    members: [],
  },
  {
    name: 'Phòng công nghệ kỹ thuật',
    createdBy: 'phuong.levan@mobifone.vn',
    createdAt: '11/08/2022 15:33',
    teams: 0,
    projects: 0,
    members: ['VD', 'NH', 'MT', '+10'],
  },
  {
    name: 'Phòng kinh doanh',
    createdBy: 'phuong.levan@mobifone.vn',
    createdAt: '11/08/2022 15:34',
    teams: 0,
    projects: 0,
    members: ['QT', 'HT', 'VK', '+3'],
  },
  {
    name: 'Đơn vị Hoài test 22',
    createdBy: 'thung.cao@mobifone.vn',
    createdAt: '06/09/2022 15:12',
    teams: 0,
    projects: 0,
    members: ['C2', 'H1'],
  },
  // ... thêm các đơn vị khác nếu cần
];

const DepartmentListPage = () => {

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);


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
        <h2 className="page-title">Quản lý hệ thống</h2>
        <div className="subtitle">Danh sách đơn vị</div>

        <div className="filter-bar">
          <input type="text" className="search-input" placeholder="Tìm đơn vị" />
          <div className="view-toggle">
            <button className="active">📦 Bảng</button>
            <button>📋 List</button>
          </div>
        </div>

        <div className="card-grid">
          {departments.map((dept, index) => (
            <div key={index} className="dept-card">
              <div className="dept-header">
                <div className="dept-title">{dept.name}</div>
                <div className="more-icon">⋯</div>
              </div>
              <div className="dept-meta">
                <span className="created-by">👤 Người tạo <a href={`mailto:${dept.createdBy}`}>{dept.createdBy}</a></span>
                <span className="created-at">🕒 lúc {dept.createdAt}</span>
              </div>
              <div className="dept-stats">
                <span className="badge">🏢 {dept.teams} phòng ban</span>
                <span className="badge">📁 {dept.projects} dự án</span>
              </div>
              <div className="member-avatars">
                {dept.members.map((m, i) => (
                  <div key={i} className="avatar-badge">{m}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button>&lt;</button>
          {[1, 2, 3, 4, 5].map(n => <button key={n}>{n}</button>)}
          <span>...</span>
          <button>143 &gt;</button>
        </div>
      </div>


    </div>
  );
};

export default DepartmentListPage;
