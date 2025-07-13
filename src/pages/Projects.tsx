import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../style/project.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Profile from '../pages/Profile';


const Projects = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Tháng này');
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
  const [projects] = useState([
    {
      id: 1,
      name: "Đã test 1.806",
      unit: "Phòng Phát triển phần mềm 2",
      status: "Trễ 23 ngày",
      progress: "0%",
      items: [
        { label: "0  12/1", checked: false },
        { label: "5%", checked: false },
        { label: "2006/2025", checked: false }
      ]
    },
    {
      id: 2,
      name: "Dự án nội bộ",
      unit: "Tổng công ty Viễn thông MobilePore",
      status: "Trễ 44 ngày",
      progress: "0%",
      items: [
        { label: "0  01/5", checked: false },
        { label: "0%", checked: false },
        { label: "3%", checked: false },
        { label: "3006/2025", checked: false }
      ]
    },
    {
      id: 3,
      name: "Dự án tổng công ty MBF",
      unit: "Phòng Phát triển phần mềm 2",
      status: "Còn 306 ngày",
      progress: "4%",
      items: [
        { label: "0  12/4", checked: false },
        { label: "4%", checked: false },
        { label: "15/05/2026", checked: false }
      ]
    },
    {
      id: 4,
      name: "DỊA TUYỂN TEST",
      unit: "Phòng Phát triển phần mềm 2",
      status: "Trễ 13 ngày",
      progress: "5%",
      items: [
        { label: "0  01/1", checked: false },
        { label: "5%", checked: false },
        { label: "3006/2025", checked: false }
      ]
    },
    {
      id: 5,
      name: "Dự án test log 3 2",
      unit: "Đơn vị test listing",
      status: "Trễ 53 ngày",
      progress: "5%",
      items: [
        { label: "0  01/2", checked: false },
        { label: "5%", checked: false },
        { label: "21/05/2025", checked: false }
      ]
    },
    {
      id: 6,
      name: "trang11",
      unit: "Tổng công ty Viễn thông MobilePore",
      status: "Trễ 43 ngày",
      progress: "5%",
      items: [
        { label: "0  01/1", checked: false },
        { label: "5%", checked: false },
        { label: "31/05/2025", checked: false }
      ]
    }
  ]);

  return (
    <div className="dashboard-container">
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
              <h1>Dự án</h1>
              <div className="project-filters">
                <div className="filter-item active">Tất cả</div>
                <div className="filter-item">Đang thực hiện</div>
                <div className="filter-item">Hoàn thành</div>
                <div className="filter-item">Trễ hạn</div>
              </div>
            </div>

            <div className="projects-grid">
              {projects.map(project => (
                // <div className="project-card" key={project.id}>
                <div
                  className="project-card"
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <div className={`status-badge ${project.status === 'Hoàn thành' ? 'completed' : 'delayed'}`}>
                      {project.status}
                    </div>
                  </div>
                  <p className="project-unit">{project.unit}</p>

                  <div className="project-items">
                    {project.items.map((item, index) => (
                      <div className="project-item" key={index}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => { }}
                        />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;