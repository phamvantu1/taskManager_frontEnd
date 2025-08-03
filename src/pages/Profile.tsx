import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getUserDetails, type UserInfo, updateUserInfo } from '../api/userApi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserDetails();
        setUserInfo(user);
      } catch (error) {
        toast.error('Không thể tải thông tin cá nhân.');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!userInfo) return;

    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = async () => {
    if (!userInfo) return;

    try {
      await updateUserInfo(userInfo);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Cập nhật thất bại', error);
      toast.error('Cập nhật thất bại!');
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
              Thông tin cá nhân
            </h1>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Họ
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userInfo?.lastName || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? 'bg-white' : 'bg-blue-50'
                  } text-blue-800`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Tên
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userInfo?.firstName || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? 'bg-white' : 'bg-blue-50'
                  } text-blue-800`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo?.email || ''}
                  readOnly
                  className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg bg-blue-50 text-blue-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={userInfo?.phone || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? 'bg-white' : 'bg-blue-50'
                  } text-blue-800`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Phòng ban
                </label>
                <input
                  type="text"
                  value={userInfo?.departmentName || 'Phòng Phát triển phần mềm 2'}
                  readOnly
                  className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg bg-blue-50 text-blue-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={userInfo?.gender || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? 'bg-white' : 'bg-blue-50'
                  } text-blue-800`}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">
                  Ngày sinh
                </label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={userInfo?.dateOfBirth?.toString().split('T')[0] || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? 'bg-white' : 'bg-blue-50'
                  } text-blue-800`}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300 transition-all duration-200"
                onClick={() => navigate('/dashboard')}
              >
                Quay lại
              </button>
              {!isEditing ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  onClick={() => setIsEditing(true)}
                >
                  Cập nhật
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;