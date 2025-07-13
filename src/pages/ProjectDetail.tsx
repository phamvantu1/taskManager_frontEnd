import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../style/projectdetail.css';
import Profile from '../pages/Profile';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectDetail = () => {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

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

    // Dữ liệu mẫu cho chi tiết dự án
    const projectDetails = {
        id: "1",
        name: "Test dự án",
        description: "Dự án với dõi tác/ khách hàng",
        unit: "Phòng Phát triển phần mềm 2",
        collaboratingUnits: "Phòng Phát triển phần mềm 1, Phòng PTPM3, Ban kiểm thứ 2",
        startDate: "15/04/2024",
        endDate: "30/04/2024",
        daysLeft: "Từ 439 ngày",
        status: "Đang thực hiện",
        progress: 100,
        progressStatus: "Quá hạn",
        manager: "Nguyễn Văn A",
        members: "10 người",
        followers: "5 người",
        projectType: "Dự án phát triển phần mềm",
        workGroups: "Nhóm phát triển, Nhóm kiểm thử"
    };

    const statusOptions = [
        "Cho duyệt thực hiện",
        "Đang thực hiện",
        "Cho duyệt hoàn thành",
        "Hoàn thành đúng hạn",
        "Hoàn thành quá hạn"
    ];

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

                        <p className="project-description">{projectDetails.description}</p>

                        <div className="project-info-grid">
                            <div className="project-info-column">
                                <div className="info-item">
                                    <span className="info-label">Đơn vị quản lý</span>
                                    <span className="info-value">{projectDetails.unit}</span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Đơn vị phối hợp</span>
                                    <span className="info-value">{projectDetails.collaboratingUnits}</span>
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
                                    <span className="info-label">Thời gian còn lại</span>
                                    <span className="info-value">{projectDetails.daysLeft}</span>
                                </div>
                            </div>

                            <div className="project-info-column">
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
                                    <span className="info-label">Loại dự án</span>
                                    <span className="info-value">{projectDetails.projectType}</span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Nhóm công việc</span>
                                    <span className="info-value">{projectDetails.workGroups}</span>
                                </div>
                            </div>
                        </div>

                        <div className="progress-section">
                            <h3>Tiến độ dự án</h3>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${projectDetails.progress}%` }}
                                ></div>
                            </div>
                            <div className="progress-text">
                                {projectDetails.progress}% {projectDetails.progressStatus}
                            </div>
                        </div>

                        <div className="status-section">
                            <h3>Trạng thái dự án</h3>
                            <div className="status-options">
                                {statusOptions.map((option, index) => (
                                    <label key={index} className="status-option">
                                        <input
                                            type="radio"
                                            name="project-status"
                                            checked={projectDetails.status === option}
                                            onChange={() => { }}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="task-list-section">
                            <h3>DANH SÁCH CÔNG VIỆC</h3>
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
                            <h3>THÔNG KÊ THEO THÀNH VIÊN</h3>
                            <div className="stats-table">
                                <div className="table-header">
                                    <div>Thành viên</div>
                                    <div>Công việc</div>
                                    <div>Hoàn thành</div>
                                    <div>Trễ hạn</div>
                                </div>
                                <div className="table-row">
                                    <div>Nguyễn Văn A</div>
                                    <div>15</div>
                                    <div>12</div>
                                    <div>3</div>
                                </div>
                                <div className="table-row">
                                    <div>Trần Thị B</div>
                                    <div>10</div>
                                    <div>8</div>
                                    <div>2</div>
                                </div>
                                <div className="table-row">
                                    <div>Lê Văn C</div>
                                    <div>8</div>
                                    <div>7</div>
                                    <div>1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;