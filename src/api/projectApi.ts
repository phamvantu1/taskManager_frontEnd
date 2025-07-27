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

  export const getAllProjects = async (page = 0, size = 10, departmentId?: undefined) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get<ApiResponse<PagedResponse<Project>>>(
      `${API_BASE_URL}/get-all-projects?page=${page}&size=${size}&departmentId=${departmentId || ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data; // Trả toàn bộ đối tượng page
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