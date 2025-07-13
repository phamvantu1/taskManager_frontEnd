import React from 'react';
import '../style/project.css';
import Sidebar from '../components/Sidebar';

interface ProjectsProps {
  onBack: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onBack }) => {
  const projectsData = [
    { id: 'DA test 1806', dept: 'Phòng Phát triển phần mềm 2', status: 'Trễ 23 ngày', progress: '5%', date: '20/06/2025', assigned: 'CA, CL_P1' },
    { id: 'D/A TUYEN_TEST', dept: 'Phòng Phát triển phần mềm 2', status: 'Trễ 13 ngày', progress: '0%', date: '30/06/2025', assigned: 'SO' },
    { id: 'cTrang', dept: 'Phòng Phát triển phần mềm 2', status: 'Hoàn thành', progress: '0%', date: '30/06/2025', assigned: 'KA' },
    { id: 'Dự án nợ bảng', dept: 'Tổng công ty Viễn thông MobiFone', status: 'Trễ 44 ngày', progress: '0%', date: '30/06/2025', assigned: 'QD_KA_TL' },
    { id: 'Dự án test log 2', dept: 'Đơn vị test log 2', status: 'Trễ 13 ngày', progress: '0%', date: '21/05/2025', assigned: 'KA_TL_PHA' },
    { id: 'Dự án test log của đơn 1', dept: 'Đơn vị test log của đơn 1', status: 'Hoàn thành', progress: '0%', date: '31/05/2025', assigned: 'KA' },
    { id: 'Dự án tống công ty MBF', dept: 'Phòng Phát triển phần mềm 2', status: 'Còn 306 ngày', progress: '4%', date: '15/05/2026', assigned: 'KA_TL' },
    { id: 'trang11', dept: 'Tổng công ty Viễn thông MobiFone', status: 'Trễ 43 ngày', progress: '0%', date: '31/05/2025', assigned: 'TH' },
    { id: 'da pa test cán pd 33', dept: 'Phòng Phát triển phần mềm 2', status: 'Hoàn thành', progress: '0%', date: '23/05/2025', assigned: 'KA' },
  ];

  return (
    <div className="content projects-content">

        <Sidebar />

      <div className="projects-header">
        <h2 className="projects-title">Dự án</h2>
        <div className="projects-actions">
          <button className="add-project-btn">+ Thêm dự án</button>
          <div className="search-wrapper">
            <input type="text" placeholder="Tìm kiếm" className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
          <select className="filter-select">
            <option>Lọc theo ngày</option>
          </select>
          <select className="filter-select">
            <option>Lọc theo đơn vị</option>
          </select>
          <button className="export-btn">Xuất excel</button>
        </div>
      </div>
      <div className="projects-grid">
        {projectsData.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <span className="project-id">{project.id}</span>
              <span className="project-dept">{project.dept}</span>
            </div>
            <div className="project-status">
              <span className={`status-dot ${project.status.includes('Trễ') ? 'late' : project.status.includes('Hoàn thành') ? 'complete' : 'ongoing'}`}></span>
              <span className="status-text">{project.status}</span>
            </div>
            <div className="project-progress">{project.progress}</div>
            <div className="project-date">{project.date}</div>
            <div className="project-assigned">
              {project.assigned.split(',').map((assign, index) => (
                <span key={index} className="assigned-tag">{assign.trim()}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="back-btn" onClick={onBack}>Quay lại</button>
    </div>
  );
};

export default Projects;