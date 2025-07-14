import React from 'react';
import '../style/sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {

  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">📱</span>
          <span className="logo-text">mobifone</span>
        </div>
      </div>

      <div className="sidebar-title">Trang chủ</div>

      <nav className="sidebar-nav">
        <div className="nav-item" onClick={() => navigate('/dashboard')}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </div>
       
        <div
          className="nav-item"
          onClick={() => navigate('/projects')}
          style={{ cursor: 'pointer' }}
        >
          <span className="nav-icon">📁</span>
          <span>Dự án</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👥</span>
          <span>Công việc</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">👤</span>
          <span>Quản trị</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📋</span>
          <span>Danh mục</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Báo cáo</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
