import React from 'react';

export interface Project {
  id: number;
  name: string | null;
  description?: string | null;
  startTime?: string;
  endTime?: string;
  status?: string;
  type?: string;
  createdAt?: string;
}

interface ProjectsTabProps {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, currentPage, totalPages, onPageChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-emerald-500';
      case 'Đang thực hiện':
        return 'bg-blue-500';
      case 'Lên kế hoạch':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
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
        {projects.length === 0 ? (
          <div className="text-gray-600">Không có dự án nào.</div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{project.name || 'Không có tên'}</h4>
                <span className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(project.status ?? '')}`}>
                  {project.status || 'Không xác định'}
                </span>
              </div>
              <p className="text-gray-600">{project.description || 'Không có mô tả'}</p>
            </div>
          ))
        )}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-6 flex justify-between items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md ${
              currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Trang trước
          </button>
          <span className="text-gray-600">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 rounded-md ${
              currentPage >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;