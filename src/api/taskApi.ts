// src/api/taskApi.ts

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
  