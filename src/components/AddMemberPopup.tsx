import React, { useState, useEffect } from 'react';
import { addUserToDepartment } from '../api/departmentApi';
import { fetchUsers } from '../api/userApi';

interface AddMemberPopupProps {
    departmentId: string;
    onClose: () => void;
    onSubmit: () => void; // Callback to refetch members after adding
}

const AddMemberPopup: React.FC<AddMemberPopupProps> = ({ departmentId, onClose, onSubmit }) => {
    const [users, setUsers] = useState<{ id: number; fullName: string }[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [role, setRole] = useState<string>('Nhân viên');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('Không tìm thấy token xác thực');
                }
                const usersData = await fetchUsers();
                setUsers(usersData.map(user => ({ id: user.id, fullName: user.email })));
            } catch (err) {
                setError('Không thể tải danh sách người dùng');
                console.error(err);
            }
        };
        getUser();
    }, [departmentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) {
            setError('Vui lòng chọn người dùng');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }
            await addUserToDepartment(departmentId, selectedUserId, token);
            onSubmit(); // Trigger refetch of members
            onClose();
        } catch (err) {
            setError('Không thể thêm thành viên');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Thêm thành viên</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Chọn người dùng</label>
                        <select
                            value={selectedUserId || ''}
                            onChange={e => setSelectedUserId(Number(e.target.value) || null)}
                            className="w-full p-2 border rounded-md"
                            disabled={loading}
                        >
                            <option value="">Chọn người dùng</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Vai trò</label>
                        <select
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            disabled={loading}
                        >
                            <option value="Trưởng phòng">Trưởng phòng</option>
                            <option value="Phó phòng">Phó phòng</option>
                            <option value="Nhân viên">Nhân viên</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Đang thêm...' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberPopup;