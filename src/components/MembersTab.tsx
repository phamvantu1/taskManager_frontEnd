import React, { useState, useEffect } from 'react';
import { getDepartmentMembers, type Member } from '../api/departmentApi';
import AddMemberPopup from './AddMemberPopup';

interface MembersTabProps {
  departmentId: string;
}

const MembersTab: React.FC<MembersTabProps> = ({ departmentId }) => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [localMembers, setLocalMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

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
        page: page - 1, // API typically expects 0-based page index
        size: pageSize,
      });
      setLocalMembers(resp.data.content);
      setTotalPages(resp.data.totalPages || 1);
    } catch (err) {
      setError('Không thể tải danh sách thành viên');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sách thành viên ({localMembers.length})</h3>
        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          + Thêm thành viên
        </button>
      </div>

      {error && <div className="p-6 text-red-500">{error}</div>}

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded-t-md font-semibold text-gray-700">
          <div>Tên</div>
          <div>Email</div>
          <div>Vai trò</div>
          <div>Thao tác</div>
        </div>
        {localMembers.length > 0 ? (
          localMembers.map((m) => (
            <div key={m.id} className="grid grid-cols-4 gap-4 p-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {m.fullName.charAt(0).toUpperCase()}
                </div>
                {m.fullName}
              </div>
              <div>{m.email}</div>
              <div>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                  {m.role ?? 'Chưa phân quyền'}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">✏️</button>
                <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">🗑️</button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-600">Chưa có thành viên</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="p-6 flex justify-between items-center">
        <div>
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Trước
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
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
        />
      )}
    </div>
  );
};

export default MembersTab;