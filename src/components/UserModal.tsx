import React from 'react';
import type { UserInfo } from '../api/userApi';
import { toast } from 'react-toastify';

interface UserModalProps {
  user: UserInfo | null;
  isOpen: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedUser: (user: UserInfo | null) => void;
  onUpdate: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  isEditing,
  setIsEditing,
  setIsModalOpen,
  setSelectedUser,
  onUpdate,
  onDelete,
}) => {
  if (!user || !isOpen) return null;

  // Map backend role values to display names
  const roleDisplayNames: { [key: string]: string } = {
    ADMIN: 'Quản trị viên',
    USER: 'Người dùng',
    '': 'Không xác định',
  };

  // Map display names back to backend values
  const roleValueMap: { [key: string]: string | null } = {
    'Quản trị viên': 'ADMIN',
    'Người dùng': 'USER',
    'Không xác định': null,
  };

  // Get display name for current role
  const getRoleDisplayName = (role: string | null) => {
    return roleDisplayNames[role || ''] || 'Không xác định';
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center w-full">
          {isEditing ? 'Sửa thông tin người dùng' : 'Chi tiết người dùng'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ</label>
            <input
              type="text"
              value={user.firstName}
              onChange={(e) => setSelectedUser({ ...user, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên</label>
            <input
              type="text"
              value={user.lastName}
              onChange={(e) => setSelectedUser({ ...user, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              value={user.phone || ''}
              onChange={(e) => setSelectedUser({ ...user, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
            <select
              value={user.gender || ''}
              onChange={(e) => setSelectedUser({ ...user, gender: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Không xác định</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
             
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input
              type="date"
              value={String(user.dateOfBirth) || ''}
              onChange={(e) => setSelectedUser({ ...user, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
            {isEditing ? (
              <select
                value={getRoleDisplayName(user.role)}
                onChange={(e) => setSelectedUser({ ...user, role: roleValueMap[e.target.value] || '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Không xác định</option>
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Người dùng">Người dùng</option>
              </select>
            ) : (
              <input
                type="text"
                value={getRoleDisplayName(user.role)}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-100"
              />
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={onUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Lưu
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400"
              >
                Đóng
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Sửa
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Xóa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;