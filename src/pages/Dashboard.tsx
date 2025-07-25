// File: src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/dashboard.css';
import Profile from './Profile';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BaseDoughnutChart from '../components/BaseDoughnutChart';
import BaseBarChart from '../components/BaseBarChart';

const Dashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Tháng này');
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

  const chartData = {
    labels: ['Đã hoàn thành', 'Đang xử lý', 'Chưa bắt đầu'],
    datasets: [
      {
        label: 'Tiến độ công việc',
        data: [12, 19, 7],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };


   const chartDataCot = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
    datasets: [
      {
        label: 'Doanh thu (triệu VND)',
        data: [120, 190, 300, 250],
        backgroundColor: '#42a5f5',
      },
    ],
  };

   const chartOptionsCot = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };



  const projectStatusData = [
    { label: 'Đang phát triển', value: 74, color: '#3b82f6' },
    { label: 'Sắp tới hạn', value: 10, color: '#f59e0b' },
    { label: 'Hoàn thành', value: 26, color: '#10b981' },
    { label: 'Quá hạn', value: 10, color: '#ef4444' }
  ];

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />



      {/* Main Content */}
      <div className="main-content">
        {/* Header */}

        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />

        {/* Content */}
        {showProfile ? (
          <Profile onBack={handleBackToDashboard} />
        ) : (
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
                <BaseDoughnutChart data={chartData} options={chartOptions} width={300} height={300} />

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
              <BaseBarChart data={chartDataCot} options={chartOptionsCot} width={700} height={400} />

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;