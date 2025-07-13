
import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-around">
        <Login />
        <Register />
      </div>
    </div>
  );
};

export default App;
