import axios from 'axios';

const DASHBOARD_URL = 'http://localhost:8080/api/v1/dashboard';

export interface Stat {
  title: string;
  value: number;
  subtitle: string;
}

export interface ProjectChartData {
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
}

export interface TaskChartData {
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export const getDashboardOverview = async (departmentId: string | null, token: string): Promise<Stat[]> => {
  const response = await axios.get<ApiResponse<Stat[]>>(`${DASHBOARD_URL}/get-overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*',
    },
    params: {
      departmentId: departmentId || undefined,
    },
  });
  return response.data.data;
};

export const getDashboardProjects = async (
  departmentId: string | null,
  startTime: string | null,
  endTime: string | null,
  token: string
): Promise<ProjectChartData> => {
  const response = await axios.get<ApiResponse<ProjectChartData>>(`${DASHBOARD_URL}/get-dashboard-projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*',
    },
    params: {
      departmentId: departmentId || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    },
  });
  return response.data.data;
};

export const getDashboardTasks = async (
  departmentId: string | null,
  projectId: string | null,
  startTime: string | null,
  endTime: string | null,
  token: string
): Promise<TaskChartData> => {
  const response = await axios.get<ApiResponse<TaskChartData>>(`${DASHBOARD_URL}/get-dashboard-tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*',
    },
    params: {
      departmentId: departmentId || undefined,
      projectId: projectId || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    },
  });
  return response.data.data;
};