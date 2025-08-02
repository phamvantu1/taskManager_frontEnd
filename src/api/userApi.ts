import axios from 'axios';

export interface UserInfo {
    role: string;
    departmentName: string;
    id ?: number; 
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    gender : string | null;
    dateOfBirth : String | null;
    active : boolean;
  }
  
  interface ApiResponse<T> {
    code: string;
    message?: string;
    data: T;
  }

  export interface User {
    id: number;
    email: string;
    fullName: string;
    role?: string;
    avatar?: string;
  }
  
  export const getUserDetails = async (): Promise<UserInfo | null> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("Token không tồn tại.");
      }
  
      const response = await fetch('http://localhost:8080/api/users/details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
  
      const result: ApiResponse<UserInfo> = await response.json();
  
      if (result.code === 'SUCCESS') {
        return result.data;
      } else {
        console.error('Lỗi khi lấy dữ liệu user:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      return null;
    }
  };
  

  export const updateUserInfo = async (data: UserInfo): Promise<void> => {
    const token = localStorage.getItem('access_token');
    await axios.put('http://localhost:8080/api/users/update-infor', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };


  export const fetchUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8080/api/users/get-all-users?page=0&size=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách người dùng');
    }
  
    const json = await response.json();
    return json.data.content || [];
  };


export const getProjectMembersStats = async (
    projectId: number,
    page = 0,
    size = 5,
    textSearch = ''
): Promise<any> => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(
        `http://localhost:8080/api/projects/get-user-by-project?projectId=${projectId}&page=${page}&size=${size}&textSearch=${textSearch}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Lỗi khi lấy thống kê thành viên dự án');
    }

    const json = await response.json();
    return json.data; // Trả cả content, totalPages...
};


export const getUserById = async (userId: number): Promise<UserInfo | null> => {
  try {
      const token = localStorage.getItem('access_token');
      if (!token) {
          throw new Error("Token không tồn tại.");
      }

      const response = await fetch(`http://localhost:8080/api/users/get-infor-by-id?userId=${userId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const result: ApiResponse<UserInfo> = await response.json();

      if (result.code === 'SUCCESS') {
          return result.data;
      } else {
          console.error('Lỗi khi lấy thông tin người dùng:', result.message);
          return null;
      }
  } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      return null;
  }
};

export const updateUserByAdmin = async (userData: UserInfo): Promise<void> => {
  try {
      const token = localStorage.getItem('access_token');
      if (!token) {
          throw new Error("Token không tồn tại.");
      }

      const response = await axios.put('http://localhost:8080/api/users/update-user-by-admin', userData, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi cập nhật người dùng');
    }
  } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
      const token = localStorage.getItem('access_token');
      if (!token) {
          throw new Error("Token không tồn tại.");
      }

      const response = await axios.delete(`http://localhost:8080/api/users/delete-user?userId=${userId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi cập nhật người dùng');
    }
  } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      throw error;
  }
};