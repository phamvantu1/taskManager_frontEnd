import React, { useEffect, useState } from 'react';
import '../style/addtaskpopup.css';
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
    lever: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Chưa đăng nhập');
      return;
    }

    // Map complexity to lever (you can customize this)
    let lever = 1;
    if (taskData.lever === 'Trung bình') lever = 2;
    if (taskData.lever === 'Cao') lever = 3;

    const payload: TaskRequest = {
      title: taskData.title,
      description: taskData.description,
      startTime: `${taskData.startTime}`,
      endTime: `${taskData.endTime}`,
      assigneeId: Number(taskData.assigneeId),
      projectId: projectId !== undefined ? projectId : 0,
      createdById: Number(taskData.createdById),
      lever: lever,
    };

    try {
      const response = await taskApi.createTask(payload, token);
      console.log('Tạo thành công:', response);
      toast.success('Tạo công việc thành công!');
      onSubmit(response.data); // hoặc bạn có thể refresh danh sách task
      onClose();
    } catch (error: any) {
      const message = error?.message || 'Không thể tạo công việc!';
      toast.error(message);
      console.error('Lỗi tạo công việc:', error);
    }
  };

  const fetchCurrentUser = async () => {
      const user = await getUserDetails();
      if (user) {
        setCurrentUser(user);
        setTaskData((prev) => ({
          ...prev,
          createdById: String(user.id), // set mặc định createdById
        }));
      }
    };

     const fetchDataUser = async () => {
      try {
        const users = await fetchUsers();
        setUserList(users);
      } catch (err) {
        console.error('Lỗi khi load danh sách người dùng:', err);
      }
    };

  useEffect(() => {
    
    fetchDataUser();
    fetchCurrentUser();
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Thêm công việc mới</h2>
        <input name="title" placeholder="Tên công việc" value={taskData.title} onChange={handleChange} />

        <textarea name="description" placeholder="Mô tả" value={taskData.description} onChange={handleChange} />

        {/* Chọn người giao */}
        {currentUser && (
          <select name="createdById" value={taskData.createdById} disabled>
            <option value={currentUser.id}>
              {currentUser.firstName} {currentUser.lastName} - {currentUser.email}
            </option>
          </select>
        )}

        <select name="assigneeId" value={taskData.assigneeId} onChange={handleChange}>
          <option value="">Chọn người thực hiện</option>
          {userList.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} - {user.email}
            </option>
          ))}
        </select>
        <input name="startTime" type="date" value={taskData.startTime} onChange={handleChange} />
        <input name="endTime" type="date" value={taskData.endTime} onChange={handleChange} />
        <select name="lever" value={taskData.lever} onChange={handleChange}>
          <option value="">Chọn độ phức tạp</option>
          <option value="Thấp">Thấp</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Cao">Cao</option>
        </select>
        <div className="popup-actions">
          <button onClick={onClose}>Huỷ</button>
          <button onClick={handleSubmit}>Tạo</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;
