import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchUsers, type User } from '../api/userApi';
import { updateDepartment } from '../api/departmentApi';

interface EditDepartmentPopupProps {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; leader_id: number }) => void;
  department: { id: string; name: string; description: string; leader_id: number };
}

const EditDepartmentPopup: React.FC<EditDepartmentPopupProps> = ({ onClose, onSubmit, department }) => {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description);
  const [leaderId, setLeaderId] = useState<number>(department.leader_id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Assume token is stored in localStorage; adjust based on your auth implementation
  const getAuthToken = () => localStorage.getItem('access_token') || '';


  const handleSubmit = async () => {
    console.log('Submitting department update:', { name, description, leaderId });
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên đơn vị');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await updateDepartment(department.id, { name: name.trim(), description: description.trim(), leader_id: leaderId }, token);

      if (response.code === 'SUCCESS') {
        toast.success(response.data.message || 'Cập nhật đơn vị thành công');
        await onSubmit({ name: name.trim(), description: description.trim(), leader_id: leaderId });
        onClose();
      } else {
        toast.error(response.message || 'Có lỗi khi cập nhật đơn vị');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi cập nhật đơn vị';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => {
        console.error(err);
        toast.error('Không thể tải danh sách người dùng');
      });
  }, []);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center w-full">Chỉnh sửa đơn vị</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {/* Tên đơn vị */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên đơn vị"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả đơn vị"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          {/* Leader ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Người quản lý <span className="text-red-500">*</span>
            </label>
            <select
              name="leaderId"
              value={leaderId || ''}
              onChange={(e) => setLeaderId(Number(e.target.value) || 0)}
              disabled={isSubmitting}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn người quản lý --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} 
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between gap-2">

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              type="button"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              type="button"
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentPopup;