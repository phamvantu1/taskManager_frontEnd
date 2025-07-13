import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/change-password-by-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmNewPassword }),
      });
      if (!res.ok) throw new Error();
      alert('Đổi mật khẩu thành công!');
      navigate('/login');
    } catch {
      alert('Đổi mật khẩu thất bại!');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Đặt lại mật khẩu</h2>
      <input
        className="input-box"
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        className="input-box"
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      <button onClick={handleReset} className="auth-button">Xác nhận</button>
    </div>
  );
};

export default ResetPassword;
