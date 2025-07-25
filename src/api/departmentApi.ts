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