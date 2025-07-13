import React from 'react';
import '../style/dashboard.css';

interface TasksProps {
  onBack: () => void;
}

const Tasks: React.FC<TasksProps> = ({ onBack }) => {
  const tasksData = [
    { id: 'Công việc 1', dept: 'Phòng Phát triển phần mềm 2', status: 'Trễ 23 ngày', progress: '5%', date: '20/06/2025', assigned: 'CA, CL_P1' },
    { id: 'Công việc 2', dept: 'Phòng Phát triển phần mềm 2', status: 'Trễ 13 ngày', progress: '0%', date: '30/06/2025', assigned: 'SO' },
    { id: 'Công việc 3', dept: 'Phòng Phát triển phần mềm 2', status: 'Hoàn thành', progress: '0%', date: '30/06/2025', assigned: 'KA' },
    { id: 'Công việc 4', dept: 'Tổng công ty Viễn thông MobiFone', status: 'Trễ 44 ngày', progress: '0%', date: '30/06/2025', assigned: 'QD_KA_TL' },
    { id: 'Công việc 5', dept: 'Đơn vị test log 2', status: 'Trễ 13 ngày', progress: '0%', date: '21/05/2025', assigned: 'KA_TL_PHA' },
    { id: 'Công việc 6', dept: 'Đơn vị test log của đơn 1', status: 'Hoàn thành', progress: '0%', date: '31/05/2025', assigned: 'KA' },
    { id: 'Công việc 7', dept: 'Phòng Phát triển phần mềm 2', status: 'Còn 306 ngày', progress: '4%', date: '15/05/2026', assigned: 'KA_TL' },
    { id: 'Công việc 8', dept: 'Tổng công ty Viễn thông MobiFone', status: 'Trễ 43 ngày', progress: '0%', date: '31/05/2025', assigned: 'TH' },
    { id: 'Công việc 9', dept: 'Phòng Phát triển phần mềm 2', status: 'Hoàn thành', progress: '0%', date: '23/05/2025', assigned: 'KA' },
  ];

  return (
    <div className="content tasks-content">
      <div className="tasks-header">
        <h2 className="tasks-title">Công việc</h2>
        <div className="tasks-actions">
          <button className="add-task-btn">+ Thêm công việc</button>
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
      <div className="tasks-grid">
        {tasksData.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <span className="task-id">{task.id}</span>
              <span className="task-dept">{task.dept}</span>
            </div>
            <div className="task-status">
              <span className={`status-dot ${task.status.includes('Trễ') ? 'late' : task.status.includes('Hoàn thành') ? 'complete' : 'ongoing'}`}></span>
              <span className="status-text">{task.status}</span>
            </div>
            <div className="task-progress">{task.progress}</div>
            <div className="task-date">{task.date}</div>
            <div className="task-assigned">
              {task.assigned.split(',').map((assign, index) => (
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

export default Tasks;