import React from 'react';

interface TaskListSectionProps {
  tasks: any[];
  filters?: {
    textSearch: string;
    startTime: string;
    endTime: string;
    status: string | null;
  };
  setFilters?: (filters: any) => void;
  onAddTaskClick?: () => void;
  onTaskClick?: (taskId: number) => void;
  showAddTaskPopup?: boolean;
  AddTaskPopupComponent?: React.ReactNode;
  taskNumber?: number;
  fetchTasks?: (page?: number, append?: boolean, filters?: any) => void;
  taskPage?: number;
  hasMoreTasks?: boolean;
  isFetchingTasks?: boolean;
}

const TaskListSection: React.FC<TaskListSectionProps> = ({
  tasks,
  filters = { textSearch: '', startTime: '', endTime: '', status: null },
  setFilters = () => {},
  onAddTaskClick = () => {},
  onTaskClick = () => {},
  showAddTaskPopup = false,
  AddTaskPopupComponent = null,
  taskNumber = 0,
  fetchTasks = () => {},
  taskPage = 0,
  hasMoreTasks = false,
  isFetchingTasks = false,
}) => {
  const mapStatusToVietnamese = (status: string): string => {
    switch (status) {
      case 'PENDING': return 'Chưa bắt đầu';
      case 'PROCESSING': return 'Đang thực hiện';
      case 'COMPLETED': return 'Hoàn thành';
      case 'OVERDUE': return 'Quá hạn';
      case 'WAIT_COMPLETED': return 'Chờ hoàn thành';
      default: return 'Không xác định';
    }
  };

  const mapVietnameseToStatusNumber = (status: string): string | null => {
    switch (status) {
      case 'Tất cả': return null;
      case 'Chưa bắt đầu': return '0';
      case 'Đang thực hiện': return '1';
      case 'Hoàn thành': return '2';
      case 'Quá hạn': return '3';
      case 'Chờ hoàn thành': return '4';
      default: return null;
    }
  };

  const getStatusStyles = (status: string): string => {
    switch (status) {
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'WAIT_COMPLETED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: key === 'status' ? mapVietnameseToStatusNumber(value) : value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Danh sách công việc <span className="text-sm text-gray-500">({taskNumber})</span>
        </h3>
        <button
          onClick={onAddTaskClick}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
        >
          + Thêm công việc
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm công việc..."
          value={filters.textSearch}
          onChange={(e) => handleFilterChange('textSearch', e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
        />
        <input
          type="date"
          value={filters.startTime}
          onChange={(e) => handleFilterChange('startTime', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
        />
        <input
          type="date"
          value={filters.endTime}
          onChange={(e) => handleFilterChange('endTime', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
        />
        <select
          value={
            filters.status === null
              ? 'Tất cả'
              : filters.status === '0'
              ? 'Chưa bắt đầu'
              : filters.status === '1'
              ? 'Đang thực hiện'
              : filters.status === '2'
              ? 'Hoàn thành'
              : filters.status === '3'
              ? 'Quá hạn'
              : 'Chờ hoàn thành'
             
          }
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-gray-700 bg-white shadow-sm"
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Chưa bắt đầu">Chưa bắt đầu</option>
          <option value="Đang thực hiện">Đang thực hiện</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Quá hạn">Quá hạn</option>
          <option value="Chờ hoàn thành">Chờ hoàn thành</option>
        </select>
        <button
          onClick={() => fetchTasks(0, false, filters)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 font-semibold shadow-sm"
        >
          Lọc
        </button>
      </div>

      {showAddTaskPopup && AddTaskPopupComponent}

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-t-xl font-semibold text-gray-700 text-sm">
            <div>Tên công việc</div>
            <div>Người giao</div>
            <div>Người thực hiện</div>
            <div>Ngày bắt đầu</div>
            <div>Ngày kết thúc</div>
            <div>Trạng thái</div>
          </div>
          <div
            className="max-h-96 overflow-y-auto border border-gray-200 rounded-b-xl"
            onScroll={(e) => {
              const target = e.currentTarget;
              if (
                target.scrollTop + target.clientHeight >= target.scrollHeight - 50 &&
                hasMoreTasks &&
                !isFetchingTasks
              ) {
                fetchTasks(taskPage + 1, true, filters);
              }
            }}
          >
            {tasks.length > 0 ? (
              <>
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => onTaskClick(task.id)}
                  >
                    <div className="text-sm text-gray-800 truncate">{task.title}</div>
                    <div className="text-sm text-gray-800">{task.nameCreatedBy || '---'}</div>
                    <div className="text-sm text-gray-800">{task.nameAssignedTo || '---'}</div>
                    <div className="text-sm text-gray-800">{task.startTime?.split('T')[0]}</div>
                    <div className="text-sm text-gray-800">{task.endTime?.split('T')[0]}</div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(task.status)}`}
                      >
                        {mapStatusToVietnamese(task.status)}
                      </span>
                    </div>
                  </div>
                ))}
                <div id="task-list-sentinel" className="h-1" />
                {isFetchingTasks && (
                  <div className="p-4 text-center text-sm text-gray-600">Đang tải thêm...</div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-gray-600">Không có công việc nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListSection;