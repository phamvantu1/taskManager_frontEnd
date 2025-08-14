import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BaseDoughnutChart from '../components/BaseDoughnutChart';
import BaseBarChart from '../components/BaseBarChart';
import BaseLineChart from '../components/BaseLineChart'; // New import
import BasePieChart from '../components/BasePieChart'; // New import
import BaseRadarChart from '../components/BaseRadarChart'; // New import
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
  const [projectStatusDateRange, setProjectStatusDateRange] = useState({ start: '', end: '' });
  const [workProgressDateRange, setWorkProgressDateRange] = useState({ start: '', end: '' });
  const [progressDateRange, setProgressDateRange] = useState({ start: '', end: '' });
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
      setError('Không thể tải dữ liệu biểu đồ dự án');
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
      setError('Không thể tải dữ liệu biểu đồ công việc');
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
      setError('Không thể tải danh sách dự án');
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
      setError('Không thể tải danh sách phòng ban');
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
      setError('Không thể tải dữ liệu thống kê');
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

  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  // Hard-coded data for new Line Chart (e.g., Revenue over months)
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
  };

  // Hard-coded data for new Pie Chart (e.g., Budget Allocation)
  const pieChartData = {
    labels: ['Marketing', 'Development', 'Operations', 'HR'],
    datasets: [
      {
        data: [300, 500, 200, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Hard-coded data for new Radar Chart (e.g., Team Skills)
  const radarChartData = {
    labels: ['Coding', 'Design', 'Communication', 'Leadership', 'Problem Solving'],
    datasets: [
      {
        label: 'Team A',
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(179,181,198,0.2)',
        borderColor: 'rgba(179,181,198,1)',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(179,181,198,1)',
      },
      {
        label: 'Team B',
        data: [28, 48, 40, 19, 96],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  const radarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Team Skills Comparison',
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
      <Header isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />

        {showProfile ? (
          <Profile/>
        ) : (
          <div className="p-4 sm:p-6 md:p-8">
            {/* Department Selector */}
            <div className="mb-6 sm:mb-8">
              {loading ? (
                <p className="text-sm sm:text-base text-gray-500">Đang tải đơn vị...</p>
              ) : error ? (
                <p className="text-sm sm:text-base text-red-500">{error}</p>
              ) : (
                <select
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {loading ? (
                <p className="text-sm sm:text-base text-gray-500">Đang tải thống kê...</p>
              ) : error ? (
                <p className="text-sm sm:text-base text-red-500">{error}</p>
              ) : (
                statsData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className="text-sm sm:text-base font-semibold text-gray-600">{stat.title}</span>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color }}>
                        <span className="text-lg sm:text-xl">{stat.icon}</span>
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-500 whitespace-pre-line">{stat.subtitle}</div>
                  </div>
                ))
              )}
            </div>

            {/* Existing Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Project Status Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">TRẠNG THÁI DỰ ÁN CỦA ĐƠN VỊ</h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-md justify-center">
                  <input
                    type="date"
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    value={projectStatusDateRange.start}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    value={projectStatusDateRange.end}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, end: e.target.value })}
                  />
                  <button
                    onClick={handleProjectSearch}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150 text-sm sm:text-base"
                  >
                    Tìm kiếm
                  </button>
                </div>
                <div className="flex justify-center w-full max-w-[300px] sm:max-w-[350px]">
                  <BaseDoughnutChart data={chartData} options={chartOptions} width={300} height={300} />
                </div>
              </div>

              {/* Task Status Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">TRẠNG THÁI CÔNG VIỆC CỦA TỪNG DỰ ÁN</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6 w-full max-w-xs sm:max-w-sm md:max-w-md justify-center flex-wrap">
                  {loading ? (
                    <p className="text-sm sm:text-base text-gray-500">Đang tải dự án...</p>
                  ) : error ? (
                    <p className="text-sm sm:text-base text-red-500">{error}</p>
                  ) : (
                    <select
                      className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
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
                    className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    value={workProgressDateRange.start}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    value={workProgressDateRange.end}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, end: e.target.value })}
                  />
                  <button
                    onClick={handleTaskSearch}
                    className="w-full sm:w-28 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150 text-sm sm:text-base"
                  >
                    Tìm kiếm
                  </button>
                </div>
                <div className="w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
                  <BaseBarChart data={chartDataCot} options={chartOptionsCot} />
                </div>
              </div>
            </div>

            {/* New Supplementary Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Line Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">TIẾN ĐỘ DỰ ÁN THEO THÁNG</h3>
                <div className="w-full max-w-[400px] h-[300px]">
                  <BaseLineChart data={lineChartData} options={lineChartOptions} />
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">PHÂN BỔ NHÂN SỰ</h3>
                <div className="flex justify-center w-full max-w-[300px]">
                  <BasePieChart data={pieChartData} options={pieChartOptions} width={300} height={300} />
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">SO SÁNH KỸ NĂNG ĐỘI NHÓM</h3>
                <div className="w-full max-w-[400px] h-[400px]">
                  <BaseRadarChart data={radarChartData} options={radarChartOptions} />
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">THEO DÕI TIẾN ĐỘ XỬ LÝ CÔNG VIỆC CỦA ĐƠN VỊ</h3>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 sm:mt-0">
                  <input
                    type="date"
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    value={progressDateRange.start}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                    value={progressDateRange.end}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, end: e.target.value })}
                  />
                  <button
                    onClick={handleSearchProgress}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150 text-sm sm:text-base"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
              <div className="w-full">
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