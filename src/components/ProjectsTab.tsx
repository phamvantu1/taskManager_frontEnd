import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProjectPopup from './AddProjectPopup';

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
  departmentId: string; // Added to prefill department in AddProjectPopup
  onChange?: () => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, currentPage, totalPages, onPageChange, departmentId , onChange}) => {
  const navigate = useNavigate();
  const [showAddPopup, setShowAddPopup] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-emerald-100 text-emerald-800';
      case 'Đang thực hiện':
        return 'bg-blue-100 text-blue-800';
      case 'Lên kế hoạch':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Danh sách dự án ({projects.length})</h3>
        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-semibold shadow-sm"
        >
          + Tạo dự án
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <div className="text-gray-600 text-center">Không có dự án nào.</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 cursor-pointer transition-all duration-200"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">{project.name || 'Không có tên'}</h4>
                <span
                  className={`px-2 py-1 rounded-xl text-sm font-semibold ${getStatusColor(project.status ?? '')}`}
                >
                  {project.status || 'Không xác định'}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{project.description || 'Không có mô tả'}</p>
            </div>
          ))
        )}
      </div>
      {/* Pagination Controls */}
      <div className="p-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Trang trước
          </button>
          <span className="text-gray-600 text-sm">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage >= totalPages - 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Trang sau
          </button>
        </div>
      </div>

      {showAddPopup && (
        <AddProjectPopup
          departmentId={departmentId}
          onClose={() => setShowAddPopup(false)}
          onAddSuccess={() => {
            onPageChange(currentPage); // Refresh project list
            setShowAddPopup(false);
          }}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default ProjectsTab;