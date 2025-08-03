import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.oldPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu cũ');
      return false;
    }
    if (!formData.newPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return false;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return false;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại');
      }

      toast.success('Đổi mật khẩu thành công');
      navigate('/departments'); // Redirect to departments page after success
    } catch (error: any) {
      toast.error(error.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
        <div className="p-6 flex justify-center">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md border border-blue-200">
            <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              Đổi mật khẩu
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-blue-700">
                  Mật khẩu cũ <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPasswords.oldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập mật khẩu cũ"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('oldPassword')}
                  className="absolute right-3 top-9 text-blue-600 hover:text-blue-800"
                >
                  {showPasswords.oldPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-blue-700">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('newPassword')}
                  className="absolute right-3 top-9 text-blue-600 hover:text-blue-800"
                >
                  {showPasswords.newPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-blue-700">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPasswords.confirmNewPassword ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Xác nhận mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirmNewPassword')}
                  className="absolute right-3 top-9 text-blue-600 hover:text-blue-800"
                >
                  {showPasswords.confirmNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300 transition-all duration-200"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Lưu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;