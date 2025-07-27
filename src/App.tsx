


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DepartmentDetailPage from './pages/getDepartmentDetail'; // Import trang chi tiết phòng ban
import './index.css'; // Import CSS file for global styles


function App() {
  return (
    <>
      <Router>
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
          <Route path="/department/:id" element={<DepartmentDetailPage />} /> {/* Route mới cho chi tiết phòng ban */}

          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
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
    </>
  );
}
export default App;
