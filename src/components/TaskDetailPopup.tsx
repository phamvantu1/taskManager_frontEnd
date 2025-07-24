// src/components/TaskDetailPopup.tsx
import React, { useState } from 'react';
import '../style/TaskDetailPopup.css';

interface TaskDetailPopupProps {
    task: any;
    onClose: () => void;
    onComplete?: () => void;
    onSave?: (updatedTask: any) => void;
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, onClose, onComplete, onSave }) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editedTask, setEditedTask] = useState(task);

    if (!task) return null;

    const handleEdit = (field: string) => {
        setEditingField(field);
    };

    const handleSaveField = (field: string, value: string) => {
        setEditedTask({ ...editedTask, [field]: value });
        setEditingField(null);
    };

    const handleCancelEdit = () => {
        setEditingField(null);
    };

    const handleComplete = () => {
        if (onComplete) {
            onComplete();
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave(editedTask);
        }
    };

    const renderField = (label: string, field: string, value: string) => {
        const isEditing = editingField === field;
        
        return (
            <div className="field-container">
                <div className="field-row">
                    <p className="field-label"><strong>{label}:</strong></p>
                    {isEditing ? (
                        <div className="edit-container">
                            <input
                                type="text"
                                defaultValue={value}
                                className="edit-input"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSaveField(field, (e.target as HTMLInputElement).value);
                                    }
                                }}
                                onBlur={(e) => handleSaveField(field, e.target.value)}
                                autoFocus
                            />
                            <div className="edit-buttons">
                                <button 
                                    className="save-btn"
                                    onClick={(e) => {
                                        const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                                        handleSaveField(field, input.value);
                                    }}
                                >
                                    ✓
                                </button>
                                <button 
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="value-container">
                            <span className="field-value">{value}</span>
                            <button 
                                className="edit-btn"
                                onClick={() => handleEdit(field)}
                            >
                                ✏️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderSelectField = (label: string, field: string, value: string, options: string[]) => {
        const isEditing = editingField === field;
        
        return (
            <div className="field-container">
                <div className="field-row">
                    <p className="field-label"><strong>{label}:</strong></p>
                    {isEditing ? (
                        <div className="edit-container">
                            <select
                                defaultValue={value}
                                className="edit-select"
                                onChange={(e) => handleSaveField(field, e.target.value)}
                                autoFocus
                            >
                                {options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <div className="edit-buttons">
                                <button 
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="value-container">
                            <span className="field-value">{value}</span>
                            <button 
                                className="edit-btn"
                                onClick={() => handleEdit(field)}
                            >
                                ✏️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <button className="close-x-btn" onClick={onClose} title="Đóng">
                        ×
                    </button>
                    <h2 className="popup-title">Chi tiết công việc</h2>
                </div>
                
                <div className="popup-body">
                    <div className="fields-container">
                    {renderField("Tiêu đề", "title", editedTask.title)}
                    {renderField("Mô tả", "description", editedTask.description)}
                    {renderField("Người tạo", "nameCreatedBy", editedTask.nameCreatedBy)}
                    {renderField("Người thực hiện", "nameAssignedTo", editedTask.nameAssignedTo)}
                    {renderField("Ngày bắt đầu", "startTime", editedTask.startTime)}
                    {renderField("Ngày kết thúc", "endTime", editedTask.endTime)}
                    {renderSelectField("Trạng thái", "status", editedTask.status, ["Chưa bắt đầu", "Đang thực hiện", "Hoàn thành", "Tạm dừng"])}
                    {renderSelectField("Mức độ", "lever", editedTask.lever, ["Thấp", "Trung bình", "Cao", "Khẩn cấp"])}
                    {renderField("Ngày tạo", "createdAt", editedTask.createdAt)}
                    </div>

                    <div className="action-buttons">
                        <button className="complete-btn" onClick={handleComplete}>
                            Hoàn thành
                        </button>
                        <button className="save-btn-main" onClick={handleSave}>
                            Lưu thay đổi
                        </button>
                        <button className="close-btn" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPopup;