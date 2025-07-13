// File: src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/dashboard.css';

const Dashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Tháng này');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const statsData = [
    {
      title: 'THỐNG KÊ NHÂN SỰ',
      value: '217',
      subtitle: '2 môi bộ sung',
      icon: '👥',
      color: '#ef4444'
    },
    {
      title: 'TỔNG DỰ ÁN',
      value: '23',
      subtitle: '3 thăng trước',
      icon: '💼',
      color: '#f97316'
    },
    {
      title: 'TỔNG SỐ CÔNG VIỆC',
      value: '11',
      subtitle: '0 được giao\n10 giao đi',
      icon: '📋',
      color: '#10b981'
    }
  ];

  const projectStatusData = [
    { label: 'Đang phát triển', value: 74, color: '#3b82f6' },
    { label: 'Sắp tới hạn', value: 0, color: '#f59e0b' },
    { label: 'Hoàn thành', value: 26, color: '#10b981' },
    { label: 'Quá hạn', value: 0, color: '#ef4444' }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">📱</span>
            <span className="logo-text">mobifone</span>
          </div>
        </div>
        
        <div className="sidebar-title">Trang chủ</div>
        
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📈</span>
            <span>Tiến độ Tuần</span>
          </div>
          <div className="nav-item">
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

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <button className="back-button">‹</button>
            <div className="header-title">
              <span className="header-icon">🏠</span>
              <span>Trang chủ</span>
            </div>
          </div>
          <div className="header-right">
            <div className="search-container">
              <input type="text" placeholder="Tìm kiếm" className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
            <div className="user-menu">
              <span className="notification-icon">🔔</span>
              <div className="user-avatar">QM</div>
              <div className="dropdown">
                <span className="menu-icon">⋮</span>
                <div className="dropdown-content">
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Time filter */}
          <div className="time-filter">
            <span className="filter-icon">📅</span>
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="time-select"
            >
              <option>Tháng này</option>
              <option>Tuần này</option>
              <option>Năm này</option>
            </select>
            <div className="view-options">
              <button className="view-btn">📋 Việc của tôi</button>
              <button className="view-btn">📊 Tổng quan</button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {statsData.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-subtitle">{stat.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Project Status Chart */}
            <div className="chart-card">
              <h3 className="chart-title">TRẠNG THÁI DỰ ÁN CỦA TỪNG ĐƠN VỊ</h3>
              <div className="chart-container">
                <div className="donut-chart">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="40"
                      strokeDasharray="125 500"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="40"
                      strokeDasharray="185 500"
                      strokeDashoffset="-125"
                      transform="rotate(-90 100 100)"
                    />
                    <text x="100" y="95" textAnchor="middle" className="chart-center-number">19</text>
                    <text x="100" y="115" textAnchor="middle" className="chart-center-text">dự án</text>
                  </svg>
                </div>
                <div className="chart-legend">
                  {projectStatusData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-label">{item.value}% {item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Progress Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Phòng Phát triển phần mềm 2</h3>
              <div className="progress-stats">
                <div className="progress-item">
                  <div className="progress-dot" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span>74% Đang phát triển</span>
                </div>
                <div className="progress-item">
                  <div className="progress-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span>0% Sắp tới hạn</span>
                </div>
                <div className="progress-item">
                  <div className="progress-dot" style={{ backgroundColor: '#10b981' }}></div>
                  <span>26% Hoàn thành</span>
                </div>
                <div className="progress-item">
                  <div className="progress-dot" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>0% Quá hạn</span>
                </div>
              </div>
              <button className="arrow-btn">›</button>
            </div>
          </div>

          {/* Work Progress Timeline */}
          <div className="timeline-section">
            <div className="timeline-header">
              <h3>THEO DÕI TIẾN ĐỘ XỬ LÝ CÔNG VIỆC CỦA ĐƠN VỊ</h3>
              <div className="timeline-filters">
                <select className="filter-select">
                  <option>Ngày</option>
                </select>
                <select className="filter-select">
                  <option>Tuần</option>
                </select>
                <select className="filter-select">
                  <option>Tháng</option>
                </select>
                <select className="filter-select">
                  <option>Năm</option>
                </select>
                <div className="date-navigation">
                  <button>‹</button>
                  <span>07/2025</span>
                  <button>›</button>
                </div>
              </div>
            </div>
            <div className="timeline-chart">
              <div className="chart-placeholder">
                <div className="y-axis">
                  <span>0</span>
                </div>
                <div className="chart-area">
                  <div className="empty-chart">Biểu đồ tiến độ công việc</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;