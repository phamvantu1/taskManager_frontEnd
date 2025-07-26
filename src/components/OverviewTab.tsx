import React from 'react';

interface Department {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  description: string;
  teams: number;
  projects: number;
  members: { id: number; name: string; email: string; role: string; avatar: string }[];
  projects_list: { id: number; name: string; status: string; progress: number; completedDate?: string }[];
}

interface OverviewTabProps {
  department: Department;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ department }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Thành viên mới tham gia</h3>
        <div className="space-y-4">
          {department.members.slice(0, 3).map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                {member.avatar}
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-600">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Dự án đang thực hiện</h3>
        <div className="space-y-4">
          {department.projects_list.filter(p => p.status === 'Đang thực hiện').map(project => (
            <div key={project.id} className="space-y-2">
              <div className="font-medium">{project.name}</div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Dự án hoàn thành</h3>
        <div className="space-y-4">
          {department.projects_list.filter(p => p.status === 'Hoàn thành').length > 0 ? (
            department.projects_list.filter(p => p.status === 'Hoàn thành').map(project => (
              <div key={project.id} className="space-y-2">
                <div className="font-medium">{project.name}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">✅ Hoàn thành</span>
                  <span className="text-gray-600">{project.completedDate || '25/12/2024'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              <div className="text-2xl mb-2">📋</div>
              <div>Chưa có dự án hoàn thành</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;