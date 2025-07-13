import React, { useState } from 'react';
import InputField from '../components/InputField';

const Register: React.FC = () => {
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
      alert('Register successful!');
      console.log(data);
    } catch (err) {
      alert('Register failed!');
      console.error(err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <InputField label="First Name" value={firstName} onChange={setFirstName} />
      <InputField label="Last Name" value={lastName} onChange={setLastName} />
      <InputField label="Email" value={email} onChange={setEmail} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} />
      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
