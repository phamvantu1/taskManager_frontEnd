import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EditDepartmentPopup from '../components/EditDepartmentPopupProps';
import OverviewTab from '../components/OverviewTab';
import MembersTab from '../components/MembersTab';
import ProjectsTab from '../components/ProjectsTab';

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
  const [showEditPopup, setShowEditPopup] = useState(false);

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

  const handleEditDepartment = async (data: { name: string; description: string; leader_id: number }) => {
    // Call your API to update the department
    // e.g., await updateDepartment(department.id, data, token);
    setShowEditPopup(false);
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
            <button onClick={() => setShowEditPopup(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">✏️ Chỉnh sửa</button>
            {showEditPopup && (
              <EditDepartmentPopup
                onClose={() => setShowEditPopup(false)}
                onSubmit={handleEditDepartment}
                department={{ id: department.id, name: department.name, description: department.description, leader_id: Number(department.createdBy) }}
              />
            )}
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
          {activeTab === 'overview' && <OverviewTab department={department} />}
          {activeTab === 'members' && <MembersTab members={department.members} />}
          {activeTab === 'projects' && <ProjectsTab projects={department.projects_list} />}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;