import axios from 'axios';

const DASHBOARD_URL = 'http://localhost:8080/api/v1/dashboard';

export interface Stat {
  title: string;
  value: number;
  subtitle: string;
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
      departmentId: departmentId || undefined, // Send undefined if departmentId is null to omit the param
    },
  });
  return response.data.data;
};