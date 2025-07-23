import React, { useEffect, useState } from 'react';
import '../style/AddProjectPopup.css';
import { fetchUsers, type User } from '../api/userApi';
import { createProject, type ProjectPayload } from '../api/projectApi';
import { toast } from 'react-toastify';

interface AddProjectPopupProps {
  onClose: () => void;
   onAddSuccess?: () => void; 
}

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({ onClose, onAddSuccess  }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => {
        console.error(err);
        alert('Không thể tải danh sách người dùng');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData: ProjectPayload = {
      name: (form.name as unknown as HTMLInputElement).value,
      description: (form.description as HTMLInputElement).value,
      type: (form.type as HTMLInputElement).value,
      ownerId: (form.manager as HTMLInputElement).value,
      startTime: (form.start as HTMLInputElement).value,
      endTime: (form.end as HTMLInputElement).value,
    };

    try {
      const result = await createProject(formData);
      toast.success("Thêm mới dự án thành công!");
      if (onAddSuccess) onAddSuccess();
      onClose();
    } catch (err: any) {
          const message = err?.message || 'Tạo dự án thất bại. Vui lòng kiểm tra lại.';
          toast.error(message);
          
        }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Tạo mới dự án</h2>
        <form className="popup-form" onSubmit={handleSubmit}>
          <label>
            Tên dự án:
            <input type="text" name="name" required />
          </label>
          <label>
            Mô tả:
            <textarea name="description" placeholder="Mô tả dự án..." rows={3}></textarea>
          </label>
          <label>
            Loại dự án:
            <select name="type">
              <option value="Nội bộ">Nội bộ</option>
              <option value="Khách hàng">Khách hàng</option>
            </select>
          </label>
          <label>
            Quản lý dự án:
            <select name="manager" required>
              <option value="">-- Chọn người quản lý --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ngày bắt đầu:
            <input type="date" name="start" />
          </label>
          <label>
            Ngày kết thúc:
            <input type="date" name="end" />
          </label>
          <div className="popup-actions">
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Tạo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPopup;
