import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (!confirmNewPassword) {
      toast.error('Vui lòng nhập xác nhận mật khẩu');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/change-password-by-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmNewPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Đổi mật khẩu thất bại');
      }

      toast.success('Đổi mật khẩu thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      const message = err.message || 'Đổi mật khẩu thất bại! Vui lòng kiểm tra lại.';
      toast.error(message);
      console.error('Reset password error:', message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Đặt lại mật khẩu
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-base font-medium"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;