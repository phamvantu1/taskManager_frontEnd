// components/TaskListSection.tsx
import React from 'react';
import '../style/tasklist.css';


interface TaskListSectionProps {
    tasks: any[];
    filters?: {
        textSearch: string;
        startTime: string;
        endTime: string;
    };
    setFilters?: (filters: any) => void;
    onAddTaskClick?: () => void;
    onTaskClick?: (taskId: number) => void;
    showAddTaskPopup?: boolean;
    AddTaskPopupComponent?: React.ReactNode;
    taskNumber?: number;
    fetchTasks?: (page?: number, append?: boolean) => void;
    taskPage?: number;
    hasMoreTasks?: boolean;
    isFetchingTasks?: boolean;
}




const TaskListSection: React.FC<TaskListSectionProps> = ({
    tasks,
    filters = { textSearch: '', startTime: '', endTime: '' },
    setFilters = () => { },
    onAddTaskClick = () => { },
    onTaskClick = () => { },
    showAddTaskPopup = false,
    AddTaskPopupComponent = null,
    taskNumber = 0,
    fetchTasks = () => { },
    taskPage = 0,
    hasMoreTasks = false,
    isFetchingTasks = false,
}) => {

    return (
        <div className="task-list-section">
            <h3>DANH SÁCH CÔNG VIỆC ( Số lượng : {taskNumber} ) </h3>

            <div className="task-controls">
                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Tìm kiếm công việc..."
                        value={filters.textSearch}
                        onChange={(e) => setFilters({ ...filters, textSearch: e.target.value })}
                    />
                    <input
                        type="date"
                        value={filters.startTime}
                        onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                    />
                    <input
                        type="date"
                        value={filters.endTime}
                        onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
                    />
                    <button
                        onClick={() => {
                            fetchTasks(0, false);
                        }}
                    >
                        Lọc
                    </button>
                </div>

                <button className="add-project-btn" onClick={onAddTaskClick}>
                    + Thêm công việc
                </button>
            </div>

            {showAddTaskPopup && AddTaskPopupComponent}

            <div className="stats-table">
                <div
                    className="task-scroll-container"
                    style={{
                        maxHeight: '600px',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                    }}
                    onScroll={(e) => {
                        const target = e.currentTarget;
                        if (
                            target.scrollTop + target.clientHeight >= target.scrollHeight - 50 &&
                            hasMoreTasks &&
                            !isFetchingTasks
                        ) {
                            fetchTasks(taskPage + 1, true);
                        }
                    }}
                >
                    <div className="task-list-wrapper">
                        <div className="table-header">
                            <div>Tên công việc</div>
                            <div>Người giao</div>
                            <div>Người thực hiện</div>
                            <div>Ngày bắt đầu</div>
                            <div>Ngày kết thúc</div>
                            <div>Trạng thái</div>
                        </div>

                        {tasks.length > 0 ? (
                            <>
                                {tasks.map((task, index) => (
                                    <div
                                        className="table-row"
                                        key={index}
                                        onClick={() => onTaskClick(task.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>{task.title}</div>
                                        <div>{task.nameCreatedBy || '---'}</div>
                                        <div>{task.nameAssignedTo || '---'}</div>
                                        <div>{task.startTime?.split('T')[0]}</div>
                                        <div>{task.endTime?.split('T')[0]}</div>
                                        <div>{task.status}</div>
                                    </div>
                                ))}
                                {isFetchingTasks && <div style={{ padding: '10px' }}>Đang tải thêm...</div>}
                            </>
                        ) : (
                            <div style={{ padding: '10px', textAlign: 'center' }}>Không có công việc nào</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskListSection;
