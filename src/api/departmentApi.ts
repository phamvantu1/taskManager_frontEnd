// src/api/departmentApi.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/departments';

export interface DepartmentRequest {
  name: string;
  description: string;
  leader_id: number;
}


export const createDepartment = async (
  departmentData: DepartmentRequest,
  token: string
) => {
  const response = await axios.post(`${BASE_URL}/create`, departmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


export interface GetDepartmentsResponse {
  data: any; // Replace 'any' with the actual type if known
  // Add other fields if present in the response
}

export const getDepartments = async (
  token: string,
  page: number = 0,
  size: number = 10,
  textSearch?: string
): Promise<any> => { // Replace 'any' with the actual type if known
  const response = await axios.get<GetDepartmentsResponse>(`${BASE_URL}/get-all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      size,
      textSearch,
    },
  });

  return response.data.data; // Vì data nằm trong field `data`
};

interface DepartmentDetailResponse {
  data: {
    id: number;
    name: string;
    description: string;
    leaderName: string;
    createdByName: string;
    createdAt: string;
    updatedAt: string;
    numberOfUsers: number;
    numberOfProjects: number;
  };
}

export const getDepartmentDetail = async (departmentId: string, token: string): Promise<{
    id: number;
    name: string;
    description: string;
    leaderName: string;
    createdByName: string;
    createdAt: string;
    updatedAt: string;
    numberOfUsers: number;
    numberOfProjects: number;
}> => {
  const response = await axios.get<DepartmentDetailResponse>(`${BASE_URL}/get-common/${departmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*',
    },
  });
  const data = response.data.data;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    leaderName: data.leaderName,
    createdByName: data.createdByName,
    createdAt: new Date(data.createdAt).toLocaleString('vi-VN'),
    updatedAt: data.updatedAt,
    numberOfUsers: data.numberOfUsers,
    numberOfProjects: data.numberOfProjects,
  };
};

export const addUserToDepartment = async (
  departmentId: string,
  userId: number,
  token: string
) => {
  const response = await axios.post(`${BASE_URL}/add-user/${departmentId}/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*',
    },
  });
  return response.data;
};

export interface Member {
  id: number;
  email: string;
  fullName: string;
  role?: string;
  avatar?: string;
}

interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export const getDepartmentMembers = async (
  departmentId: string,
  token: string,
  params: { page: number; size: number }
): Promise<ApiResponse<{ totalPages: number; content: Member[] }>> => {
  const response = await axios.get<ApiResponse<{ totalPages: number; content: Member[] }>>(
    `http://localhost:8080/api/users/get-all-users?page=${params.page}&size=${params.size}&departmentId=${departmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
  return response.data;
};

// departmentApi.ts
export const getDepartmentDashboard = async (departmentId: string, token: string) => {
  const response = await fetch(`http://localhost:8080/api/departments/get-dashboard/${departmentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể lấy dữ liệu tổng quan phòng ban');
  }

  const result = await response.json();
  return result.data; // Trả về phần data: { listNewUsers, listProjectsInProgress, listProjectsCompleted }
};

export const updateDepartment = async (
  departmentId: string,
  departmentData: DepartmentRequest,
  token: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await axios.put<ApiResponse<{ message: string }>>(`${BASE_URL}/update/${departmentId}`, departmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
  });
  return response.data;
};

export const deleteDepartment = async (
  departmentId: string,
  token: string
): Promise<ApiResponse<null>> => {
  const response = await axios.delete<ApiResponse<null>>(`${BASE_URL}/delete/${departmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
  });
  return response.data;
};