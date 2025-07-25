// DepartmentDetailPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../style/departmentdetail.css';

// Mock data - trong thực tế sẽ fetch từ API dựa trên ID
const getDepartmentDetail = (id: string) => {
  const departments = [
    {
      id: '1',
      name: 'Đơn Vị A',
      createdBy: 'tham.tranthi@mobifone.vn',
      createdAt: '20/06/2022 00:00',
      description: 'Đơn vị chuyên trách về phát triển sản phẩm và dịch vụ mới của công ty.',
      teams: 3,
      projects: 12,
      members: [
        { id: 1, name: 'Hoàng Văn A', email: 'hoang.a@mobifone.vn', role: 'Trưởng phòng', avatar: 'H' },
        { id: 2, name: 'Nguyễn Thị B', email: 'nguyen.b@mobifone.vn', role: 'Phó phòng', avatar: 'N' },
        { id: 3, name: 'Trần Văn C', email: 'tran.c@mobifone.vn', role: 'Nhân viên', avatar: 'T' },
        { id: 4, name: 'Lê Thị D', email: 'le.d@mobifone.vn', role: 'Nhân viên', avatar: 'L' },
      ],
      projects_list: [
        { id: 1, name: 'Dự án A', status: 'Đang thực hiện', progress: 75 },
        { id: 2, name: 'Dự án B', status: 'Hoàn thành', progress: 100, completedDate: '25/12/2024' },
        { id: 3, name: 'Dự án C', status: 'Lên kế hoạch', progress: 25 },
        { id: 4, name: 'Dự án D', status: 'Hoàn thành', progress: 100, completedDate: '15/11/2024' },
      ]
    },
    {
      id: '2',
      name: 'Phòng A kv3',
      createdBy: 'tham.tranthi@mobifone.vn',
      createdAt: '04/08/2022 10:53',
      description: 'Phòng ban khu vực 3 chuyên trách về vận hành và bảo trì hệ thống.',
      teams: 2,
      projects: 8,
      members: [
        { id: 1, name: 'Phạm Văn E', email: 'pham.e@mobifone.vn', role: 'Trưởng phòng', avatar: 'P' },
        { id: 2, name: 'Võ Thị F', email: 'vo.f@mobifone.vn', role: 'Nhân viên', avatar: 'V' },
      ],
      projects_list: [
        { id: 1, name: 'Bảo trì hệ thống', status: 'Đang thực hiện', progress: 60 },
        { id: 2, name: 'Nâng cấp thiết bị', status: 'Lên kế hoạch', progress: 10 },
      ]
    }
  ];
  
  return departments.find(dept => dept.id === id) || departments[0];
};

const DepartmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const department = getDepartmentDetail(id || '1');

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

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleBackToDepartments = () => {
    navigate('/department');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return '#10b981';
      case 'Đang thực hiện': return '#3b82f6';
      case 'Lên kế hoạch': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="department-detail-container">
      <Sidebar />
      <div className="main-content">
        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
        
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={handleBackToDepartments} className="breadcrumb-link">
            Danh sách đơn vị
          </span>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">{department.name}</span>
        </div>

        {/* Department Header */}
        <div className="dept-detail-header">
          <div className="dept-info">
            <h1 className="dept-name">{department.name}</h1>
            <p className="dept-description">{department.description}</p>
            <div className="dept-meta">
              <span className="created-info">
                👤 Người tạo: <a href={`mailto:${department.createdBy}`}>{department.createdBy}</a>
              </span>
              <span className="created-time">🕒 Tạo lúc: {department.createdAt}</span>
            </div>
          </div>
          <div className="dept-actions">
            <button className="btn-edit">✏️ Chỉnh sửa</button>
            <button className="btn-delete">🗑️ Xóa</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <div className="stat-number">{department.projects}</div>
              <div className="stat-label">Dự án</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{department.members.length}</div>
              <div className="stat-label">Thành viên</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button 
              className={`tab ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              Thành viên
            </button>
            <button 
              className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Dự án
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="content-grid">
                <div className="overview-section">
                  <h3>Thành viên mới tham gia</h3>
                  <div className="member-list-preview">
                    {department.members.slice(0, 3).map(member => (
                      <div key={member.id} className="member-item">
                        <div className="member-avatar">{member.avatar}</div>
                        <div className="member-info">
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-section">
                  <h3>Dự án đang thực hiện</h3>
                  <div className="project-list-preview">
                    {department.projects_list.filter(p => p.status === 'Đang thực hiện').map(project => (
                      <div key={project.id} className="project-item">
                        <div className="project-name">{project.name}</div>
                        <div className="project-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-section">
                  <h3>Dự án hoàn thành</h3>
                  <div className="project-list-preview">
                    {department.projects_list.filter(p => p.status === 'Hoàn thành').length > 0 ? (
                      department.projects_list.filter(p => p.status === 'Hoàn thành').map(project => (
                        <div key={project.id} className="project-item completed">
                          <div className="project-name">{project.name}</div>
                          <div className="project-status">
                            <span className="status-completed">✅ Hoàn thành</span>
                            <span className="completion-date">{project.completedDate || '25/12/2024'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <div className="empty-text">Chưa có dự án hoàn thành</div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-content">
              <div className="members-header">
                <h3>Danh sách thành viên ({department.members.length})</h3>
                <button className="btn-add">+ Thêm thành viên</button>
              </div>
              <div className="members-table">
                <div className="table-header">
                  <div>Tên</div>
                  <div>Email</div>
                  <div>Vai trò</div>
                  <div>Thao tác</div>
                </div>
                {department.members.map(member => (
                  <div key={member.id} className="table-row">
                    <div className="member-cell">
                      <div className="member-avatar">{member.avatar}</div>
                      {member.name}
                    </div>
                    <div>{member.email}</div>
                    <div>
                      <span className="role-badge">{member.role}</span>
                    </div>
                    <div>
                      <button className="btn-action">✏️</button>
                      <button className="btn-action">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-content">
              <div className="projects-header">
                <h3>Danh sách dự án ({department.projects_list.length})</h3>
                <button className="btn-add">+ Tạo dự án</button>
              </div>
              <div className="projects-grid">
                {department.projects_list.map(project => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h4>{project.name}</h4>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="project-progress">
                      <div className="progress-label">Tiến độ: {project.progress}%</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;