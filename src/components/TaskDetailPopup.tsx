import React, { useState, useEffect } from 'react';
import { fetchUsers, type User } from '../api/userApi';
import { updateTask, markFinishTask, deleteTask } from '../api/taskApi'; // Import new API functions
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

interface TaskDetailPopupProps {
  task: any;
  onClose: () => void;
  onComplete?: () => void;
  onSave?: (updatedTask: any) => void;
  onDelete?: () => void; // New prop for handling delete
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, onClose, onComplete, onSave, onDelete }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState(task);
  const [userList, setUserList] = useState<User[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!task) return null;

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const mapStatusToNumber = (status: string): number => {
    switch (status.toLowerCase()) {
      case 'chưa bắt đầu': return 0;
      case 'đang thực hiện': return 1;
      case 'hoàn thành': return 2;
      case 'quá hạn': return 3;
      default: return -1;
    }
  };

  const mapLeverToNumber = (lever: string): number => {
    switch (lever.toLowerCase()) {
      case 'dễ': return 0;
      case 'trung bình': return 1;
      case 'khó': return 2;
      default: return -1;
    }
  };

  const mapNumberToStatus = (status: string): string => {
    switch (status) {
      case 'PENDING': return 'Chưa bắt đầu';
      case 'PROCESSING': return 'Đang thực hiện';
      case 'COMPLETED': return 'Hoàn thành';
      case 'OVERDUE': return 'Quá hạn';
      default: return 'Không xác định';
    }
  };

  const mapNumberToLever = (lever: number): string => {
    switch (lever) {
      case 0: return 'Dễ';
      case 1: return 'Trung bình';
      case 2: return 'Khó';
      default: return 'Không xác định';
    }
  };

  const mapVietnameseStatusToBackend = (status: string): string => {
    switch (status) {
      case 'Chưa bắt đầu': return 'PENDING';
      case 'Đang thực hiện': return 'PROCESSING';
      case 'Hoàn thành': return 'COMPLETED';
      case 'Quá hạn': return 'OVERDUE';
      default: return status;
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }

      await markFinishTask(task.id, token);
      toast.success('Đánh dấu công việc hoàn thành thành công!');
      onClose();
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      const message = err?.message || 'Đánh dấu hoàn thành thất bại. Vui lòng thử lại sau.';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }

      await deleteTask(task.id, token);
      toast.success('Xóa công việc thành công!');
      onClose();
      if (onDelete) {
        onDelete();
      }
    } catch (err: any) {
      const message = err?.message || 'Xóa công việc thất bại. Vui lòng thử lại sau.';
      toast.error(message);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }

      const updatedTask = {
        ...editedTask,
        assigneeId: editedTask.assigneeId,
      };

      const response = await updateTask(editedTask.id, updatedTask, token);
      onClose();
      toast.success('Cập nhật công việc thành công!');

      if (onSave) {
        onSave(editedTask);
      }
      setEditingField(null);
    } catch (err: any) {
      const message = err?.message || 'Cập nhật công việc thất bại. Vui lòng thử lại sau.';
      toast.error(message);
    }
  };

  const handleSaveField = (field: string, value: string) => {
    let updatedTask = { ...editedTask };

    if (field === 'assigneeId') {
      const idNum = Number(value);
      updatedTask.assigneeId = isNaN(idNum) ? null : idNum;
    } else if (field === 'status') {
      updatedTask[field] = mapVietnameseStatusToBackend(value);
    } else if (field === 'lever') {
      updatedTask[field] = mapLeverToNumber(value);
    } else {
      updatedTask[field] = value;
    }

    setEditedTask(updatedTask);
    setEditingField(null);
  };

  const renderField = (label: string, field: string, value: string, isEditable: boolean = true) => {
    const isEditing = editingField === field;

    return (
      <div className="relative flex items-center gap-4 py-2 pr-8">
        <label className="w-32 text-sm font-semibold text-gray-700">{label}:</label>
        {isEditing && isEditable ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              defaultValue={value}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveField(field, (e.target as HTMLInputElement).value);
                }
              }}
              onBlur={(e) => handleSaveField(field, e.target.value)}
              autoFocus
            />
            <div className="flex gap-1">
              <button
                className="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                  handleSaveField(field, input.value);
                }}
              >
                ✓
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                onClick={handleCancelEdit}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-1">
            <span className="text-sm text-gray-800">{value}</span>
            {isEditable && (
              <button
                className="absolute top-0 right-0 p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50 transition-all duration-200"
                onClick={() => handleEdit(field)}
              >
                ✏️
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSelectField = (label: string, field: string, value: string, options: string[]) => {
    const isEditing = editingField === field;

    return (
      <div className="relative flex items-center gap-4 py-2 pr-8">
        <label className="w-32 text-sm font-semibold text-gray-700">{label}:</label>
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <select
              defaultValue={value}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              onChange={(e) => handleSaveField(field, e.target.value)}
              autoFocus
            >
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              onClick={handleCancelEdit}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center flex-1">
            <span className="text-sm text-gray-800">{value}</span>
            <button
              className="absolute top-0 right-0 p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50 transition-all duration-200"
              onClick={() => handleEdit(field)}
            >
              ✏️
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAssigneeSelectField = () => {
    const isEditing = editingField === 'assigneeId';
    const assignedUser = userList.find(user => user.id === editedTask.assigneeId);
    const assignedUserDisplay = assignedUser
      ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.email})`
      : task.nameAssignedTo || 'Chưa chọn';

    return (
      <div className="relative flex items-center gap-4 py-2 pr-8">
        <label className="w-32 text-sm font-semibold text-gray-700">Người thực hiện:</label>
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <select
              value={editedTask.assigneeId || ''}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              onChange={(e) => handleSaveField('assigneeId', e.target.value)}
              autoFocus
            >
              <option value="">-- Chọn người thực hiện --</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            <button
              className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              onClick={handleCancelEdit}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center flex-1">
            <span className="text-sm text-gray-800">{assignedUserDisplay}</span>
            <button
              className="absolute top-0 right-0 p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50 transition-all duration-200"
              onClick={() => handleEdit('assigneeId')}
            >
              ✏️
            </button>
          </div>
        )}
      </div>
    );
  };

  const fetchDataUser = async () => {
    try {
      const users = await fetchUsers();
      setUserList(users);
    } catch (err) {
      console.error('Lỗi khi load danh sách người dùng:', err);
      toast.error('Lỗi khi tải danh sách người dùng');
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  const statusOptions = ['Chưa bắt đầu', 'Đang thực hiện', 'Hoàn thành'];
  const leverOptions = ['Dễ', 'Trung bình', 'Khó'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl sm:max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center w-full">Chi tiết công việc</h2>
          <button
            className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200"
            onClick={onClose}
            title="Đóng"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {renderField("Tiêu đề", "title", editedTask.title)}
          {renderField("Mô tả", "description", editedTask.description)}
          {renderField("Người giao", "createdById", editedTask.nameCreatedBy, false)}
          {renderAssigneeSelectField()}
          {renderField("Ngày bắt đầu", "startTime", editedTask.startTime)}
          {renderField("Ngày kết thúc", "endTime", editedTask.endTime)}
          {renderSelectField("Trạng thái", "status", mapNumberToStatus(editedTask.status), statusOptions)}
          {renderSelectField("Mức độ", "lever", mapNumberToLever(editedTask.lever), leverOptions)}
          {renderField("Ngày tạo", "createdAt", editedTask.createdAt, false)}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-sm"
            onClick={() => setIsConfirmOpen(true)}
          >
            Đánh dấu hoàn thành
          </button>
          <ConfirmModal
            isOpen={isConfirmOpen}
            onConfirm={() => {
              handleComplete();
              setIsConfirmOpen(false);
            }}
            onCancel={() => setIsConfirmOpen(false)}
            title="Xác nhận đánh dấu hoàn thành"
            message="Bạn có chắc chắn muốn đánh dấu công việc này là hoàn thành không? Hành động này không thể hoàn tác."
          />
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-sm"
            onClick={() => setIsConfirmOpen(true)}
          >
            Xóa
          </button>
          <ConfirmModal
            isOpen={isConfirmOpen}
            onConfirm={() => {
              handleDelete();
              setIsConfirmOpen(false);
            }}
            onCancel={() => setIsConfirmOpen(false)}
            title="Xác nhận xóa công việc"
            message="Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác."
          />
          <button
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 font-semibold shadow-sm"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPopup;