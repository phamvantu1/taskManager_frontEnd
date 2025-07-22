// src/api/taskApi.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';

export interface TaskRequest {
    title: string;
    description: string;
    startTime: string; // ISO format: "2025-07-01T00:00"
    endTime: string;
    assigneeId: number;
    projectId: number;
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
        throw new Error(`HTTP error! Status: ${response.status}`);
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
  
  