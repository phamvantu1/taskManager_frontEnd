import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getDepartmentDetail} from '../api/departmentApi';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EditDepartmentPopup from '../components/EditDepartmentPopupProps';
import OverviewTab from '../components/OverviewTab';
import MembersTab from '../components/MembersTab';
import ProjectsTab from '../components/ProjectsTab';
import { getAllProjects } from '../api/projectApi';

interface Department {
  id: string;
  name: string;
  description: string;
  leaderName: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  numberOfUsers: number;
  numberOfProjects: number;
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Project {
  id: number;
  name: string | null;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  createdAt: string;
}

const DepartmentDetailPage = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams<{ departmentId: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [department, setDepartment] = useState<Department | null>(null);
  const [overviewData, setOverviewData] = useState<{ recentMembers: Member[]; ongoingProjects: Project[]; completedProjects: Project[] }>({
    recentMembers: [],
    ongoingProjects: [],
    completedProjects: [],
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        // Fetch department details
        const deptData = await getDepartmentDetail(departmentId || '1', token);
        setDepartment({ ...deptData, id: deptData.id.toString() });

        // Fetch overview data for Overview tab
        // const overview = await getDepartmentOverview(id || '1', token);
        // setOverviewData(overview);

        // // Fetch members for Members tab
        // const membersData = await getDepartmentMembers(id || '1', token);
        // setMembers(membersData);

        // Fetch projects for Projects tab
       
        const projectsData = await getAllProjects(Number(departmentId) || 1);

        setProjects(projectsData.content || []);
      } catch (err) {
        setError('Không thể tải dữ liệu phòng ban');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [departmentId]);

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
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      // TODO: Implement update API call
      // await updateDepartment(department?.id, data, token);
      setShowEditPopup(false);
      if (department) {
        setDepartment({ ...department, name: data.name, description: data.description });
      }
    } catch (err) {
      console.error('Error updating department:', err);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen justify-center items-center">Đang tải...</div>;
  }

  if (error || !department) {
    return <div className="flex min-h-screen justify-center items-center text-red-500">{error || 'Không tìm thấy phòng ban'}</div>;
  }

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
            <p className="mt-2 text-gray-600">Mô tả: {department.description}</p>
            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <span>
                👤 Người tạo:{' '}
                <a
                  href={`mailto:${department.createdByName.split('(')[1]?.replace(')', '')}`}
                  className="text-blue-600 hover:underline"
                >
                  {department.createdByName}
                </a>
              </span>
              <span>🕒 Tạo lúc: {department.createdAt}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditPopup(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              ✏️ Chỉnh sửa
            </button>
            {showEditPopup && (
              <EditDepartmentPopup
                onClose={() => setShowEditPopup(false)}
                onSubmit={handleEditDepartment}
                department={{
                  id: department.id,
                  name: department.name,
                  description: department.description,
                  leader_id: 0, // TODO: Replace with actual leader_id when available
                }}
              />
            )}
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              🗑️ Xóa
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <div className="text-2xl">📁</div>
            <div>
              <div className="text-xl font-semibold">{department.numberOfProjects}</div>
              <div className="text-gray-600">Dự án</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <div className="text-2xl">👥</div>
            <div>
              <div className="text-xl font-semibold">{department.numberOfUsers}</div>
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
          {activeTab === 'overview' && <OverviewTab department={department} members={overviewData.recentMembers} projects={overviewData.ongoingProjects.concat(overviewData.completedProjects)} />}
          {activeTab === 'members' && <MembersTab  departmentId={departmentId || '1'} />}
          {activeTab === 'projects' && <ProjectsTab projects={projects} />}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;