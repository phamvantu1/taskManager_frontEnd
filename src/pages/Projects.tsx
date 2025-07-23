import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../style/project.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Profile from '../pages/Profile';
import AddProjectPopup from '../components/AddProjectPopup';


import { getAllProjects } from '../api/projectApi';

const Projects = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;


  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleChangePassword = () => setIsDropdownOpen(false);
  const handleProfile = () => { setShowProfile(true); setIsDropdownOpen(false); };
  const handleBackToDashboard = () => setShowProfile(false);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const fetchProjects = async () => {
    try {
      const pageData = await getAllProjects(page, pageSize);
      setProjects(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dự án:', error);
    }
  };

  useEffect(() => {

    fetchProjects();
  }, [page]);


  return (
    <div className="project-container">
      <Sidebar />
      <div className="main-content">
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
          <div className="projects-container">
            <div className="projects-header">
              <button className="add-project-btn" onClick={() => setShowAddPopup(true)}>
                + Thêm mới dự án
              </button>
              <div className="project-filters">
                <div className="filter-item active">Tất cả</div>
                <div className="filter-item">Đang thực hiện</div>
                <div className="filter-item">Hoàn thành</div>
                <div className="filter-item">Trễ hạn</div>
              </div>
            </div>

            <div className="projects-grid-wrapper" style={{ flexGrow: 1, overflowY: 'auto' }}>
              <div className="projects-grid">
                {projects.map(project => (
                  <div
                    className="project-card"
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-header">
                      <h3>{project.name || 'Không tên'}</h3>
                      <div className={`status-badge ${project.status === 'DONE' ? 'completed' : 'delayed'}`}>
                        {project.status}
                      </div>
                    </div>
                    <p className="project-unit">Phân loại : {project.type}</p>
                    <div className="project-items">
                      <div className="project-item">
                        <span> Ngày bắt đầu : {project.startTime}</span>
                      </div>
                      <div className="project-item">
                        <span> Ngày kết thúc :  {project.endTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Trang trước
                </button>
                <span>
                  Trang {page + 1} / {totalPages}
                </span>
                <button
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
            fetchProjects(); // reload danh sách
            setShowAddPopup(false); // đóng popup
          }}
        />
      )}


    </div>
  );
};

export default Projects;
