import React from 'react';

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  completedDate?: string;
}

interface ProjectsTabProps {
  projects: Project[];
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-500';
      case 'Đang thực hiện': return 'bg-blue-500';
      case 'Lên kế hoạch': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sách dự án ({projects.length})</h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          + Tạo dự án
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">{project.name}</h4>
              <span
                className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Tiến độ: {project.progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;