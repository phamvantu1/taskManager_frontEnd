// Sidebar.tsx
import React, { useState } from 'react';
import '../style/sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

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

        <div className="nav-item" onClick={() => navigate('/taskListPage')}>
          <span className="nav-icon">👥</span>
          <span>Công việc</span>
        </div>

        {/* Dropdown Menu Item */}
        <div className="nav-item dropdown-parent ">
          <div
          className='flex flex-col'
            onClick={() => setAdminOpen(!adminOpen)}
            style={{
              cursor: 'pointer',
              gap: '12px',
              width: '100%'
            }}
          >
            <div className=" flex flex-row justify-start gap-2">
              <span className="nav-icon">👤</span>
              <span>Quản trị</span>
              <span className={`dropdown-arrow ${adminOpen ? 'open' : ''}`}>▾</span>
            </div>
            {/* Dropdown Menu - Hiển thị bên dưới */}
            {adminOpen && (
              <div className="sidebar-dropdown-menu flex flex-col ">
                <div className=" text-white p-2 ml-2 hover:bg-[#FFFFFF0D]" onClick={() => navigate('/department')}>
                  Phòng ban
                </div>
                <div className=" text-white p-2 ml-2 hover:bg-[#FFFFFF0D]" onClick={() => navigate('/memberlistpage')}>
                  Người dùng
                </div>
              </div>
            )}
          </div>


        </div>

        <div className="nav-item" onClick={() => navigate('/report')}>
          <span className="nav-icon">📊</span>
          <span>Báo cáo</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;