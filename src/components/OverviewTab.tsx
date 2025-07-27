import React from 'react';
import type { Project } from '../pages/getDepartmentDetail';

interface Member {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface OverviewTabProps {
  members: Member[];
  projects: Project[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ members, projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Thành viên mới tham gia */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Thành viên mới tham gia</h3>
        <div className="space-y-4">
          {members.length > 0 ? (
            members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 border-2 border-blue-500 rounded-full"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.email}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              <div className="text-2xl mb-2">👥</div>
              <div>Chưa có thành viên</div>
            </div>
          )}
        </div>
      </div>

      {/* Dự án đang thực hiện */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Dự án đang thực hiện</h3>
        <div className="space-y-4">
          {projects.filter((p) => p.status === 'In Progress').length > 0 ? (
            projects
              .filter((p) => p.status === 'In Progress')
              .map((project) => (
                <div
                  key={project.id}
                  className="p-3 border-2 border-yellow-500 rounded-full"
                >
                  <div className="font-medium">{project.name}</div>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-600">
              <div className="text-2xl mb-2">📋</div>
              <div>Chưa có dự án đang thực hiện</div>
            </div>
          )}
        </div>
      </div>

      {/* Dự án hoàn thành */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Dự án hoàn thành</h3>
        <div className="space-y-4">
          {projects.filter((p) => p.status === 'Completed').length > 0 ? (
            projects
              .filter((p) => p.status === 'Completed')
              .map((project) => (
                <div
                  key={project.id}
                  className="p-3 border-2 border-emerald-500 rounded-full"
                >
                  <div className="font-medium">{project.name}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-500">✅ Hoàn thành</span>
                    <span className="text-gray-600">{project.endTime || 'N/A'}</span>
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