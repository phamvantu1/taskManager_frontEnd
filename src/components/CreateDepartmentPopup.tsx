// src/components/CreateDepartmentPopup.tsx
import React, { useState, useEffect } from 'react';
import '../style/CreateDepartmentPopup.css';
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
            className="popup-overlay"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="popup-content">
                {/* Header */}
                <div className="popup-header">
                    <h3 className="popup-title">Tạo đơn vị mới</h3>
                    <button
                        onClick={onClose}
                        className="close-button"
                        type="button"
                        aria-label="Đóng"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="popup-body">
                    {/* Tên đơn vị */}
                    <div className="form-group">
                        <label className="form-label">
                            Tên đơn vị <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập tên đơn vị"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-input"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="form-group">
                        <label className="form-label">Mô tả</label>
                        <textarea
                            placeholder="Nhập mô tả đơn vị"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="form-textarea"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Leader ID */}
                    <div className="form-group">
                        <label className="form-label">
                            Người quản lý <span className="required">*</span>
                        </label>
                        <select
                            name="leaderId"
                            required
                            value={leaderId || ''}
                            onChange={e => setLeaderId(Number(e.target.value) || 0)}
                            disabled={isSubmitting}
                        >
                            <option value="">-- Chọn người quản lý --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="popup-footer">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="btn btn-secondary"
                        type="button"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim()}
                        className="btn btn-primary"
                        type="button"
                    >
                        {isSubmitting && <div className="spinner"></div>}
                        <span>{isSubmitting ? 'Đang tạo...' : 'Tạo đơn vị'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateDepartmentPopup;