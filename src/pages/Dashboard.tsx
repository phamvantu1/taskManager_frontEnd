import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BaseDoughnutChart from '../components/BaseDoughnutChart';
import BaseBarChart from '../components/BaseBarChart';
import ProgressChart from '../components/ProgressChart';
import { getDepartments } from '../api/departmentApi';
import { getDashboardOverview, getDashboardProjects, getDashboardTasks, type ProjectChartData, type TaskChartData } from '../api/dashboardApi';
import { getAllProjects, type Project } from '../api/projectApi';

interface Department {
  id: number;
  name: string;
  description: string;
  leaderName: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  numberOfUsers: number;
  numberOfProjects: number;
}

interface Stat {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('Tất cả đơn vị');
  const [selectedProject, setSelectedProject] = useState('Tất cả dự án');
  const [projectStatusDateRange, setProjectStatusDateRange] = useState({ start: '2025-01-01', end: '2025-12-31' });
  const [workProgressDateRange, setWorkProgressDateRange] = useState({ start: '2025-01-01', end: '2025-12-31' });
  const [progressDateRange, setProgressDateRange] = useState({ start: '2025-01-01', end: '2025-12-31' });
  const [departments, setDepartments] = useState<import("../api/departmentApi").Department[]>([]);
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectChartData, setProjectChartData] = useState<ProjectChartData | null>(null);
  const [taskChartData, setTaskChartData] = useState<TaskChartData | null>(null);
  const progressChartRef = useRef<{ fetchData: (page: number) => void }>(null);

  const fetchProjectChartData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        throw new Error('No access token found');
      }

      let departmentId: string | null = null;
      if (selectedUnit !== 'Tất cả đơn vị') {
        const department = departments.find((d) => d.name === selectedUnit);
        if (!department) {
          throw new Error('Selected department not found');
        }
        departmentId = department.id.toString();
      }

      const data = await getDashboardProjects(
        departmentId,
        projectStatusDateRange.start || null,
        projectStatusDateRange.end || null,
        token
      );
      setProjectChartData(data);
    } catch (err) {
      setError('Failed to fetch project chart data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskChartData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        throw new Error('No access token found');
      }

      let departmentId: string | null = null;
      let projectId: string | null = null;
      if (selectedUnit !== 'Tất cả đơn vị') {
        const department = departments.find((d) => d.name === selectedUnit);
        if (!department) {
          throw new Error('Selected department not found');
        }
        departmentId = department.id.toString();
      }
      if (selectedProject !== 'Tất cả dự án') {
        const project = projects.find((p) => p.name === selectedProject);
        if (!project) {
          throw new Error('Selected project not found');
        }
        projectId = project.id.toString();
      }

      const data = await getDashboardTasks(
        departmentId,
        projectId,
        workProgressDateRange.start || null,
        workProgressDateRange.end || null,
        token
      );
      setTaskChartData(data);
    } catch (err) {
      setError('Failed to fetch task chart data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchProgress = () => {
    if (progressChartRef.current) {
      progressChartRef.current.fetchData(1); // Reset to first page
    }
  };

  const fetchProjects = async (departmentId: string | null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        throw new Error('No access token found');
      }
      const projectData = await getAllProjects(0, 100, departmentId ? parseInt(departmentId) : undefined);
      setProjects(projectData.content || []);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentId = () => {
    const department = departments.find((d) => d.name === selectedUnit);
    return department ? department.id.toString() : null;
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        throw new Error('No access token found');
      }
      const departmentData = await getDepartments(token, 0, 100);
      setDepartments(departmentData.content || []);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (!token) {
        throw new Error('No access token found');
      }

      let departmentId: string | null = null;
      if (selectedUnit !== 'Tất cả đơn vị') {
        const department = departments.find((d) => d.name === selectedUnit);
        if (!department) {
          throw new Error('Selected department not found');
        }
        departmentId = department.id.toString();
      }

      const response = await getDashboardOverview(departmentId, token);

      const apiData = response;
      const mappedData: Stat[] = apiData.map((item: any, index: number) => ({
        title: item.title,
        value: item.value,
        subtitle: item.subtitle,
        icon: ['👥', '💼', '📋'][index % 3],
        color: ['#ef4444', '#f97316', '#10b981'][index % 3],
      }));
      setStatsData(mappedData);
    } catch (err) {
      setError('Failed to fetch stats data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSearch = () => {
    fetchProjectChartData();
  };

  const handleTaskSearch = () => {
    fetchTaskChartData();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
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

  const handleBackToDashboard = () => {
    setShowProfile(false);
  };

  const chartData = {
    labels: ['Đã hoàn thành', 'Đang xử lý', 'Chưa xử lý', 'Quá hạn'],
    datasets: [
      {
        label: 'Số lượng dự án',
        data: projectChartData
          ? [projectChartData.completed, projectChartData.inProgress, projectChartData.pending, projectChartData.overdue]
          : [0, 0, 0, 0],
          backgroundColor: ['#4CAF50', '#FFEB3B', '#2196F3', '#F44336'],
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
        data: taskChartData
          ? [taskChartData.pending, taskChartData.inProgress, taskChartData.completed, taskChartData.overdue]
          : [0, 0, 0, 0],
          backgroundColor: ['#2196F3', '#FFEB3B', '#4CAF50', '#F44336'],

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

  useEffect(() => {
    fetchDepartments();
    fetchStatsData();
    fetchProjects(null);
    fetchProjectChartData();
    fetchTaskChartData();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      fetchStatsData();
      fetchProjects(null);
      fetchProjectChartData();
      fetchTaskChartData();
    }
  }, [selectedUnit]);

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
            {/* Department Selector */}
            <div className="mb-6">
              {loading ? (
                <p className="text-gray-500">Đang tải đơn vị...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                >
                  <option value="Tất cả đơn vị">Tất cả đơn vị</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {loading ? (
                <p className="text-gray-500">Đang tải thống kê...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                statsData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-600">{stat.title}</span>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                        <span className="text-xl">{stat.icon}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-500 whitespace-pre-line">{stat.subtitle}</div>
                  </div>
                ))
              )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Project Status Chart */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">TRẠNG THÁI DỰ ÁN CỦA ĐƠN VỊ</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full justify-center">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={projectStatusDateRange.start}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={projectStatusDateRange.end}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, end: e.target.value })}
                  />
                  <button
                    onClick={handleProjectSearch}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  >
                    Tìm kiếm
                  </button>
                </div>
                <div className="flex justify-center">
                  <BaseDoughnutChart data={chartData} options={chartOptions} width={300} height={300} />
                </div>
              </div>

              {/* Task Status Chart */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">TRẠNG THÁI CÔNG VIỆC CỦA TỪNG DỰ ÁN</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full justify-center">
                  {loading ? (
                    <p className="text-gray-500">Đang tải dự án...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <select
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="Tất cả dự án">Tất cả dự án</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.name ?? ''}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={workProgressDateRange.start}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={workProgressDateRange.end}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, end: e.target.value })}
                  />
                  <button
                    onClick={handleTaskSearch}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  >
                    Tìm kiếm
                  </button>
                </div>
                <div className="flex justify-center">
                  <BaseBarChart data={chartDataCot} options={chartOptionsCot} width={700} height={400} />
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">THEO DÕI TIẾN ĐỘ XỬ LÝ CÔNG VIỆC CỦA ĐƠN VỊ</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={progressDateRange.start}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={progressDateRange.end}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, end: e.target.value })}
                  />
                  <button
                    onClick={handleSearchProgress}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-150"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
              <div>
                <ProgressChart
                  ref={progressChartRef}
                  departmentId={getDepartmentId()}
                  progressDateRange={progressDateRange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;