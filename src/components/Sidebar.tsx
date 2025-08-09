import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="w-64 h-full bg-white shadow-lg flex flex-col border-r border-blue-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          <span className="text-xl font-bold text-blue-800">mobifone</span>
        </div>
      </div>



      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
          onClick={() => navigate('/dashboard')}
        >
          <span className="text-lg">📊</span>
          <span>Dashboard</span>
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
          onClick={() => navigate('/projects')}
        >
          <span className="text-lg">📁</span>
          <span>Dự án</span>
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
          onClick={() => navigate('/taskListPage')}
        >
          <span className="text-lg">📋</span>
          <span>Công việc</span>
        </div>

        {/* Dropdown Menu Item */}
        <div className="flex flex-col">
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <span className="text-lg">👤</span>
            <span>Quản trị</span>
            <span className={`ml-auto transition-transform duration-150 ${adminOpen ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </div>
          {adminOpen && (
            <div className="flex flex-col mt-1 ml-6 gap-1">
              <div
                className="px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
                onClick={() => navigate('/department')}
              >
                Phòng ban
              </div>
              <div
                className="px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
                onClick={() => navigate('/memberlistpage')}
              >
                Người dùng
              </div>
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-150 text-blue-700"
          onClick={() => navigate('/report')}
        >
          <span className="text-lg">📊</span>
          <span>Báo cáo</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;