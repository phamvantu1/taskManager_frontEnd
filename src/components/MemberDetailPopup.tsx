import React from 'react';
import { X, User, Building2, Briefcase, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

// Mock data - trong thực tế bạn sẽ fetch từ API
const mockMemberDetail = {
  id: 1,
  fullName: "Nguyễn Văn An",
  email: "nguyenvanan@company.com",
  position: "Frontend Developer",
  avatar: null,
  department: {
    id: 1,
    name: "Phòng Công nghệ Thông tin",
    description: "Phát triển và bảo trì hệ thống công nghệ"
  },
  projects: [
    {
      id: 1,
      name: "Hệ thống quản lý nhân sự",
      status: "PROCESSING",
      progress: 75,
      role: "Frontend Developer",
      startDate: "2024-01-15",
      endDate: "2024-06-30"
    },
    {
      id: 2,
      name: "Ứng dụng mobile bán hàng",
      status: "PLANNING",
      progress: 25,
      role: "UI/UX Designer",
      startDate: "2024-03-01",
      endDate: "2024-08-15"
    }
  ],
  tasks: [
    {
      id: 1,
      title: "Thiết kế giao diện đăng nhập",
      status: "OVERDUE",
      priority: "HIGH",
      dueDate: "2024-02-10",
      projectName: "Hệ thống quản lý nhân sự",
      description: "Tạo giao diện đăng nhập responsive cho web và mobile"
    },
    {
      id: 2,
      title: "Phát triển API authentication",
      status: "OVERDUE", 
      priority: "HIGH",
      dueDate: "2024-02-12",
      projectName: "Hệ thống quản lý nhân sự",
      description: "Xây dựng hệ thống xác thực người dùng"
    },
    {
      id: 3,
      title: "Testing module quản lý user",
      status: "PROCESSING",
      priority: "MEDIUM",
      dueDate: "2024-02-20",
      projectName: "Hệ thống quản lý nhân sự",
      description: "Kiểm thử tính năng quản lý người dùng"
    },
    {
      id: 4,
      title: "Thiết kế database schema",
      status: "COMPLETED",
      priority: "HIGH",
      dueDate: "2024-02-05",
      projectName: "Ứng dụng mobile bán hàng",
      description: "Thiết kế cơ sở dữ liệu cho ứng dụng"
    },
    {
      id: 5,
      title: "Tạo wireframe cho màn hình chính",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: "2024-02-25",
      projectName: "Ứng dụng mobile bán hàng",
      description: "Thiết kế khung sườn giao diện"
    }
  ],
  stats: {
    totalTasks: 12,
    completedTasks: 8,
    overdueTasks: 2,
    processingTasks: 2
  }
};

type MemberDetailPopupProps = {
  member?: typeof mockMemberDetail;
  onClose: () => void;
};

const MemberDetailPopup: React.FC<MemberDetailPopupProps> = ({ member = mockMemberDetail, onClose }) => {
  // Sắp xếp tasks: overdue lên đầu
  const sortedTasks = [...member.tasks].sort((a, b) => {
    if (a.status === 'OVERDUE' && b.status !== 'OVERDUE') return -1;
    if (a.status !== 'OVERDUE' && b.status === 'OVERDUE') return 1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PLANNING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OVERDUE': return 'Quá hạn';
      case 'COMPLETED': return 'Hoàn thành';
      case 'PROCESSING': return 'Đang xử lý';
      case 'PENDING': return 'Chờ xử lý';
      case 'PLANNING': return 'Lên kế hoạch';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Cao';
      case 'MEDIUM': return 'Trung bình';
      case 'LOW': return 'Thấp';
      default: return priority;
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const isOverdue = (dueDate: string | number | Date, status: string) => {
    if (status === 'COMPLETED') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="fixed inset-0  bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{member.fullName}</h2>
                <p className="text-indigo-100">{member.position}</p>
                <p className="text-indigo-200 text-sm">{member.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{member.stats.totalTasks}</p>
                    <p className="text-sm text-gray-600">Tổng công việc</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{member.stats.completedTasks}</p>
                    <p className="text-sm text-gray-600">Đã hoàn thành</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{member.stats.overdueTasks}</p>
                    <p className="text-sm text-gray-600">Quá hạn</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{member.stats.processingTasks}</p>
                    <p className="text-sm text-gray-600">Đang xử lý</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Info */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={24} className="text-indigo-600" />
                Thông tin phòng ban
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tên phòng ban</p>
                  <p className="text-lg text-gray-800">{member.department.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Mô tả</p>
                  <p className="text-gray-700">{member.department.description}</p>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase size={24} className="text-indigo-600" />
                Dự án đang tham gia ({member.projects.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {member.projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-800 line-clamp-2">{project.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Vai trò: <span className="font-medium text-gray-800">{project.role}</span></p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Tiến độ</span>
                          <span className="text-sm font-medium text-indigo-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Bắt đầu: {formatDate(project.startDate)}</span>
                        <span>Kết thúc: {formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={24} className="text-indigo-600" />
                Công việc ({sortedTasks.length})
                <span className="text-sm font-normal text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  Quá hạn lên đầu
                </span>
              </h3>
              
              <div className="space-y-4">
                {sortedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`bg-white rounded-xl p-6 border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                      task.status === 'OVERDUE' 
                        ? 'border-l-red-500 bg-red-50 ring-1 ring-red-200' 
                        : 'border-l-indigo-500'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                          {task.status === 'OVERDUE' && (
                            <AlertTriangle size={20} className="text-red-500" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            <strong>Dự án:</strong> {task.projectName}
                          </span>
                          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                            <strong>Ưu tiên:</strong> {getPriorityText(task.priority)}
                          </span>
                          <span className={`flex items-center gap-1 ${
                            isOverdue(task.dueDate, task.status) ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            <Calendar size={14} />
                            <strong>Hạn:</strong> {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate, task.status) && task.status !== 'COMPLETED' && (
                              <span className="text-red-600 font-medium">(Quá hạn)</span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPopup;