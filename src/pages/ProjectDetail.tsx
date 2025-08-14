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
import ConfirmModal from '../components/ConfirmModal';
import MemberDetailPopup from '../components/MemberDetailPopup';

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
const [showMemberDetailPopup, setShowMemberDetailPopup] = useState(false);

  const [filters, setFilters] = useState({
    textSearch: '',
    startTime: '',
    endTime: '',
    status: null,
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };



  const handleBackToDashboard = () => {
    setShowProfile(false);
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

  // 3. Thêm hàm này để handle click member (sau các hàm khác):
const handleMemberClick = async (member: any) => {
  try {
    // Gọi API để lấy thông tin chi tiết member
    // const token = localStorage.getItem('access_token');
    // const memberDetail = await getMemberDetailApi(token, member.userId);
    
    // Tạm thời dùng mock data, bạn có thể thay bằng API call
    const mockMemberDetail = {
      ...member,
      email: "user@company.com",
      position: "Developer",
      avatar: null,
      department: {
        id: 1,
        name: "Phòng Công nghệ Thông tin",
        description: "Phát triển và bảo trì hệ thống công nghệ"
      },
      projects: [
        {
          id: Number(projectId),
          name: projectDetails?.name || "Dự án hiện tại",
          status: "PROCESSING",
          progress: 75,
          role: "Team Member",
          startDate: projectDetails?.startDate || "2024-01-15",
          endDate: projectDetails?.endDate || "2024-06-30"
        }
      ],
      tasks: [
        {
          id: 1,
          title: "Công việc mẫu 1",
          status: "OVERDUE",
          priority: "HIGH",
          dueDate: "2024-02-10",
          projectName: projectDetails?.name || "Dự án hiện tại",
          description: "Mô tả công việc mẫu"
        },
        {
          id: 2,
          title: "Công việc mẫu 2",
          status: "PROCESSING",
          priority: "MEDIUM",
          dueDate: "2024-02-20",
          projectName: projectDetails?.name || "Dự án hiện tại",
          description: "Mô tả công việc mẫu"
        }
      ],
      stats: {
        totalTasks: member.totalTasks || 0,
        completedTasks: member.completedTasks || 0,
        overdueTasks: member.overdueTasks || 0,
        processingTasks: (member.totalTasks || 0) - (member.completedTasks || 0) - (member.overdueTasks || 0)
      }
    };

    setSelectedMember(mockMemberDetail);
    setShowMemberDetailPopup(true);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thành viên:', error);
    toast.error('Không thể tải thông tin thành viên');
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
          WAIT_COMPLETED?: number;
        };
      };

      const stats = rawStats.data;
      setTaskNumber(stats.TOTAL || 0);

      const mappedStats = [
        { label: 'Quá hạn', value: stats.OVERDUE || 0 },
        { label: 'Chưa bắt đầu', value: stats.PENDING || 0 },
        { label: 'Đang xử lý', value: stats.PROCESSING || 0 },
        { label: 'Hoàn thành', value: stats.COMPLETED || 0 },
        { label: 'Chờ hoàn thành', value: stats.WAIT_COMPLETED || 0 },
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center text-gray-500 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p>Đang tải...</p>
      </div>
    </div>
  );

  if (!projectDetails) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center text-red-500 p-6">
        <p>Không tìm thấy thông tin dự án.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <div>
          <Header isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
          {/* Nội dung trang */}
        </div>

        {showProfile ? (
          <Profile/>
        ) : (
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              {/* Back Button */}
              <button
                onClick={() => navigate('/projects')}
                className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2 text-sm sm:text-base transition-colors duration-200"
              >
                <span>&larr;</span> Quay lại danh sách dự án
              </button>

              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">
                    {projectDetails.name}
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <div
                    className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap ${projectDetails.status === 'OVERDUE'
                      ? 'bg-red-100 text-red-800'
                      : projectDetails.status === 'DONE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {projectDetails.status}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditProjectPopup(true)}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-500 text-white text-xs sm:text-sm rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setIsConfirmOpen(true)}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white text-xs sm:text-sm rounded-lg hover:bg-red-600 transition-colors duration-150"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>

              {/* Overview Section */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Tổng quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Quản lý dự án</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800 break-words">{projectDetails.ownerName}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Phòng ban</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800 break-words">
                      {projectDetails.departmentName || 'Không có phòng ban'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Số lượng thành viên</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800">{projectDetails.numberOfMembers}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Số lượng công việc</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800">{projectDetails.numberOfTasks}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Ngày bắt đầu</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800">{projectDetails.startDate}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Ngày kết thúc</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800">{projectDetails.endDate}</span>
                  </div>
                  <div className="flex flex-col space-y-1 sm:col-span-2 lg:col-span-3 xl:col-span-2">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">Mô tả</span>
                    <span className="text-sm sm:text-base font-normal text-gray-800 break-words">
                      {projectDetails.description || 'Không có mô tả'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-6 sm:mb-8">

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700">Tiến độ dự án</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-indigo-600">
                        {projectDetails.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${projectDetails.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Task Stats Section */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Thống kê công việc</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <BarChartStats data={taskStats} />
                </div>
              </div>

              {/* Task List Section */}
              <div className="mb-6 sm:mb-8">
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Thống kê theo thành viên</h2>

                {/* Search Section */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm thành viên..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                  <button
                    onClick={() => {
                      setMemberSearch(searchInput);
                      fetchMemberStats(0, false);
                    }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-150 text-sm sm:text-base font-medium sm:whitespace-nowrap"
                  >
                    Tìm kiếm
                  </button>
                </div>

                {/* Member Stats Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Desktop Table Header */}
                  <div className="hidden sm:grid sm:grid-cols-4 gap-4 bg-gradient-to-r from-gray-50 to-blue-50 p-4 font-semibold text-gray-700">
                    <div>Thành viên</div>
                    <div className="text-center">Tổng công việc</div>
                    <div className="text-center">Hoàn thành</div>
                    <div className="text-center">Trễ hạn</div>
                  </div>

                  {/* Table Content */}
                  <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                    {memberStats.length > 0 ? (
                      <>
                        {memberStats.slice(0, visibleMemberCount).map((member, index) => (
                          <div key={index} className="border-b border-gray-200 last:border-b-0">
                            {/* Mobile Card Layout */}
                            <div className="sm:hidden p-4 space-y-3">
                              <div 
    className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors duration-200"
    onClick={() => handleMemberClick(member)}
  >
                                {member.fullName || '---'}
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-gray-500 text-xs">Tổng</div>
                                  <div className="font-semibold">{member.totalTasks}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-500 text-xs">Hoàn thành</div>
                                  <div className="font-semibold text-green-600">{member.completedTasks}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-gray-500 text-xs">Trễ hạn</div>
                                  <div className="font-semibold text-red-600">{member.overdueTasks}</div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Row Layout */}
                            <div className="hidden sm:grid sm:grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors duration-150">
<div 
    className="font-medium text-gray-900 truncate cursor-pointer hover:text-indigo-600 transition-colors duration-200"
    onClick={() => handleMemberClick(member)}
  >                                {member.fullName || '---'}
                              </div>
                              <div className="text-center font-semibold">{member.totalTasks}</div>
                              <div className="text-center font-semibold text-green-600">{member.completedTasks}</div>
                              <div className="text-center font-semibold text-red-600">{member.overdueTasks}</div>
                            </div>
                          </div>
                        ))}
                        <div id="member-list-sentinel" className="h-1" />
                        {hasMoreMembers && (
                          <div className="p-4 text-center text-gray-500">
                            <div className="animate-pulse">Đang tải thêm...</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <div className="text-gray-400 mb-2">📊</div>
                        <p>Không có dữ liệu thành viên</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modals */}
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

            <ConfirmModal
              isOpen={isConfirmOpen}
              onConfirm={() => {
                handleDeleteProject();
                setIsConfirmOpen(false);
              }}
              onCancel={() => setIsConfirmOpen(false)}
              title="Xác nhận xóa dự án"
              message="Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác."
            />
          </div>
        )}
        {showMemberDetailPopup && selectedMember && (
  <MemberDetailPopup
    member={selectedMember}
    onClose={() => {
      setShowMemberDetailPopup(false);
      setSelectedMember(null);
    }}
  />
)}
      </div>
    </div>
  );
};

export default ProjectDetail;