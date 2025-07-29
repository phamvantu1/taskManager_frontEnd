import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BarChartStats from '../components/PieChartStats';
import { getAllTasks, getDashboardTasksByProject, getTaskDetailById } from '../api/taskApi';
import TaskListSection from '../components/TaskListSection';
import TaskDetailPopup from '../components/TaskDetailPopup';
import AddTaskPopup from '../components/AddTaskPopupProps';
import Profile from './Profile';

const TaskListPage = () => {
  const navigate = useNavigate();
  const [taskStats, setTaskStats] = useState<{ label: string; value: number }[]>([]);
  const [taskNumber, setTaskNumber] = useState(0);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [filters, setFilters] = useState({
    textSearch: '',
    startTime: '',
    endTime: '',
    status: null as string | null, 
  });
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [taskPage, setTaskPage] = useState(0);
  const [visibleTaskCount, setVisibleTaskCount] = useState(5);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDetailPopup, setShowTaskDetailPopup] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const fetchTaskDashboard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const rawStats = await getDashboardTasksByProject(token, undefined) as {
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
        projectId: undefined,
        status: filters.status !== null ? filters.status : undefined,
      });

      const newTasks = taskRes.data.content;
      const totalPages = taskRes.data.totalPages;

      setTasks(prev => (append ? [...prev, ...newTasks] : newTasks));
      setHasMoreTasks(pageToFetch < totalPages - 1);
      setTaskPage(pageToFetch);
    } catch (error) {
      console.error(error);
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
    }
  };

  const handleAddTask = (newTask: any) => {
    fetchTaskDashboard();
    fetchTasks(0, false); // Refresh task list after adding
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

  useEffect(() => {
    fetchTaskDashboard();
    fetchTasks(0, false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (visibleTaskCount < tasks.length) {
            setVisibleTaskCount(prev => prev + 5);
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Thống kê công việc</h2>
              <div className="mb-6">
                <BarChartStats data={taskStats} />
              </div>

            
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
                    projectId={undefined} // Thay thế bằng projectId nếu cần
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
          </div>
        )}
        {showTaskDetailPopup && selectedTask && (
          <TaskDetailPopup
            task={selectedTask}
            onClose={() => setShowTaskDetailPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskListPage;