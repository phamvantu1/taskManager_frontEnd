import React, { useState, useEffect } from 'react';
import { getDepartmentMembers, type Member, removeUserFromDepartment, updateUserRoleInDepartment } from '../api/departmentApi';
import AddMemberPopup from './AddMemberPopup';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

interface MembersTabProps {
  departmentId: string;
  onChange?: () => void; 
}

const MembersTab: React.FC<MembersTabProps> = ({ departmentId, onChange }) => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [localMembers, setLocalMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<{ userId: number; fullName: string } | null>(null);
  const pageSize = 10;

  const roleOptions = ['STAFF', 'LEADER'];

  useEffect(() => {
    fetchMembers(currentPage);
  }, [departmentId, currentPage]);

  const fetchMembers = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const resp = await getDepartmentMembers(departmentId, token, {
        page: page - 1, // API expects 0-based page index
        size: pageSize,
      });
      setLocalMembers(resp.data.content);
      setTotalPages(resp.data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách thành viên');
      console.error(err);
      toast.error(err.message || 'Không thể tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditRole = (member: Member) => {
    setEditingMemberId(member.id);
    setSelectedRole(member.role || 'STAFF');
  };

  const handleSaveRole = async (memberId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }

      await updateUserRoleInDepartment(departmentId, memberId, selectedRole, token);
      toast.success('Cập nhật vai trò thành công!');
      setEditingMemberId(null);
      fetchMembers(currentPage); // Refresh the member list
    } catch (err: any) {
      toast.error(err.message || 'Cập nhật vai trò thất bại.');
    }
  };

  const handleDeleteMember = async (userId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực');
        return;
      }

      await removeUserFromDepartment(departmentId, userId, token);
      toast.success('Xóa thành viên thành công!');
      setShowConfirmModal(null);
      fetchMembers(currentPage); // Refresh the member list
      onChange?.();
    } catch (err: any) {
      toast.error(err.message || 'Xóa thành viên thất bại.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Danh sách thành viên ({localMembers.length})</h3>
        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition-all duration-200 font-semibold shadow-sm"
          disabled={loading}
        >
          + Thêm thành viên
        </button>
      </div>

      {error && <div className="p-6 text-red-500 text-center">{error}</div>}

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-t-xl font-semibold text-gray-700">
          <div>Tên</div>
          <div>Email</div>
          <div>Vai trò</div>
          <div>Thao tác</div>
        </div>
        {localMembers.length > 0 ? (
          localMembers.map((m) => (
            <div key={m.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                  {m.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800">{m.fullName}</span>
              </div>
              <div className="text-gray-800">{m.email}</div>
              <div>
                {editingMemberId === m.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-2 py-1 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSaveRole(m.id)}
                      className="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingMemberId(null)}
                      className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-sm">
                    {m.role ?? 'Chưa phân quyền'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditRole(m)}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  disabled={loading}
                >
                  ✏️
                </button>
                <button
                  onClick={() => setShowConfirmModal({ userId: m.id, fullName: m.fullName })}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  disabled={loading}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-600">Chưa có thành viên</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="p-6 flex justify-between items-center">
        <div className="text-gray-600">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
          >
            Trước
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
          >
            Sau
          </button>
        </div>
      </div>

      {showAddPopup && (
        <AddMemberPopup
          departmentId={departmentId}
          onClose={() => setShowAddPopup(false)}
          onSubmit={() => fetchMembers(currentPage)}
          onChange={onChange}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          isOpen={!!showConfirmModal}
          onConfirm={() => handleDeleteMember(showConfirmModal.userId)}
          onCancel={() => setShowConfirmModal(null)}
          title="Xác nhận xóa thành viên"
          message={`Bạn có chắc chắn muốn xóa ${showConfirmModal.fullName} khỏi phòng ban? Hành động này không thể hoàn tác.`}
        />
      )}
    </div>
  );
};

export default MembersTab;