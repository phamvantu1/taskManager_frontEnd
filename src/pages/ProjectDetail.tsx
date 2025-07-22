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
import { getAllTasks } from '../api/taskApi';

const ProjectDetail = () => {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);

    const [projectDetails, setProjectDetails] = useState<ProjectDetailType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tasks, setTasks] = useState<any[]>([]);

    const [taskPage, setTaskPage] = useState(0);
    const [hasMoreTasks, setHasMoreTasks] = useState(true);
    const [isFetchingTasks, setIsFetchingTasks] = useState(false);
    const [visibleTaskCount, setVisibleTaskCount] = useState(5);



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
        // xử lý thêm task ở đây
    };


    const memberStats = [
        { name: "Nguyễn Văn A", totalTasks: 15, completed: 12, overdue: 3 },
        { name: "Trần Thị B", totalTasks: 10, completed: 8, overdue: 2 },
        { name: "Lê Văn C", totalTasks: 8, completed: 7, overdue: 1 }
    ];

    const taskSummary = [
        { label: 'Đang xử lý', value: 128 },
        { label: 'Hoàn thành', value: 21 },
        { label: 'Quá hạn', value: 10 }
    ];

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



    useEffect(() => {
        fetchProject();
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
                                <BarChartStats data={taskSummary} />
                            </div>


                        </div>

                        <div className="task-list-section">
                            <h3>DANH SÁCH CÔNG VIỆC</h3>

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
                                            setVisibleTaskCount(5); // reset hiển thị
                                            fetchTasks(0, false);   // fetch lại
                                        }}
                                    >
                                        Lọc
                                    </button>
                                </div>

                                <button className="add-project-btn" onClick={() => setShowAddTaskPopup(true)}>
                                    + Thêm công việc
                                </button>
                            </div>
                            {showAddTaskPopup && (
                                <AddTaskPopup
                                    onClose={() => setShowAddTaskPopup(false)}
                                    onSubmit={handleAddTask}
                                    projectId={Number(projectId)}
                                />
                            )}
                            <div className="stats-table">
                                <div
                                    className="task-scroll-container"
                                    style={{
                                        maxHeight: '300px',
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
        <div className="table-row" key={index}>
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
    <div style={{ padding: '10px' }}>Không có công việc nào</div>
  )}
</div>
                                </div>
                            </div>

                        </div>

                        <div className="member-stats-section">
                            <h3>THỐNG KÊ THEO THÀNH VIÊN</h3>
                            <div className="stats-table">
                                <div className="table-header">
                                    <div>Thành viên</div>
                                    <div>Công việc</div>
                                    <div>Hoàn thành</div>
                                    <div>Trễ hạn</div>
                                </div>
                                {memberStats.map((member, index) => (
                                    <div className="table-row" key={index}>
                                        <div>{member.name}</div>
                                        <div>{member.totalTasks}</div>
                                        <div>{member.completed}</div>
                                        <div>{member.overdue}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;