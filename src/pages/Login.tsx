import React, { useState } from 'react';
import InputField from '../components/InputField';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      alert('Login successful!');
      console.log(data); // Có thể lưu token nếu cần
    } catch (err) {
      alert('Login failed!');
      console.error(err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <InputField label="Email" value={email} onChange={setEmail} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
