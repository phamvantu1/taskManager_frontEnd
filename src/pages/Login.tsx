import React, { useState } from 'react';
import InputField from '../components/InputField';
import '../style/form.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
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
        }, 1000); // đợi 1 giây

      } else {
        throw new Error('Không tìm thấy access token');
      }
    } catch (err: any) {
      const message = err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      toast.error(message);
      console.error('hah', message);
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
        <button onClick={() => navigate('/register')}>Đăng ký</button>
      </p>
      <p className="auth-footer">
        <button onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</button>
      </p>
    </div>
  );
};

export default Login;
