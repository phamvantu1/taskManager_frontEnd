import React, { useEffect, useState } from 'react';
import { taskApi, type TaskRequest } from '../api/taskApi';
import { getUserDetails, type UserInfo, fetchUsers, type User } from '../api/userApi';
import { toast } from 'react-toastify';

interface AddTaskPopupProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
  projectId?: number;
}

const AddTaskPopup: React.FC<AddTaskPopupProps> = ({ onClose, onSubmit, projectId }) => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    createdById: '',
    assigneeId: '',
    startTime: '',
    endTime: '',
    lever: 'Thấp',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Chưa đăng nhập');
      return;
    }

    // Validate required fields
    if (!taskData.title || !taskData.assigneeId || !taskData.createdById || !taskData.startTime || !taskData.endTime || !taskData.lever) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    // Validate startTime < endTime
    if (taskData.startTime && taskData.endTime && new Date(taskData.startTime) >= new Date(taskData.endTime)) {
      toast.error('Ngày bắt đầu phải trước ngày kết thúc');
      return;
    }

    // Map complexity to lever
    let lever = 1;
    if (taskData.lever === 'Trung bình') lever = 2;
    if (taskData.lever === 'Cao') lever = 3;

    const payload: TaskRequest = {
      title: taskData.title,
      description: taskData.description,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      assigneeId: Number(taskData.assigneeId),
      projectId: projectId !== undefined ? projectId : null,
      createdById: Number(taskData.createdById),
      lever: lever,
    };

    try {
      const response = await taskApi.createTask(payload, token);
      toast.success('Tạo công việc thành công!');
      onSubmit(response.data);
      onClose();
    } catch (error: any) {
      const message = error?.message || 'Không thể tạo công việc!';
      toast.error(message);
      console.error('Lỗi tạo công việc:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getUserDetails();
      if (user) {
        setCurrentUser(user);
        setTaskData((prev) => ({
          ...prev,
          createdById: String(user.id),
        }));
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      toast.error('Lỗi khi tải thông tin người dùng');
    }
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
    fetchCurrentUser();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl sm:max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center w-full">Thêm công việc mới</h2>
          <button
            className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-200"
            onClick={onClose}
            title="Đóng"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 after:content-['*'] after:text-red-500 after:ml-1">
              Tên công việc 
            </label>
            <input
              name="title"
              placeholder="Nhập tên công việc"
              value={taskData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Mô tả</label>
            <textarea
              name="description"
              placeholder="Nhập mô tả công việc"
              value={taskData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm resize-y min-h-[100px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 after:content-['*'] after:text-red-500 after:ml-1">
              Người giao 
            </label>
            {currentUser ? (
              <select
                name="createdById"
                value={taskData.createdById}
                disabled
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-700 bg-gray-100 cursor-not-allowed shadow-sm"
                required
              >
                <option value={currentUser.id}>
                  {currentUser.firstName} {currentUser.lastName} ({currentUser.email})
                </option>
              </select>
            ) : (
              <div className="text-sm text-gray-600">Đang tải...</div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 after:content-['*'] after:text-red-500 after:ml-1">
              Người thực hiện 
            </label>
            <select
              name="assigneeId"
              value={taskData.assigneeId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              required
            >
              <option value="">Chọn người thực hiện</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 after:content-['*'] after:text-red-500 after:ml-1">
              Ngày bắt đầu 
            </label>
            <input
              name="startTime"
              type="date"
              value={taskData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 after:content-['*'] after:text-red-500 after:ml-1">
              Ngày kết thúc 
            </label>
            <input
              name="endTime"
              type="date"
              value={taskData.endTime}
              onChange={handleChange}
              min={taskData.startTime}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 after:content-['*'] after:text-red-500 after:ml-1">
              Độ phức tạp 
            </label>
            <select
              name="lever"
              value={taskData.lever}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
              required
            >
              
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold shadow-sm"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 font-semibold shadow-sm"
            onClick={handleSubmit}
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;