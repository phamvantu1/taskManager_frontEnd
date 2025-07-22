export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    code: string;
    message: string;
    data?: {
      access_token: string;
    };
  }
  
  export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      // Nếu BE trả về message, ném lỗi kèm message
      throw new Error(data.message || 'Login failed');
    }
  
    return data;
  };
  
  