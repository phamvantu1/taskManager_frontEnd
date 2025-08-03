import axios from 'axios';

const DASHBOARD_URL = 'http://localhost:8080/api/v1/dashboard';

export interface Stat {
  title: string;
  value: number;
  subtitle: string;
}

export interface UserTaskOverview {
  averageProgress: number;
  excellentCount: number;
  needSupportCount: number;
}

export interface UserProgress {
  fullName: string;
  progress: number;
}


export interface PagedUserProgress {
  content: UserProgress[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
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
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface ReportData {
  name: string;
  departmentName: string;
  processing: number;
  overdue: number;
  waitCompleted: number;
  completed: number;
  pending: number;
  totalTasks: number;
  plusPoint: number;
  totalPoint: number;
  minusPoint: number;
}

interface DashboardResponse {
  content: ReportData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
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
  numberOfElements: number;
  first: boolean;
  empty: boolean;
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


export const getDashboardUsers = async (
  departmentId: string | null,
  startTime: string | null,
  endTime: string | null,
  page: number,
  size: number,
  token: string
): Promise<PagedUserProgress> => {
  const response = await axios.get<ApiResponse<PagedUserProgress>>(`${DASHBOARD_URL}/get-dashboard-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*',
    },
    params: {
      departmentId: departmentId || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      page,
      size,
    },
  });
  return response.data.data;
};

export const getDashboardUserTaskOverview = async (
  departmentId: string | null,
  startTime: string | null,
  endTime: string | null,
  token: string
): Promise<UserTaskOverview> => {
  const response = await axios.get<ApiResponse<UserTaskOverview>>(`${DASHBOARD_URL}/get-dashboard-userTask-overview`, {
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


export const getDashboardUserTask = async (
  departmentId?: number,
  textSearch: string = '',
  startTime: string = '',
  endTime: string = '',
  page: number = 0,
  size: number = 10
): Promise<DashboardResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token không tồn tại.');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (departmentId) {
      params.append('departmentId', departmentId.toString());
    }
    if (textSearch.trim()) {
      params.append('textSearch', textSearch.trim());
    }
    if (startTime) {
      params.append('startTime', startTime);
    }
    if (endTime) {
      params.append('endTime', endTime);
    }

    const response = await fetch(
      `http://localhost:8080/api/v1/dashboard/get-dashboard-userTask?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Phiên đăng nhập hết hạn');
      }
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const result: ApiResponse<DashboardResponse> = await response.json();

    if (result.code === 'SUCCESS') {
      return result.data;
    } else {
      throw new Error(result.message || 'Lỗi khi lấy dữ liệu dashboard');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API getDashboardUserTask:', error);
    throw error;
  }
};

export const exportDashboardUserTask = async (
  departmentId?: number,
  textSearch: string = '',
  startTime: string = '',
  endTime: string = ''
): Promise<void> => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token không tồn tại.');
    }

    console.log('token ', token);


    const params = new URLSearchParams();
    if (departmentId) {
      params.append('departmentId', departmentId.toString());
    }
    if (textSearch.trim()) {
      params.append('textSearch', textSearch.trim());
    }
    if (startTime) {
      params.append('startTime', startTime);
    }
    if (endTime) {
      params.append('endTime', endTime);
    }



    const response = await axios.post(
      `http://localhost:8080/api/v1/dashboard/export-dashboard-userTask?${params.toString()}`,
      {}, // nếu không có body, truyền object rỗng
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );


    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Báo cáo tổng quan.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error);
    throw error;
  }
};