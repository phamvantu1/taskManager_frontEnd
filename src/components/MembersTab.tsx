import React from 'react';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface MembersTabProps {
  members: Member[];
}

const MembersTab: React.FC<MembersTabProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sách thành viên ({members.length})</h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          + Thêm thành viên
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 rounded-t-md font-semibold text-gray-700">
          <div>Tên</div>
          <div>Email</div>
          <div>Vai trò</div>
          <div>Thao tác</div>
        </div>
        {members.map(member => (
          <div key={member.id} className="grid grid-cols-4 gap-4 p-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {member.avatar}
              </div>
              {member.name}
            </div>
            <div>{member.email}</div>
            <div>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">{member.role}</span>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">✏️</button>
              <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersTab;