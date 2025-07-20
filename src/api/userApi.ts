import axios from 'axios';

export interface UserInfo {
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
    firstName: string;
    lastName: string;
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