import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from '../pages/Profile';
import AddTaskPopup from '../components/AddTaskPopupProps';
import BarChartStats from '../components/PieChartStats';
import { projectApi, type ProjectDetail } from '../api/projectApi';
import { getAllTasks, getDashboardTasksByProject, getTaskDetailById } from '../api/taskApi';
import { getProjectMembersStats } from '../api/userApi';
import TaskDetailPopup from '../components/TaskDetailPopup';
import TaskListSection from '../components/TaskListSection';
import EditProjectPopup from '../components/EditProjectPopupProps'; 
import { toast } from 'react-toastify';

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);
  const [projectDetails, setProjectDetails] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskStats, setTaskStats] = useState<{ label: string; value: number }[]>([]);
  const [taskPage, setTaskPage] = useState(0);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [visibleTaskCount, setVisibleTaskCount] = useState(10);
  const [taskNumber, setTaskNumber] = useState(0);
  const [visibleMemberCount, setVisibleMemberCount] = useState(10);
  const [memberStats, setMemberStats] = useState<any[]>([]);
  const [memberPage, setMemberPage] = useState(0);
  const [hasMoreMembers, setHasMoreMembers] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDetailPopup, setShowTaskDetailPopup] = useState(false);
  const [filters, setFilters] = useState({
    textSearch: '',
    startTime: '',
    endTime: '',
    status: null, 
  });

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

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleAddTask = () => {
    fetchProject();
    fetchTaskDashboard();
    fetchMemberStats();
  };

  const handleUpdateProject = () => {
    fetchProject();
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;

    try {
      const response = await projectApi.deleteProject(Number(projectId));
      toast.success(response.data.message || 'Xóa dự án thành công!');
      navigate('/projects');
    } catch (err: any) {
      const message = err?.message || 'Xóa dự án thất bại. Vui lòng thử lại.';
      toast.error(message);
    }
  };

  const fetchMemberStats = async (pageToFetch = 0, append = false) => {
    try {
      const res = await getProjectMembersStats(Number(projectId), pageToFetch, 10, memberSearch);
      const content = res.content || [];
      const totalPages = res.totalPages || 0;

      setMemberStats((prev) => (append ? [...prev, ...content] : content));
      setHasMoreMembers(pageToFetch < totalPages - 1);
      setMemberPage(pageToFetch);
    } catch (err) {
      console.error('Lỗi khi fetch thống kê thành viên:', err);
      toast.error('Không thể tải thống kê thành viên');
    }
  };

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await projectApi.getProjectInfo(Number(projectId), token);
      setProjectDetails(res.data);

      const taskRes = await getAllTasks.getAllTasks(token, {
        page: 0,
        size: 10,
        textSearch: '',
        startTime: '',
        endTime: '',
        projectId: Number(projectId),
      });

      setTasks(taskRes.data.content);
    } catch (error) {
      console.error('Error fetching project details or tasks:', error);
      toast.error('Không thể tải thông tin dự án');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (pageToFetch = 0, append = false) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      setIsFetchingTasks(true);
      const taskRes = await getAllTasks.getAllTasks(token, {
        page: pageToFetch,
        size: 10,
        textSearch: filters.textSearch,
        startTime: filters.startTime,
        endTime: filters.endTime,
        projectId: Number(projectId),
        status: filters.status !== null ? filters.status : undefined, 
      });

      const newTasks = taskRes.data.content;
      const totalPages = taskRes.data.totalPages;

      setTasks((prev) => (append ? [...prev, ...newTasks] : newTasks));
      setHasMoreTasks(pageToFetch < totalPages - 1);
      setTaskPage(pageToFetch);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách công việc');
    } finally {
      setIsFetchingTasks(false);
    }
  };

  const handleTaskClick = async (taskId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const result = await getTaskDetailById(token, taskId) as { code: string; data: any };
      if (result.code === 'SUCCESS') {
        setSelectedTask(result.data);
        setShowTaskDetailPopup(true);
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết công việc:', error);
      toast.error('Không thể tải chi tiết công việc');
    }
  };

  const fetchTaskDashboard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token || !projectId) return;

      const rawStats = await getDashboardTasksByProject(token, Number(projectId)) as {
        data: {
          PROCESSING?: number;
          COMPLETED?: number;
          PENDING?: number;
          OVERDUE?: number;
          TOTAL?: number;
        };
      };

      const stats = rawStats.data;
      setTaskNumber(stats.TOTAL || 0);

      const mappedStats = [
        { label: 'Chưa bắt đầu', value: stats.PENDING || 0 },
        { label: 'Đang xử lý', value: stats.PROCESSING || 0 },
        { label: 'Hoàn thành', value: stats.COMPLETED || 0 },
        { label: 'Quá hạn', value: stats.OVERDUE || 0 },
      ];

      setTaskStats(mappedStats);
    } catch (err) {
      console.error('Lỗi khi fetch thống kê công việc:', err);
      toast.error('Không thể tải thống kê công việc');
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTaskDashboard();
    fetchMemberStats();
  }, [projectId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (visibleTaskCount < tasks.length) {
            setVisibleTaskCount((prev) => prev + 10);
          } else if (hasMoreTasks && !isFetchingTasks) {
            fetchTasks(taskPage + 1, true);
          }
        }
      },
      { threshold: 1 }
    );

    const sentinel = document.querySelector('#task-list-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [visibleTaskCount, tasks, hasMoreTasks, isFetchingTasks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (visibleMemberCount < memberStats.length) {
            setVisibleMemberCount((prev) => prev + 10);
          } else if (hasMoreMembers) {
            fetchMemberStats(memberPage + 1, true);
          }
        }
      },
      { threshold: 1 }
    );

    const sentinel = document.querySelector('#member-list-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [visibleMemberCount, memberStats, hasMoreMembers, memberPage]);

  useEffect(() => {
    setMemberPage(0);
    setVisibleMemberCount(10);
    fetchMemberStats(0, false);
  }, [memberSearch]);

  if (loading) return <div className="text-center text-gray-500 p-6">Đang tải...</div>;
  if (!projectDetails) return <div className="text-center text-red-500 p-6">Không tìm thấy thông tin dự án.</div>;

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
          <Profile onBack={handleBackToDashboard} />
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={() => navigate('/projects')}
                className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
              >
                <span>&larr;</span> Quay lại danh sách dự án
              </button>

              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{projectDetails.name}</h1>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      projectDetails.status === 'OVERDUE'
                        ? 'bg-red-100 text-red-800'
                        : projectDetails.status === 'DONE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {projectDetails.status}
                  </div>
                  <button
                    onClick={() => setShowEditProjectPopup(true)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              {/* Overview Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tổng quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Quản lý dự án</span>
                    <span className="text-gray-800">{projectDetails.ownerName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Phòng ban</span>
                    <span className="text-gray-800">{projectDetails.departmentName || 'Không có phòng ban'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Số lượng thành viên</span>
                    <span className="text-gray-800">{projectDetails.numberOfMembers}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Số lượng công việc</span>
                    <span className="text-gray-800">{projectDetails.numberOfTasks}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Ngày bắt đầu</span>
                    <span className="text-gray-800">{projectDetails.startDate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Ngày kết thúc</span>
                    <span className="text-gray-800">{projectDetails.endDate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">Mô tả</span>
                    <span className="text-gray-800">{projectDetails.description || 'Không có mô tả'}</span>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiến độ dự án</h2>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-700">Tiến độ</h3>
                  <span className="text-sm text-gray-500">{taskNumber} Công việc</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-500 h-4 rounded-full"
                    style={{ width: `${projectDetails.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Stats Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thống kê công việc</h2>
                <BarChartStats data={taskStats} />
              </div>

              {/* Task List Section */}
              <div className="mb-8">
                <TaskListSection
                  tasks={tasks}
                  filters={filters}
                  setFilters={setFilters}
                  onAddTaskClick={() => setShowAddTaskPopup(true)}
                  onTaskClick={handleTaskClick}
                  showAddTaskPopup={showAddTaskPopup}
                  AddTaskPopupComponent={
                    <AddTaskPopup
                      onClose={() => setShowAddTaskPopup(false)}
                      onSubmit={handleAddTask}
                      projectId={Number(projectId)}
                    />
                  }
                  taskNumber={taskNumber}
                  fetchTasks={fetchTasks}
                  taskPage={taskPage}
                  hasMoreTasks={hasMoreTasks}
                  isFetchingTasks={isFetchingTasks}
                />
                <div id="task-list-sentinel" className="h-1" />
              </div>

              {/* Member Stats Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thống kê theo thành viên</h2>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm thành viên..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      setMemberSearch(searchInput);
                      fetchMemberStats(0, false);
                    }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  >
                    Tìm
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 font-semibold text-gray-700">
                    <div>Thành viên</div>
                    <div>Tổng công việc</div>
                    <div>Hoàn thành</div>
                    <div>Trễ hạn</div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {memberStats.length > 0 ? (
                      <>
                        {memberStats.map((member, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200">
                            <div>{member.fullName || '---'}</div>
                            <div>{member.totalTasks}</div>
                            <div>{member.completedTasks}</div>
                            <div>{member.overdueTasks}</div>
                          </div>
                        ))}
                        <div id="member-list-sentinel" className="h-1" />
                        {hasMoreMembers && <div className="p-4 text-center text-gray-500">Đang tải thêm...</div>}
                      </>
                    ) : (
                      <div className="p-4 text-center text-gray-500">Không có dữ liệu thành viên</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {showTaskDetailPopup && selectedTask && (
              <TaskDetailPopup
                task={selectedTask}
                onClose={() => setShowTaskDetailPopup(false)}
              />
            )}
            {showEditProjectPopup && projectDetails && (
              <EditProjectPopup
                project={projectDetails}
                onClose={() => setShowEditProjectPopup(false)}
                onUpdateSuccess={handleUpdateProject}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;