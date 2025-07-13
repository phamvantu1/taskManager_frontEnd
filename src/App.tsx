// File: src/App.tsx
import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import './style/form.css';

const App: React.FC = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isLoginPage ? (
        <Login switchToRegister={() => setIsLoginPage(false)} />
      ) : (
        <Register switchToLogin={() => setIsLoginPage(true)} />
      )}
    </div>
  );
};

export default App;


