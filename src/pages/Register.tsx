import React, { useState } from 'react';
import InputField from '../components/InputField';
import '../style/form.css';

interface RegisterProps {
  switchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) throw new Error('Register failed');

      const data = await response.json();
      alert('Đăng ký thành công!');
      console.log(data);
      switchToLogin();
    } catch (err) {
      alert('Đăng ký thất bại!');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Đăng ký</h2>
      <InputField label="Họ" value={lastName} onChange={setLastName} />
      <InputField label="Tên" value={firstName} onChange={setFirstName} />
      <InputField label="Email" value={email} onChange={setEmail} />
      <InputField label="Mật khẩu" type="password" value={password} onChange={setPassword} />
      <button onClick={handleRegister} className="auth-button">Đăng ký</button>
      <p className="auth-footer">
        Đã có tài khoản?{' '}
        <button onClick={switchToLogin}>Đăng nhập</button>
      </p>
    </div>
  );
};

export default Register;
