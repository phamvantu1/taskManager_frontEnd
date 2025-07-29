import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchUsers, type User } from '../api/userApi';
import { updateProject, type ProjectPayload, type ProjectDetail } from '../api/projectApi';

interface EditProjectPopupProps {
  onClose: () => void;
  onUpdateSuccess?: () => void;
  project: ProjectDetail;
}

const EditProjectPopup: React.FC<EditProjectPopupProps> = ({ onClose, onUpdateSuccess, project }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectPayload>({
    name: project.name || '',
    description: project.description || '',
    type: project.type || '',
    ownerId: project.ownerId?.toString() || '',
    startTime: project.startDate || '',
    endTime: project.endDate || '',
    departmentId: project.departmentId || undefined,
  });

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => {
        console.error(err);
        toast.error('Không thể tải danh sách người dùng');
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields: (keyof ProjectPayload)[] = ['name', 'type', 'ownerId', 'startTime', 'endTime'];
    for (const field of requiredFields) {
      if (typeof formData[field] === 'string' && !formData[field].trim()) {
        toast.error(`Vui lòng điền ${getFieldLabel(field)}`);
        return false;
      }
    }
    if (new Date(formData.startTime) > new Date(formData.endTime)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }
    return true;
  };

  const getFieldLabel = (field: keyof ProjectPayload) => {
    switch (field) {
      case 'name': return 'tên dự án';
      case 'type': return 'loại dự án';
      case 'ownerId': return 'quản lý dự án';
      case 'startTime': return 'ngày bắt đầu';
      case 'endTime': return 'ngày kết thúc';
      case 'departmentId': return 'phòng ban';
      default: return field;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateProject(project.id, formData);
      toast.success('Cập nhật dự án thành công!');
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Cập nhật dự án thất bại. Vui lòng kiểm tra lại.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Sửa dự án</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên dự án <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập tên dự án"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Mô tả dự án..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại dự án <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Chọn loại dự án --</option>
              <option value="Nội bộ">Nội bộ</option>
              <option value="Khách hàng">Khách hàng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quản lý dự án <span className="text-red-500">*</span>
            </label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Chọn người quản lý --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phòng ban
            </label>
            <input
              type="text"
              name="departmentId"
              value={formData.departmentId || ''}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập ID phòng ban"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                  </svg>
                  Đang cập nhật...
                </span>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectPopup;