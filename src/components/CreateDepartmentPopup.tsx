import React, { useState, useEffect } from 'react';
import { fetchUsers, type User } from '../api/userApi';

interface CreateDepartmentPopupProps {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; leader_id: number }) => void;
}

const CreateDepartmentPopup: React.FC<CreateDepartmentPopupProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderId, setLeaderId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên đơn vị');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), leader_id: leaderId });
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
        alert('Không thể tải danh sách người dùng');
      });
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 text-center w-full">Tạo mới phòng ban</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
            type="button"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Tên đơn vị */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Tên đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên đơn vị"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm disabled:bg-gray-100"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả đơn vị"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm disabled:bg-gray-100 resize-none h-24"
              disabled={isSubmitting}
            />
          </div>

          {/* Leader ID */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Người quản lý <span className="text-red-500">*</span>
            </label>
            <select
              value={leaderId || ''}
              onChange={e => setLeaderId(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm disabled:bg-gray-100"
              disabled={isSubmitting}
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
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200 font-semibold shadow-sm"
            type="button"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm flex items-center gap-2"
            type="button"
          >
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span>{isSubmitting ? 'Đang tạo...' : 'Tạo đơn vị'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartmentPopup;