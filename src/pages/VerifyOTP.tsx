import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      alert('Xác thực OTP thành công!');
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      alert('OTP không hợp lệ!');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Nhập mã OTP</h2>
      <input
        className="input-box"
        type="text"
        maxLength={6}
        placeholder="Nhập mã OTP 6 số"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} className="auth-button">Xác nhận</button>
    </div>
  );
};

export default VerifyOTP;
