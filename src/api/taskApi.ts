// src/api/taskApi.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';

export interface TaskRequest {
    title: string;
    description: string;
    startTime: string; // ISO format: "2025-07-01T00:00"
    endTime: string;
    assigneeId: number;
    projectId: number | null;
    createdById: number;
    lever: number;
  }
  
  export interface TaskApiResponse {
    code: string;
    message: string;
    data: any;
  }

  export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    startTime: string;
    endTime: string;
    nameAssignedTo: string;
    nameCreatedBy: string;
    lever: number;
    process: number | null;
    createdAt: string;
  }
  
  export interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  }
  
  export interface TaskListData {
    content: Task[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }
  
  export interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
  }
  
  export const taskApi = {
    createTask: async (taskRequest: TaskRequest, token: string): Promise<TaskApiResponse> => {
      const response = await fetch('http://localhost:8080/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskRequest),
      });
  
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.message || 'Failed to create task');
      }
  
      return response.json();
    }
  };

  export const getAllTasks = {
    getAllTasks: async (
      token: string,
      params: {
        page?: number;
        size?: number;
        textSearch?: string;
        startTime?: string;
        endTime?: string;
        projectId?: number;
      }
    ): Promise<ApiResponse<TaskListData>> => {
      const res = await axios.get<ApiResponse<TaskListData>>(`${BASE_URL}/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
  
      return res.data;
    },
  };
  
  
  export const getDashboardTasksByProject = async (token: string, projectId?: number) => {
  const res = await axios.get(`http://localhost:8080/api/tasks/dashboard-tasks-by-project`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      projectId,
    },
  });
  return res.data;
};



export const getTaskDetailById = async (token: string, taskId: number) => {
  const res = await axios.get(`http://localhost:8080/api/tasks/get-details/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const updateTask = async (taskId: number, taskData: any, token: string) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${taskId}`, taskData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  }  catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || 'Cập nhật công việc thất bại. Vui lòng thử lại sau.';
    throw new Error(errorMessage);
  }
};
