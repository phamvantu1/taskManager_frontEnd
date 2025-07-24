import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BarChartStats from '../components/PieChartStats';
import '../style/tasklist.css';
import { getAllTasks, getDashboardTasksByProject } from '../api/taskApi';

const tasks = [
    {
        id: 'EWT-253604',
        name: 'Phối hợp B',
        assigner: 'Chinh Nguyen Viet',
        assignee: 'Ban CNTT rà soát hệ thống',
        endDate: '31/03/2025',
        overdue: true,
        status: 'Đang thực hiện',
        progress: '55%',
        unit: 'Ban chuyển đổi số'
    },
    {
        id: 'EWT-253605',
        name: 'Phối hợp B',
        assigner: 'Chinh Nguyen Viet',
        assignee: 'Người dùng Ban Chuyển đổi số',
        endDate: '31/03/2025',
        overdue: true,
        status: 'Đang thực hiện',
        progress: '',
        unit: 'Ban chuyển đổi số'
    },
    {
        id: 'EWT-253606',
        name: 'Phối hợp B',
        assigner: 'Chinh Nguyen Viet',
        assignee: 'Chinh Nguyen Viet',
        endDate: '31/03/2025',
        overdue: true,
        status: 'Đang thực hiện',
        progress: '',
        unit: 'Phòng Phát triển phần mềm 2'
    }
];

// Dữ liệu cho biểu đồ
const taskSummary = [
    { label: 'Đang xử lý', value: 128 },
    { label: 'Hoàn thành', value: 21 },
    { label: 'Quá hạn', value: 10 }
];


const TaskListPage = () => {
    const [searchText, setSearchText] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [taskStats, setTaskStats] = useState<{ label: string; value: number }[]>([]);
    const [taskNumber, setTaskNumber] = useState(0);


    const fetchTaskDashboard = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const rawStats = await getDashboardTasksByProject(token, undefined) as {
                data: {
                    IN_PROGRESS?: number;
                    COMPLETED?: number;
                    PENDING?: number;
                    OVERDUE?: number;
                    TOTAL?: number;
                };
            };

            const stats = rawStats.data;
            setTaskNumber(stats.TOTAL || 0);

            const mappedStats = [
                { label: 'Chưa bắt đầu', value: stats.PENDING || 0 },
                { label: 'Đang xử lý', value: stats.IN_PROGRESS || 0 },
                { label: 'Hoàn thành', value: stats.COMPLETED || 0 },
                { label: 'Quá hạn', value: stats.OVERDUE || 0 },
            ];

            setTaskStats(mappedStats);
        } catch (err) {
            console.error('Lỗi khi fetch thống kê công việc:', err);
        }
    };



    useEffect(() => {
        fetchTaskDashboard();
    }, []);

    return (
        <div className="tasklist-container">
            <Sidebar />
            <div className="main-content">
                <Header
                    onProfileClick={() => { }}
                    onChangePassword={() => { }}
                    onLogout={() => { }}
                    isDropdownOpen={false}
                    toggleDropdown={() => { }}
                />

                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm công việc    🔍"
                        className="filter-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <div className="date-filter-group">
                        <label className="date-label">Từ ngày:  </label>
                        <input
                            type="date"
                            className="filter-input"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                    </div>

                    <div className="date-filter-group">
                        <label className="date-label">Đến ngày:  </label>
                        <input
                            type="date"
                            className="filter-input"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                        />
                    </div>

                    <select
                        className="filter-input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Đang thực hiện">Đang thực hiện</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã huỷ">Đã huỷ</option>
                    </select>
                </div>

                <div className="task-list-page">
                    <h2 className="section-title">Thống kê công việc</h2>
                    <div className="chart-container">
                        <BarChartStats data={taskStats} />
                    </div>

                    <h2 className="section-title">Danh sách công việc</h2>
                    <div className="task-table-container">
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th>Tên công việc</th>
                                    <th>Người giao</th>
                                    <th>Người thực hiện</th>
                                    <th>Ngày kết thúc</th>
                                    <th>Trạng thái</th>
                                    <th>Tiến độ</th>
                                    <th>Đơn vị</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <a href="#!" className="task-link">{task.id}</a> {task.name}
                                        </td>
                                        <td>{task.assigner}</td>
                                        <td>{task.assignee}</td>
                                        <td>
                                            {task.endDate} {task.overdue && <span className="overdue-label">⚠ Trễ</span>}
                                        </td>
                                        <td>
                                            <span className="status-badge">{task.status}</span>
                                        </td>
                                        <td>{task.progress || '-'}</td>
                                        <td>{task.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskListPage;
