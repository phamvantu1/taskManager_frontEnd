import React, { useState, useEffect } from 'react';
import '../style/TaskDetailPopup.css';

import { fetchUsers, type User } from '../api/userApi';
import { updateTask } from '../api/taskApi';
import { toast } from 'react-toastify';

interface TaskDetailPopupProps {
    task: any;
    onClose: () => void;
    onComplete?: () => void;
    onSave?: (updatedTask: any) => void;
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, onClose, onComplete, onSave }) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editedTask, setEditedTask] = useState(task);
    const [userList, setUserList] = useState<User[]>([]);

    if (!task) return null;

    const handleEdit = (field: string) => {
        setEditingField(field);
    };

    const mapStatusToNumber = (status: string): number => {
        switch (status.toLowerCase()) {
            case 'chưa bắt đầu':
                return 0;
            case 'đang thực hiện':
                return 1;
            case 'hoàn thành':
                return 2;
            case 'quá hạn':
                return 3;
            default:
                return -1;
        }
    };

    const mapLeverToNumber = (lever: string): number => {
        switch (lever.toLowerCase()) {
            case 'dễ':
                return 0;
            case 'trung bình':
                return 1;
            case 'khó':
                return 2;
            default:
                return -1;
        }
    };

    const mapNumberToStatus = (status: string): string => {
        switch (status) {
            case 'PENDING':
                return 'Chưa bắt đầu';
            case 'IN_PROGRESS':
                return 'Đang thực hiện';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'OVERDUE':
                return 'Quá hạn';
            default:
                return 'Không xác định';
        }
    };

    const mapNumberToLever = (lever: number): string => {
        switch (lever) {
            case 0:
                return 'Dễ';
            case 1:
                return 'Trung bình';
            case 2:
                return 'Khó';
            default:
                return 'Không xác định';
        }
    };

    const mapVietnameseStatusToBackend = (status: string): string => {
        switch (status) {
            case 'Chưa bắt đầu':
                return 'PENDING';
            case 'Đang thực hiện':
                return 'IN_PROGRESS';
            case 'Hoàn thành':
                return 'COMPLETED';
            case 'Quá hạn':
                return 'OVERDUE';
            default:
                return status;
        }
    };

    const handleCancelEdit = () => {
        setEditingField(null);
    };

    const handleComplete = () => {
        if (onComplete) {
            onComplete();
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.error("Token không tồn tại");
                return;
            }

            const updatedTask = {
                ...editedTask,
                assigneeId: editedTask.assigneeId,
            };

            const response = await updateTask(editedTask.id, updatedTask, token);
            onClose(); // Đóng popup sau khi lưu\
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
            console.log('Saving assigneeId hahaha  :', value);
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

    const renderField = (
        label: string,
        field: string,
        value: string,
        isEditable: boolean = true
    ) => {
        const isEditing = editingField === field;

        return (
            <div className="field-container">
                <div className="field-row">
                    <p className="field-label"><strong>{label}:</strong></p>
                    {isEditing && isEditable ? (
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
                            {isEditable && (
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(field)}
                                >
                                    ✏️
                                </button>
                            )}
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

    const renderAssigneeSelectField = () => {
        const isEditing = editingField === 'assigneeId';

        const assignedUser = userList.find(user => user.id === editedTask.assigneeId);
        const assignedUserDisplay = assignedUser
            ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.email})`
            : task.nameAssignedTo || 'Chưa chọn';

        return (
            <div className="field-container">
                <div className="field-row">
                    <p className="field-label"><strong>Người thực hiện:</strong></p>
                    {isEditing ? (
                        <div className="edit-container">
                            <select
                                value={editedTask.assigneeId || ''}
                                className="edit-select"
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
                            <div className="edit-buttons">
                                <button className="cancel-btn" onClick={handleCancelEdit}>✕</button>
                            </div>
                        </div>
                    ) : (
                        <div className="value-container">
                            <span className="field-value">{assignedUserDisplay}</span>
                            <button className="edit-btn" onClick={() => handleEdit('assigneeId')}>✏️</button>
                        </div>
                    )}
                </div>
            </div>
        );
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
    }, []);

    const statusOptions = ['Chưa bắt đầu', 'Đang thực hiện', 'Hoàn thành'];
    const leverOptions = ['Dễ', 'Trung bình', 'Khó'];

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
                        {renderField("Người giao", "createdById", editedTask.nameCreatedBy, false)}
                        {renderAssigneeSelectField()}
                        {renderField("Ngày bắt đầu", "startTime", editedTask.startTime)}
                        {renderField("Ngày kết thúc", "endTime", editedTask.endTime)}
                        {renderSelectField("Trạng thái", "status", mapNumberToStatus(editedTask.status), statusOptions)}
                        {renderSelectField("Mức độ", "lever", mapNumberToLever(editedTask.lever), leverOptions)}
                        {renderField("Ngày tạo", "createdAt", editedTask.createdAt, false)}
                    </div>

                    <div className="action-buttons">
                        <button className="complete-btn" onClick={handleComplete}>
                            Hoàn thành
                        </button>
                        <button className="save-btn-main" onClick={handleSave}>
                            Lưu thay đổi
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPopup;