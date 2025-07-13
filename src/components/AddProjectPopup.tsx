import React from 'react';
import '../style/AddProjectPopup.css';

interface AddProjectPopupProps {
  onClose: () => void;
  onSubmit?: (data: any) => void; // bạn có thể thêm logic xử lý sau
}

const AddProjectPopup: React.FC<AddProjectPopupProps> = ({ onClose, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = {
      name: form.name.valueOf,
      type: form.type.value,
      manager: form.manager.value,
      members: form.members.value.split(',').map((m: string) => m.trim()),
      start: form.start.value,
      end: form.end.value,
    };
    if (onSubmit) onSubmit(formData);
    onClose();
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
            Loại dự án:
            <select name="type">
              <option>Nội bộ</option>
              <option>Khách hàng</option>
            </select>
          </label>
          <label>
            Quản lý dự án:
            <input type="text" name="manager" required />
          </label>
          <label>
            Thành viên:
            <input type="text" name="members" placeholder="Ngăn cách bằng dấu phẩy" />
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
            <button type="submit">Tạo</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPopup;
