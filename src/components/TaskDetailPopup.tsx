// src/components/TaskDetailPopup.tsx
import React from 'react';
import '../style/TaskDetailPopup.css'; // optional CSS file

interface TaskDetailPopupProps {
    task: any;
    onClose: () => void;
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, onClose }) => {
    if (!task) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Chi tiết công việc</h2>
                <p><strong>Tiêu đề:</strong> {task.title}</p>
                <p><strong>Mô tả:</strong> {task.description}</p>
                <p><strong>Người tạo:</strong> {task.nameCreatedBy}</p>
                <p><strong>Người thực hiện:</strong> {task.nameAssignedTo}</p>
                <p><strong>Ngày bắt đầu:</strong> {task.startTime}</p>
                <p><strong>Ngày kết thúc:</strong> {task.endTime}</p>
                <p><strong>Trạng thái:</strong> {task.status}</p>
                <p><strong>Mức độ:</strong> {task.lever}</p>
                <p><strong>Ngày tạo:</strong> {task.createdAt}</p>
                <button onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};

export default TaskDetailPopup;
