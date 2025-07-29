import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartmentDetail, getDepartmentDashboard, deleteDepartment } from '../api/departmentApi';
import { getAllProjects } from '../api/projectApi';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EditDepartmentPopup from '../components/EditDepartmentPopupProps';
import OverviewTab from '../components/OverviewTab';
import MembersTab from '../components/MembersTab';
import ProjectsTab from '../components/ProjectsTab';
import { toast } from 'react-toastify';
import Profile from '../pages/Profile';

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
  role?: string;
  avatar?: string;
}

export interface Project {
  id: number;
  name: string | null;
  description?: string | null;
  startTime?: string;
  endTime?: string;
  status?: string;
  type?: string;
  createdAt?: string;
}

const DepartmentDetailPage = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams<{ departmentId: string }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [department, setDepartment] = useState<Department | null>(null);
  const [overviewData, setOverviewData] = useState<{
    recentMembers: Member[];
    ongoingProjects: Project[];
    completedProjects: Project[];
  }>({
    recentMembers: [],
    ongoingProjects: [],
    completedProjects: [],
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => localStorage.getItem('access_token') || '';

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn vị này?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await deleteDepartment(departmentId || '', token);

      if (response.code === 'SUCCESS') {
        toast.success('Xóa đơn vị thành công');
        navigate('/department');
      } else {
        toast.error(response.message || 'Có lỗi khi xóa đơn vị');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi xóa đơn vị';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch department details
      const deptData = await getDepartmentDetail(departmentId || '1', token);
      setDepartment({ ...deptData, id: deptData.id.toString() });

      // Fetch dashboard data for Overview tab
      const dashboardData = await getDepartmentDashboard(departmentId || '1', token);
      setOverviewData({
        recentMembers: dashboardData.listNewUsers.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: '',
          avatar: '',
        })),
        ongoingProjects: dashboardData.listProjectsInProgress.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description ?? '',
          startTime: '',
          endTime: '',
          status: 'In Progress',
          type: '',
          createdAt: '',
        })),
        completedProjects: dashboardData.listProjectsCompleted.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description ?? '',
          startTime: '',
          endTime: project.completedDate || '',
          status: 'Completed',
          type: '',
          createdAt: '',
        })),
      });

      // Fetch projects for Projects tab with pagination
      const projectsData = await getAllProjects(currentPage, pageSize, Number(departmentId));
      setProjects(
        (projectsData.content || []).map((project: any) => ({
          ...project,
          description: project.description ?? '',
        }))
      );
      setTotalPages(projectsData.totalPages || 0);
    } catch (err) {
      setError('Không thể tải dữ liệu phòng ban');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [departmentId, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

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
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }
      // TODO: Implement update API call
      // await updateDepartment(department?.id, data, token);
      setShowEditPopup(false);
      if (department) {
        setDepartment({ ...department, name: data.name, description: data.description });
      }
      toast.success('Cập nhật đơn vị thành công');
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || 'Cập nhật đơn vị thất bại';
      toast.error(errorMessage);
      console.error('Error updating department:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center text-gray-500">
          <svg className="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
          </svg>
          <span className="ml-2">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 text-red-500">
        {error || 'Không tìm thấy phòng ban'}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header
          onProfileClick={handleProfile}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
        {showProfile ? (
          <Profile onBack={() => setShowProfile(false)} />
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Breadcrumb */}
              <div className="mb-6 text-sm text-gray-600">
                <span
                  onClick={handleBackToDepartments}
                  className="cursor-pointer text-indigo-600 hover:underline"
                >
                  Danh sách đơn vị
                </span>
                <span className="mx-2">/</span>
                <span className="text-gray-800">{department.name}</span>
              </div>

              {/* Department Header */}
              <div className="mb-8 flex justify-between items-start border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                  <p className="mt-2 text-gray-600">Mô tả: {department.description}</p>
                  <div className="mt-3 flex gap-4 text-sm text-gray-600">
                    <span>
                      👤 Người tạo:{' '}
                      <a
                        href={`mailto:${department.createdByName.split('(')[1]?.replace(')', '')}`}
                        className="text-indigo-600 hover:underline"
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
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors duration-150"
                  >
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
                    className={`px-4 py-2 -mb-px ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-indigo-500 text-indigo-500'
                        : 'text-gray-600 hover:text-indigo-500'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Tổng quan
                  </button>
                  <button
                    className={`px-4 py-2 -mb-px ${
                      activeTab === 'members'
                        ? 'border-b-2 border-indigo-500 text-indigo-500'
                        : 'text-gray-600 hover:text-indigo-500'
                    }`}
                    onClick={() => setActiveTab('members')}
                  >
                    Thành viên
                  </button>
                  <button
                    className={`px-4 py-2 -mb-px ${
                      activeTab === 'projects'
                        ? 'border-b-2 border-indigo-500 text-indigo-500'
                        : 'text-gray-600 hover:text-indigo-500'
                    }`}
                    onClick={() => setActiveTab('projects')}
                  >
                    Dự án
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'overview' && (
                  <OverviewTab
                    members={overviewData.recentMembers}
                    projects={overviewData.ongoingProjects.concat(overviewData.completedProjects)}
                  />
                )}
                {activeTab === 'members' && <MembersTab departmentId={departmentId || '1'} />}
                {activeTab === 'projects' && (
                  <ProjectsTab
                    projects={projects.map((p) => ({
                      id: p.id,
                      name: p.name ?? '',
                      description: p.description ?? '',
                      startTime: p.startTime ?? '',
                      endTime: p.endTime ?? '',
                      status: p.status ?? '',
                      type: p.type ?? '',
                      createdAt: p.createdAt ?? '',
                    }))}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetailPage;