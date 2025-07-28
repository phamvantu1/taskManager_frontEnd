import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [projectStatusDateRange, setProjectStatusDateRange] = useState({ start: '2025-07-01', end: '2025-07-31' });
  const [workProgressDateRange, setWorkProgressDateRange] = useState({ start: '2025-12-21', end: '2026-01-20' });
  const [progressDateRange, setProgressDateRange] = useState({ start: '2025-12-21', end: '2026-01-20' });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectChartData, setProjectChartData] = useState<ProjectChartData | null>(null);
  const [taskChartData, setTaskChartData] = useState<TaskChartData | null>(null);



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

      // Xử lý logic cho "Tất cả đơn vị"
      let departmentId: string | null = null;
      if (selectedUnit !== 'Tất cả đơn vị') {
        const department = departments.find((d) => d.name === selectedUnit);
        if (!department) {
          throw new Error('Selected department not found');
        }
        departmentId = department.id.toString();
      }

      // Gọi API (nếu departmentId = null thì vẫn truyền, tuỳ backend xử lý)
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
    labels: ['Đã hoàn thành', 'Đang xử lý', 'Chưa bắt đầu', 'Quá hạn'],
    datasets: [
      {
        label: 'Tiến độ dự án',
        data: projectChartData
          ? [projectChartData.completed, projectChartData.inProgress, projectChartData.pending, projectChartData.overdue]
          : [0, 0, 0, 0],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#FF4444'],
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
        backgroundColor: '#42a5f5',
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
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      let departmentId: string | null;
      if (selectedUnit === 'Tất cả đơn vị') {
        departmentId = null;
      } else {
        const department = departments.find((d) => d.name === selectedUnit);
        departmentId = department ? department.id.toString() : null;
      }
      fetchProjects(departmentId);
      fetchStatsData();
      fetchProjectChartData();
      fetchTaskChartData();
    }
  }, [selectedUnit, departments]);

  useEffect(() => {
    if (departments.length > 0 && projects.length > 0) {
      fetchTaskChartData();
    }
  }, [selectedProject, workProgressDateRange, departments, projects]);

  useEffect(() => {
    if (departments.length > 0) {
      fetchProjectChartData();
    }
  }, [projectStatusDateRange, departments]);


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
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
            <div className="mb-6">
              {loading ? (
                <p>Loading departments...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <select
                  className="border rounded-lg px-3 py-2 bg-white"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {loading ? (
                <p>Loading stats...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                statsData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">TRẠNG THÁI DỰ ÁN CỦA ĐƠN VỊ</h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={projectStatusDateRange.start}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={projectStatusDateRange.end}
                    onChange={(e) => setProjectStatusDateRange({ ...projectStatusDateRange, end: e.target.value })}
                  />
                </div>
                <div className="flex justify-center">
                  <BaseDoughnutChart data={chartData} options={chartOptions} width={300} height={300} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center relative">
                <h3 className="text-lg font-semibold mb-4">TRẠNG THÁI CÔNG VIỆC CỦA TỪNG DỰ ÁN</h3>
                <div className="flex gap-4 mb-4">
                  <select
                    className="border rounded-lg px-3 py-2 bg-white"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option>Tất cả dự án</option>
                    <option>Dự án A</option>
                    <option>Dự án B</option>
                    <option>Dự án C</option>
                    <option>Dự án D</option>
                  </select>
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={workProgressDateRange.start}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={workProgressDateRange.end}
                    onChange={(e) => setWorkProgressDateRange({ ...workProgressDateRange, end: e.target.value })}
                  />
                </div>
                <div className="flex justify-center">
                  <BaseBarChart data={chartDataCot} options={chartOptionsCot} width={700} height={400} />
                </div>

              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">THEO DÕI TIẾN ĐỘ XỬ LÝ CÔNG VIỆC CỦA ĐƠN VỊ</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={progressDateRange.start}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, start: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border rounded-lg px-3 py-2"
                    value={progressDateRange.end}
                    onChange={(e) => setProgressDateRange({ ...progressDateRange, end: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <ProgressChart />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;