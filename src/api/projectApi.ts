import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/projects';

export interface ProjectPayload {
    name: string ;
    description: string;
    type: string;
    ownerId: string;
    startTime: string;
    endTime: string;
  }

  export interface ProjectDetail {
    progress: number;
    id: number;
    name: string;
    description: string;
    ownerName: string;
    numberOfMembers: number;
    numberOfTasks: number;
    status: string;
    startDate: string;
    endDate: string;
  }
  


  export interface Project {
    id: number;
    name: string | null;
    description: string;
    startTime: string;
    endTime: string;
    status: string;
    type: string;
    createdAt: string;
  }
  
  export interface PagedResponse<T> {
    content: T[];
    pageable: any;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
  }
  
  export interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
  }
  
  export const createProject = async (payload: ProjectPayload) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8080/api/projects/create-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Tạo dự án thất bại');
    }
  
    return await response.json();
  };

  // export const getAllProjects = async (
  //   page: number = 0,
  //   size: number = 10,
  //   departmentId?: number
  // ) => {
  //   const token = localStorage.getItem('access_token');
  //   const response = await axios.get<ApiResponse<PagedResponse<Project>>>(
  //     `${API_BASE_URL}/get-all-projects?page=${page}&size=${size}&departmentId=${departmentId ?? ''}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   return response.data.data;
  // };


  export const getAllProjects = async (
  page: number = 0,
  size: number = 10,
  departmentId?: number,
  textSearch?: string,
  status?: string,
  startTime?: string,
  endTime?: string
) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }

  // Build query parameters dynamically
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(departmentId && { departmentId: departmentId.toString() }),
    ...(textSearch && { textSearch }),
    ...(status && { status }),
    ...(startTime && { startTime }),
    ...(endTime && { endTime }),
  });

  const response = await axios.get<ApiResponse<PagedResponse<Project>>>(
    `${API_BASE_URL}/get-all-projects?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};
  
  

  const getProjectInfo = async (projectId: number, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/get-info-project`, {
      params: { projectId },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };
  
  export const projectApi = {
    getProjectInfo,
  };