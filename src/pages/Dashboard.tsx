import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BaseDoughnutChart from '../components/BaseDoughnutChart';
import BaseBarChart from '../components/BaseBarChart';
import ProgressChart from '../components/ProgressChart';

const Dashboard: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState('Tất cả đơn vị');
  const [selectedProject, setSelectedProject] = useState('Tất cả dự án');
  const [projectStatusDateRange, setProjectStatusDateRange] = useState({ start: '2025-07-01', end: '2025-07-31' });
  const [workProgressDateRange, setWorkProgressDateRange] = useState({ start: '2025-12-21', end: '2026-01-20' });
  const [progressDateRange, setProgressDateRange] = useState({ start: '2025-12-21', end: '2026-01-20' });
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
    labels: ['Chưa xử lý', 'Đang xử lý', 'Hoàn thành', 'Quá hạn'],
    datasets: [
      {
        label: 'Số lượng công việc',
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
          <div className="p-6">
            {/* Unit Filter */}
            <div className="mb-6">
              <select
                className="border rounded-lg px-3 py-2 bg-white"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                <option>Tất cả đơn vị</option>
                <option>Phòng Phát triển phần mềm 1</option>
                <option>Phòng Phát triển phần mềm 2</option>
                <option>Phòng Kiểm thử</option>
                <option>Phòng Phân tích</option>
              </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-600">{stat.title}</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500 whitespace-pre-line">{stat.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Project Status Chart */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">TRẠNG THÁI DỰ ÁN CỦA ĐƠN VỊ</h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={projectStatusDateRange.start}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={projectStatusDateRange.end}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, end: e.target.value })}
                  />
                </div>
                <div className="flex justify-center">
                  <BaseDoughnutChart data={chartData} options={chartOptions} width={300} height={300} />
                </div>
              </div>

              {/* Work Progress Chart */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center relative">
                <h3 className="text-lg font-semibold mb-4">TRẠNG THÁI CÔNG VIỆC CỦA TỪNG DỰ ÁN</h3>
                <div className="flex gap-4 mb-4">
                  <select
                    className="border rounded-lg px-3 py-2 bg-white"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option>Tất cả dự án</option>
                    <option>Dự án A</option>
                    <option>Dự án B</option>
                    <option>Dự án C</option>
                    <option>Dự án D</option>
                  </select>
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={workProgressDateRange.start}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={workProgressDateRange.end}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, end: e.target.value })}
                  />
                </div>
                <div className="flex justify-center">
                  <BaseBarChart data={chartDataCot} options={chartOptionsCot} width={700} height={400} />
                </div>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300">
                  ›
                </button>
              </div>
            </div>

            {/* Work Progress Timeline */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">THEO DÕI TIẾN ĐỘ XỬ LÝ CÔNG VIỆC CỦA ĐƠN VỊ</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={progressDateRange.start}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={progressDateRange.end}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, end: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <ProgressChart />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;