import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../style/projectdetail.css';
import Profile from '../pages/Profile';
import { useNavigate, useParams } from 'react-router-dom';
import AddTaskPopup from '../components/AddTaskPopupProps';
import BarChartStats from '../components/PieChartStats';
import { projectApi } from '../api/projectApi';
import type { ProjectDetail as ProjectDetailType } from '../api/projectApi';
import { getAllTasks, getDashboardTasksByProject , getTaskDetailById } from '../api/taskApi';
import { getProjectMembersStats } from '../api/userApi';
import TaskDetailPopup from '../components/TaskDetailPopup';
import TaskListSection from '../components/TaskListSection';

const ProjectDetail = () => {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);

    const [projectDetails, setProjectDetails] = useState<ProjectDetailType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tasks, setTasks] = useState<any[]>([]);

    const [taskStats, setTaskStats] = useState<{ label: string; value: number }[]>([]);

    const [taskPage, setTaskPage] = useState(0);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);
    const [isFetchingTasks, setIsFetchingTasks] = useState(false);
    const [visibleTaskCount, setVisibleTaskCount] = useState(5);
    const [taskNumber, setTaskNumber] = useState(0);

    const [visibleMemberCount, setVisibleMemberCount] = useState(5);

    const [memberStats, setMemberStats] = useState<any[]>([]);
    const [memberPage, setMemberPage] = useState(0);
    const [hasMoreMembers, setHasMoreMembers] = useState(true);


    const [searchInput, setSearchInput] = useState('');
    const [memberSearch, setMemberSearch] = useState('');

    const [selectedTask, setSelectedTask] = useState<any>(null); // task được chọn
    const [showTaskDetailPopup, setShowTaskDetailPopup] = useState(false);



    const [filters, setFilters] = useState({
        textSearch: '',
        startTime: '',
        endTime: '',
    });
    const { projectId } = useParams();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleChangePassword = () => {
        console.log('Change password clicked');
        setIsDropdownOpen(false);
    };

    const handleProfile = () => {
        setShowProfile(true);
        setIsDropdownOpen(false);
    };

    const handleBackToDashboard = () => {
        setShowProfile(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handleAddTask = (newTask: any) => {
        fetchProject();
        fetchTaskDashboard();
        fetchMemberStats();
        // xử lý thêm task ở đây
    };




    const fetchMemberStats = async (pageToFetch = 0, append = false) => {
        try {
            const res = await getProjectMembersStats(Number(projectId), pageToFetch, 5, memberSearch);
            const content = res.content || [];
            const totalPages = res.totalPages || 0;

            setMemberStats(prev => append ? [...prev, ...content] : content);
            setHasMoreMembers(pageToFetch < totalPages - 1);
            setMemberPage(pageToFetch);
        } catch (err) {
            console.error('Lỗi khi fetch thống kê thành viên:', err);
        }
    };



    const fetchProject = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await projectApi.getProjectInfo(Number(projectId), token) as { data: ProjectDetailType };
            setProjectDetails(res.data);

            // Gọi API lấy task
            const taskRes = await getAllTasks.getAllTasks(token, {
                page: 0,
                size: 10,
                textSearch: '',
                startTime: '',
                endTime: '',
                projectId: Number(projectId),
            });

            setTasks(taskRes.data.content);
        } catch (error) {
            console.error('Error fetching project details or tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async (pageToFetch = 0, append = false) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            setIsFetchingTasks(true);
            const taskRes = await getAllTasks.getAllTasks(token, {
                page: pageToFetch,
                size: 10,
                textSearch: filters.textSearch,
                startTime: filters.startTime,
                endTime: filters.endTime,
                projectId: Number(projectId),
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



    const fetchTaskDashboard = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token || !projectId) return;

            const rawStats = await getDashboardTasksByProject(token, Number(projectId)) as {
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
        fetchProject();
        fetchTaskDashboard();
        fetchMemberStats();
    }, [projectId]);

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


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    console.log('Sentinel visible – triggering load more');
                    if (visibleMemberCount < memberStats.length) {
                        setVisibleMemberCount((prev) => prev + 5);
                    } else if (hasMoreMembers) {
                        fetchMemberStats(memberPage + 1, true);
                    }
                }
            },
            { threshold: 1 }
        );

        const sentinel = document.querySelector('#member-list-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [visibleMemberCount, memberStats, hasMoreMembers, memberPage]);


    useEffect(() => {
        setMemberPage(0);
        setVisibleMemberCount(5); // reset hiển thị lại 5 bản ghi
        fetchMemberStats(0, false);
    }, [memberSearch]);







    if (loading) return <div>Đang tải...</div>;
    if (!projectDetails) return <div>Không tìm thấy thông tin dự án.</div>;


    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">
                <Header
                    onProfileClick={handleProfile}
                    onChangePassword={handleChangePassword}
                    onLogout={handleLogout}
                    isDropdownOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                />

                {showProfile ? (
                    <Profile onBack={handleBackToDashboard} />
                ) : (

                    <div className="project-detail-container">
                        <button onClick={() => navigate('/projects')} className="back-button">
                            &larr; Quay lại danh sách dự án
                        </button>

                        <div className="project-header">
                            <h1>{projectDetails.name}</h1>
                            <div className={`status-badge ${projectDetails.status === 'OVERDUE' ? 'overdue' : ''}`}>
                                {projectDetails.status}
                            </div>
                        </div>

                        <div className="overview-section">
                            <h2>Tổng quan</h2>
                            <div className="project-info-column">
                                <div className="project-detail-info">
                                    <div className="info-item">
                                        <span className="info-label">Quản lý dự án </span>
                                        <span className="info-value">{projectDetails.ownerName}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Số lượng thành viên</span>
                                        <span className="info-value">{projectDetails.numberOfMembers}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Số lượng công việc</span>
                                        <span className="info-value">{projectDetails.numberOfTasks}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ngày bắt đầu</span>
                                        <span className="info-value">{projectDetails.startDate}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ngày kết thúc</span>
                                        <span className="info-value">{projectDetails.endDate}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Mô tả</span>
                                        <span className="info-value">{projectDetails.description}</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="project-progress-section">
                            <h2>Trích bộ Dự ÁN</h2>
                            <div className="progress-header">
                                <h3>Triển độ Dự ÁN</h3>
                                {/* <div className="task-count">{projectDetails.} Công việc</div> */}
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                // style={{ width: `${projectDetails.progress}%` }}
                                ></div>
                            </div>

                            <div className="project-progress-section">
                                <h2>Thống kê công việc</h2>
                                <BarChartStats data={taskStats} />
                            </div>


                        </div>

                        <div className="task-list-section">

                            <TaskListSection
                                tasks={tasks}
                                filters={filters}
                                setFilters={setFilters}
                                onAddTaskClick={() => setShowAddTaskPopup(true)}
                                onTaskClick={handleTaskClick}
                                showAddTaskPopup={showAddTaskPopup}
                                AddTaskPopupComponent={
                                    <AddTaskPopup
                                        onClose={() => setShowAddTaskPopup(false)}
                                        onSubmit={handleAddTask}
                                        projectId={Number(projectId)}
                                    />
                                }
                                taskNumber={taskNumber}
                                fetchTasks={fetchTasks}
                                taskPage={taskPage}
                                hasMoreTasks={hasMoreTasks}
                                isFetchingTasks={isFetchingTasks}
                            />


                        </div>

                        <div className="member-stats-section">
                            <h3>THỐNG KÊ THEO THÀNH VIÊN</h3>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>

                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm thành viên..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{ marginBottom: '8px', padding: '6px', width: '100%' }}
                                    />
                                    <button
                                        onClick={() => {
                                            setMemberSearch(searchInput); // Gán giá trị input vào memberSearch
                                            fetchMemberStats(0, false);   // Gọi lại API từ trang đầu
                                        }}
                                        style={{ marginBottom: '12px', padding: '6px 12px', cursor: 'pointer' }}
                                    >
                                        Tìm
                                    </button>
                                </div>


                            </div>

                            <div className="stats-table">
                                <div className="table-header">
                                    <div>Thành viên</div>
                                    <div>Công việc</div>
                                    <div>Hoàn thành</div>
                                    <div>Trễ hạn</div>
                                </div>

                                <div
                                    className="member-scroll-container"
                                    style={{
                                        maxHeight: '250px',
                                        overflowY: 'auto',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {memberStats.length > 0 ? (
                                        <>
                                            {memberStats.map((member, index) => (
                                                <div className="table-row" key={index}>
                                                    <div>{member.fullName || '---'}</div>
                                                    <div>{member.totalTasks}</div>
                                                    <div>{member.completedTasks}</div>
                                                    <div>{member.overdueTasks}</div>
                                                </div>
                                            ))}
                                            {/* 👇 Thêm dòng này để IntersectionObserver hoạt động */}
                                            <div id="member-list-sentinel" style={{ height: '1px' }}></div>
                                            {hasMoreMembers && <div style={{ padding: '10px' }}>Đang tải thêm...</div>}
                                        </>
                                    ) : (
                                        <div style={{ padding: '10px', textAlign: 'center' }}>Không có dữ liệu thành viên</div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                )}
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

export default ProjectDetail;