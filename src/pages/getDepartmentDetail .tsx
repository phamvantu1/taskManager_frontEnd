import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Mock data - trong thực tế sẽ fetch từ API dựa trên ID
const getDepartmentDetail = (id: string) => {
  const departments = [
    {
      id: '1',
      name: 'Đơn Vị A',
      createdBy: 'tham.tranthi@mobifone.vn',
      createdAt: '20/06/2022 00:00',
      description: 'Đơn vị chuyên trách về phát triển sản phẩm và dịch vụ mới của công ty.',
      teams: 3,
      projects: 12,
      members: [
        { id: 1, name: 'Hoàng Văn A', email: 'hoang.a@mobifone.vn', role: 'Trưởng phòng', avatar: 'H' },
        { id: 2, name: 'Nguyễn Thị B', email: 'nguyen.b@mobifone.vn', role: 'Phó phòng', avatar: 'N' },
        { id: 3, name: 'Trần Văn C', email: 'tran.c@mobifone.vn', role: 'Nhân viên', avatar: 'T' },
        { id: 4, name: 'Lê Thị D', email: 'le.d@mobifone.vn', role: 'Nhân viên', avatar: 'L' },
      ],
      projects_list: [
        { id: 1, name: 'Dự án A', status: 'Đang thực hiện', progress: 75 },
        { id: 2, name: 'Dự án B', status: 'Hoàn thành', progress: 100, completedDate: '25/12/2024' },
        { id: 3, name: 'Dự án C', status: 'Lên kế hoạch', progress: 25 },
        { id: 4, name: 'Dự án D', status: 'Hoàn thành', progress: 100, completedDate: '15/11/2024' },
      ]
    },
    {
      id: '2',
      name: 'Phòng A kv3',
      createdBy: 'tham.tranthi@mobifone.vn',
      createdAt: '04/08/2022 10:53',
      description: 'Phòng ban khu vực 3 chuyên trách về vận hành và bảo trì hệ thống.',
      teams: 2,
      projects: 8,
      members: [
        { id: 1, name: 'Phạm Văn E', email: 'pham.e@mobifone.vn', role: 'Trưởng phòng', avatar: 'P' },
        { id: 2, name: 'Võ Thị F', email: 'vo.f@mobifone.vn', role: 'Nhân viên', avatar: 'V' },
      ],
      projects_list: [
        { id: 1, name: 'Bảo trì hệ thống', status: 'Đang thực hiện', progress: 60 },
        { id: 2, name: 'Nâng cấp thiết bị', status: 'Lên kế hoạch', progress: 10 },
      ]
    }
  ];

  return departments.find(dept => dept.id === id) || departments[0];
};

const DepartmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const department = getDepartmentDetail(id || '1');

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

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleBackToDepartments = () => {
    navigate('/department');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-500';
      case 'Đang thực hiện': return 'bg-blue-500';
      case 'Lên kế hoạch': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />

        {/* Breadcrumb */}
        {/* Breadcrumb */}
        <div className="mt-8 mb-6 text-sm text-gray-600">
          <span
            onClick={handleBackToDepartments}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Danh sách đơn vị
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{department.name}</span>
        </div>


        {/* Department Header */}
        <div className="mb-8 flex justify-between items-start border border-white rounded-lg p-4 bg-gray-50">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
            <p className="mt-2 text-gray-600">{department.description}</p>
            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <span>
                👤 Người tạo: <a href={`mailto:${department.createdBy}`} className="text-blue-600 hover:underline">{department.createdBy}</a>
              </span>
              <span>🕒 Tạo lúc: {department.createdAt}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">✏️ Chỉnh sửa</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">🗑️ Xóa</button>
          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <div className="text-2xl">📁</div>
            <div>
              <div className="text-xl font-semibold">{department.projects}</div>
              <div className="text-gray-600">Dự án</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <div className="text-2xl">👥</div>
            <div>
              <div className="text-xl font-semibold">{department.members.length}</div>
              <div className="text-gray-600">Thành viên</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 -mb-px ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button
              className={`px-4 py-2 -mb-px ${activeTab === 'members' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('members')}
            >
              Thành viên
            </button>
            <button
              className={`px-4 py-2 -mb-px ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('projects')}
            >
              Dự án
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Thành viên mới tham gia</h3>
                <div className="space-y-4">
                  {department.members.slice(0, 3).map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Dự án đang thực hiện</h3>
                <div className="space-y-4">
                  {department.projects_list.filter(p => p.status === 'Đang thực hiện').map(project => (
                    <div key={project.id} className="space-y-2">
                      <div className="font-medium">{project.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Dự án hoàn thành</h3>
                <div className="space-y-4">
                  {department.projects_list.filter(p => p.status === 'Hoàn thành').length > 0 ? (
                    department.projects_list.filter(p => p.status === 'Hoàn thành').map(project => (
                      <div key={project.id} className="space-y-2">
                        <div className="font-medium">{project.name}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-emerald-500">✅ Hoàn thành</span>
                          <span className="text-gray-600">{project.completedDate || '25/12/2024'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-600">
                      <div className="text-2xl mb-2">📋</div>
                      <div>Chưa có dự án hoàn thành</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Danh sách thành viên ({department.members.length})</h3>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  + Thêm thành viên
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded-t-md font-semibold text-gray-700">
                  <div>Tên</div>
                  <div>Email</div>
                  <div>Vai trò</div>
                  <div>Thao tác</div>
                </div>
                {department.members.map(member => (
                  <div key={member.id} className="grid grid-cols-4 gap-4 p-3 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {member.avatar}
                      </div>
                      {member.name}
                    </div>
                    <div>{member.email}</div>
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">{member.role}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">✏️</button>
                      <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Danh sách dự án ({department.projects_list.length})</h3>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  + Tạo dự án
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.projects_list.map(project => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{project.name}</h4>
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Tiến độ: {project.progress}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;