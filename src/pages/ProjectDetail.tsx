import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../style/projectdetail.css';
import Profile from '../pages/Profile';
import { useNavigate, useParams } from 'react-router-dom';
import AddTaskPopup from '../components/AddTaskPopupProps';
import PieChartStats from '../components/PieChartStats';
import BarChartStats from '../components/PieChartStats';


const ProjectDetail = () => {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);

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
        console.log('Công việc mới:', newTask);
        // xử lý thêm task ở đây
    };

    // Dữ liệu mẫu cho chi tiết dự án
    const projectDetails = {
        id: "1",
        name: "Do test 1306",

        unit: "Phòng Phát triển phần mềm 2",
        collaboratingUnits: "Ban Cổ vấn cấp cao, Ban Công nghệ",
        startDate: "15/04/2024",
        endDate: "30/04/2024",
        daysLeft: "Từ 439 ngày",
        status: "Đang thực hiện",
        progress: 21,
        progressStatus: "Đang thực hiện",
        manager: "Nguyễn Văn A",
        members: "10 người",
        followers: "5 người",
        projectType: "Dự án phát triển phần mềm",
        // workGroups: ["Công việc lập lại", "Tài liệu", "Thảo luận", "Báo cáo", "Roadmap", "Quay lại"]
    };


    const tasks = [
        {
            name: "Thiết kế giao diện",
            assigner: "Nguyễn Văn A",
            assignee: "Trần Thị B",
            startDate: "15/04/2024",
            endDate: "20/04/2024",
            status: "Hoàn thành"
        },
        {
            name: "Xây dựng API",
            assigner: "Nguyễn Văn A",
            assignee: "Lê Văn C",
            startDate: "16/04/2024",
            endDate: "25/04/2024",
            status: "Đang thực hiện"
        },
        {
            name: "Kiểm thử hệ thống",
            assigner: "Nguyễn Văn A",
            assignee: "Phạm Văn D",
            startDate: "20/04/2024",
            endDate: "30/04/2024",
            status: "Chưa bắt đầu"
        }
    ];

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
                            <div className={`status-badge ${projectDetails.progressStatus === 'Quá hạn' ? 'overdue' : ''}`}>
                                {projectDetails.status}
                            </div>
                        </div>

                        <div className="overview-section">
                            <h2>Tổng quan</h2>


                            <div className="project-info-column">
                                <h3>Tên dự án</h3>
                                <div className="project-detail-info">
                                    <div className="info-item">
                                        <span className="info-label">Loại dự án</span>
                                        <span className="info-value">{projectDetails.projectType}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Đơn vị quản lý</span>
                                        <span className="info-value">{projectDetails.unit}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Đơn vị phối hợp</span>
                                        <span className="info-value">{projectDetails.collaboratingUnits}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Quản lý</span>
                                        <span className="info-value">{projectDetails.manager}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Thành viên</span>
                                        <span className="info-value">{projectDetails.members}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Người theo dõi</span>
                                        <span className="info-value">{projectDetails.followers}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ngày bắt đầu</span>
                                        <span className="info-value">{projectDetails.startDate}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ngày kết thúc</span>
                                        <span className="info-value">{projectDetails.endDate}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="project-progress-section">
                            <h2>Trích bộ Dự ÁN</h2>
                            <div className="progress-header">
                                <h3>Triển độ Dự ÁN</h3>
                                <div className="task-count">{projectDetails.progress} Công việc</div>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${projectDetails.progress}%` }}
                                ></div>
                            </div>

                            <div className="project-progress-section">
                                <h2>Thống kê công việc</h2>
                                <BarChartStats data={taskSummary} />
                            </div>






                        </div>

                        <div className="task-list-section">
                            <h3>DANH SÁCH CÔNG VIỆC</h3>

                            <button className="add-project-btn" onClick={() => setShowAddTaskPopup(true)}>+ Thêm công việc</button>
                            {showAddTaskPopup && (
                                <AddTaskPopup
                                    onClose={() => setShowAddTaskPopup(false)}
                                    onSubmit={handleAddTask}
                                />
                            )}
                            <div className="stats-table">
                                <div className="table-header">
                                    <div>Tên công việc</div>
                                    <div>Người giao</div>
                                    <div>Người thực hiện</div>
                                    <div>Ngày bắt đầu</div>
                                    <div>Ngày kết thúc</div>
                                    <div>Trạng thái</div>
                                </div>
                                {tasks.map((task, index) => (
                                    <div className="table-row" key={index}>
                                        <div>{task.name}</div>
                                        <div>{task.assigner}</div>
                                        <div>{task.assignee}</div>
                                        <div>{task.startDate}</div>
                                        <div>{task.endDate}</div>
                                        <div>{task.status}</div>
                                    </div>
                                ))}
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