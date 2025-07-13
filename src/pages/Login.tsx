import React, { useState } from 'react';
import InputField from '../components/InputField';
import '../style/form.css';
import { useNavigate } from 'react-router-dom';
interface LoginProps {
  switchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const result = await response.json();
      const accessToken = result.data?.access_token;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        alert('Login successful!');
        console.log('Access Token:', accessToken);
        navigate('/dashboard');
      } else {
        throw new Error('Access token not found');
      }
    } catch (err) {
      alert('Login failed!');
      console.error(err);
    }
  };


  return (
    <div className="auth-container">
      <h2 className="auth-title">Đăng nhập</h2>
      <InputField label="Email" value={email} onChange={setEmail} />
      <InputField label="Mật khẩu" type="password" value={password} onChange={setPassword} />
      <button onClick={handleLogin} className="auth-button">Đăng nhập</button>
      <p className="auth-footer">
        Chưa có tài khoản?{' '}
        <button onClick={switchToRegister}>Đăng ký</button>
      </p>
      <p className="auth-footer">
        <button onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</button>
      </p>
    </div>
  );
};

export default Login;
