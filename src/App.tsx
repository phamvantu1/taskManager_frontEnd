// // File: src/App.tsx
// import React, { useState } from 'react';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import './style/form.css';

// const App: React.FC = () => {
//   const [isLoginPage, setIsLoginPage] = useState(true);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       {isLoginPage ? (
//         <Login switchToRegister={() => setIsLoginPage(false)} />
//       ) : (
//         <Register switchToLogin={() => setIsLoginPage(true)} />
//       )}
//     </div>
//   );
// };

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login switchToRegister={() => {}} />} />
        <Route path="/register" element={<Register switchToLogin={() => {}} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login switchToRegister={() => {}} />} />
      </Routes>
    </Router>
  );
}
export default App;
