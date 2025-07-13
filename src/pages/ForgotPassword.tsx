import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendOTP = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      alert("OTP đã được gửi đến email!");
      setIsSent(true);
    } catch {
      alert("Gửi OTP thất bại!");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Quên mật khẩu</h2>
      <input
        className="input-box"
        type="email"
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOTP} className="auth-button">Gửi OTP</button>
      {isSent && (
        <a href={`/verify-otp?email=${encodeURIComponent(email)}`} style={{ marginTop: '10px', color: '#3498db' }}>
          Đã nhận OTP? Nhập OTP
        </a>
      )}
    </div>
  );
};

export default ForgotPassword;
