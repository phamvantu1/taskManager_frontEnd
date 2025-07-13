import React, { useState } from 'react';
import '../style/addtaskpopup.css';

interface AddTaskPopupProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
}

const AddTaskPopup: React.FC<AddTaskPopupProps> = ({ onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    assigner: '',
    assignee: '',
    startDate: '',
    endDate: '',
    complexity: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(taskData);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Thêm công việc mới</h2>
        <input name="name" placeholder="Tên công việc" value={taskData.name} onChange={handleChange} />
        <textarea name="description" placeholder="Mô tả" value={taskData.description} onChange={handleChange} />
        <input name="assigner" placeholder="Người giao" value={taskData.assigner} onChange={handleChange} />
        <input name="assignee" placeholder="Người thực hiện" value={taskData.assignee} onChange={handleChange} />
        <input name="startDate" type="date" value={taskData.startDate} onChange={handleChange} />
        <input name="endDate" type="date" value={taskData.endDate} onChange={handleChange} />
        <select name="complexity" value={taskData.complexity} onChange={handleChange}>
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
