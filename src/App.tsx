import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeaderProvider } from './components/HeaderContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import TaskListPage from './pages/TaskListPage';
import MemberListPage from './pages/MemberListPage';
import DepartmentListPage from './pages/DepartmentListPage';
import ReportPage from './pages/ReportPage';
import DepartmentDetailPage from './pages/getDepartmentDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Đã xảy ra lỗi</h1>
            <p className="text-gray-600">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <HeaderProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/taskListPage" element={<TaskListPage />} />
            <Route path="/memberlistpage" element={<MemberListPage />} />
            <Route path="/department" element={<DepartmentListPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/department/:departmentId" element={<DepartmentDetailPage />} />
            <Route path="*" element={<Login />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </HeaderProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;