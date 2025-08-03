import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await login({ email, password });
      const accessToken = result.data?.access_token;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error('Không tìm thấy access token');
      }
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      toast.error(message);
      console.error('Login error:', message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-base font-medium"
          >
            Đăng nhập
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Đăng ký
            </button>
          </p>
          <p className="text-sm text-gray-600">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Quên mật khẩu?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;