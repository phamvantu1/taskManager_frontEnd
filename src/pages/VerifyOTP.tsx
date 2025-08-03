import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      toast.error('Vui lòng nhập mã OTP');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'OTP không hợp lệ');
      }

      toast.success('Xác thực OTP thành công!');
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err) {
      const message = err.message || 'OTP không hợp lệ! Vui lòng kiểm tra lại.';
      toast.error(message);
      console.error('Verify OTP error:', message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Nhập mã OTP
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Nhập mã OTP 6 số"
              required
            />
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-base font-medium"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;