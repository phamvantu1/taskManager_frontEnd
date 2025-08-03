import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gửi OTP thất bại');
      }

      toast.success('OTP đã được gửi đến email!');
      setIsSent(true);
    } catch (err) {
      const message = err.message || 'Gửi OTP thất bại! Vui lòng kiểm tra lại.';
      toast.error(message);
      console.error('Forgot password error:', message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Quên mật khẩu
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
              required
            />
          </div>

          <button
            onClick={handleSendOTP}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-base font-medium"
          >
            Gửi OTP
          </button>
        </div>

        {isSent && (
          <div className="mt-4 text-center">
            <a
              href={`/verify-otp?email=${encodeURIComponent(email)}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Đã nhận OTP? Nhập OTP
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;