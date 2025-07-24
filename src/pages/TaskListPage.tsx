import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BarChartStats from '../components/PieChartStats';
import '../style/tasklist.css';
import { getAllTasks, getDashboardTasksByProject, getTaskDetailById } from '../api/taskApi';
import TaskListSection from '../components/TaskListSection';
import TaskDetailPopup from '../components/TaskDetailPopup';
import AddTaskPopup from '../components/AddTaskPopupProps';



const TaskListPage = () => {

    const [taskStats, setTaskStats] = useState<{ label: string; value: number }[]>([]);
    const [taskNumber, setTaskNumber] = useState(0);
    const [tasks, setTasks] = useState<any[]>([]);
    const [isFetchingTasks, setIsFetchingTasks] = useState(false);
    const [filters, setFilters] = useState({
        textSearch: '',
        startTime: '',
        endTime: '',
    });
    const [hasMoreTasks, setHasMoreTasks] = useState(true);
    const [taskPage, setTaskPage] = useState(0);
    const [visibleTaskCount, setVisibleTaskCount] = useState(5);
    const [selectedTask, setSelectedTask] = useState<any>(null); // task được chọn
    const [showTaskDetailPopup, setShowTaskDetailPopup] = useState(false);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);



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

    const fetchTasks = async (pageToFetch = 0, append = false) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {

                return;
            }

            setIsFetchingTasks(true);
            const taskRes = await getAllTasks.getAllTasks(token, {
                page: pageToFetch,
                size: 10,
                textSearch: filters.textSearch,
                startTime: filters.startTime,
                endTime: filters.endTime,
                projectId: undefined,
            });

            const newTasks = taskRes.data.content;
            const totalPages = taskRes.data.totalPages;

            setTasks(prev => append ? [...prev, ...newTasks] : newTasks);
            setHasMoreTasks(pageToFetch < totalPages - 1);
            setTaskPage(pageToFetch);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetchingTasks(false);
        }
    };


    const handleTaskClick = async (taskId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const result = await getTaskDetailById(token, taskId) as { code: string; data: any };
            if (result.code === 'SUCCESS') {
                setSelectedTask(result.data);
                setShowTaskDetailPopup(true);
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết công việc:', error);
        }
    };

        const handleAddTask = (newTask: any) => {
       
        fetchTaskDashboard();
       
        // xử lý thêm task ở đây
    };



    useEffect(() => {
        fetchTaskDashboard();
        fetchTasks(0, false);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    // Nếu còn task để render
                    if (visibleTaskCount < tasks.length) {
                        setVisibleTaskCount(prev => prev + 5);
                    }
                    // Nếu hết task render mà còn task trong API thì gọi thêm
                    else if (hasMoreTasks && !isFetchingTasks) {
                        fetchTasks(taskPage + 1, true);
                    }
                }
            },
            { threshold: 1 }
        );

        const sentinel = document.querySelector('#task-list-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [visibleTaskCount, tasks, hasMoreTasks, isFetchingTasks]);

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

                

                <div className="task-list-page">
                    <h2 className="section-title">Thống kê công việc</h2>
                    <div className="chart-container">
                        <BarChartStats data={taskStats} />
                    </div>

                    <h2 className="section-title">Danh sách công việc</h2>
                    <TaskListSection
                        tasks={tasks}
                        filters={filters}
                        setFilters={setFilters}
                        taskNumber={taskNumber}
                        fetchTasks={fetchTasks}
                         onAddTaskClick={() => setShowAddTaskPopup(true)}
                        onTaskClick={handleTaskClick}
                        showAddTaskPopup={showAddTaskPopup}
                         AddTaskPopupComponent={
                                    <AddTaskPopup
                                        onClose={() => setShowAddTaskPopup(false)}
                                        onSubmit={handleAddTask}
                                        projectId={undefined} // hoặc truyền projectId nếu cần
                                    />
                                }
                    />


                </div>
            </div>
            {showTaskDetailPopup && selectedTask && (
                <TaskDetailPopup
                    task={selectedTask}
                    onClose={() => setShowTaskDetailPopup(false)}
                />
            )}
        </div>
    );
};

export default TaskListPage;
