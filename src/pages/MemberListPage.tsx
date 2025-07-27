import React, { useState, useEffect } from 'react';
import '../style/memberlist.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    fullName: string;
    role: string | null;
}

interface Dashboard {
    admins: User[];
    leaderDepartments: User[];
    projectManagers: User[];
    members: User[];
}

interface ApiResponse {
    code: string;
    message: string;
    data: {
        dashboard: Dashboard;
        totalMembers: number;
        totalPages: number;
        currentPage: number;
    };
}

const roleColors = {
    'Owner': 'purple',
    'Admin': 'orange',
    'Member': 'teal'
};

const MemberListPage = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [dashboard, setDashboard] = useState<Dashboard>({
        admins: [],
        leaderDepartments: [],
        projectManagers: [],
        members: []
    });
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [unitFilter, setUnitFilter] = useState('');

    const fetchUserDashboard = async (page: number = 0, size: number = 10) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(
                `http://localhost:8080/api/users/get-user-dashboard?page=${page}&size=${size}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch data');
            }

            const data: ApiResponse = await response.json();
            
            if (data.code === 'SUCCESS') {
                setDashboard(data.data.dashboard);
                setTotalMembers(data.data.totalMembers);
                setTotalPages(data.data.totalPages);
                setCurrentPage(data.data.currentPage);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDashboard(currentPage, pageSize);
    }, [currentPage, pageSize]);

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

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(0); // Reset to first page when changing page size
    };

    const extractEmailFromFullName = (fullName: string) => {
        const match = fullName.match(/\(([^)]+)\)/);
        return match ? match[1] : '';
    };

    const extractNameFromFullName = (fullName: string) => {
        return fullName.replace(/\s*\([^)]*\)/, '').trim();
    };

    const getInitials = (name: string) => {
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0][0];
        return words[0][0] + words[words.length - 1][0];
    };

    const renderUserGroup = (title: string, users: User[], groupRole?: string) => {
        if (users.length === 0) return null;

        return (
            <div key={title} className="member-group">
                <h3 className="group-title">
                    {title} <span className="count">{users.length}</span>
                </h3>
                {users.map((user) => {
                    const name = extractNameFromFullName(user.fullName);
                    const email = extractEmailFromFullName(user.fullName);
                    const role = user.role || groupRole || 'Member';
                    
                    return (
                        <div key={user.id} className="member-row">
                            <div className="avatar">{getInitials(name)}</div>
                            <div className="info">
                                <div className="name">{name} - {email}</div>
                                <div className="unit">Phòng Phát triển phần mềm 2</div>
                            </div>
                            <span className={`role-badge ${roleColors[role as keyof typeof roleColors] || 'teal'}`}>
                                {role}
                            </span>
                            <div className="actions">
                                <button title="Xem">👁</button>
                                <button title="Sửa">✏️</button>
                                <button title="Xóa">🗑</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                >
                    {i + 1}
                </button>
            );
        }

        return (
            <div className="pagination-container">
                <div className="pagination-info">
                    Hiển thị {Math.min(currentPage * pageSize + 1, totalMembers)} - {Math.min((currentPage + 1) * pageSize, totalMembers)} của {totalMembers} thành viên
                </div>
                <div className="pagination-controls">
                    <select 
                        value={pageSize} 
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="page-size-select"
                    >
                        <option value={5}>5/trang</option>
                        <option value={10}>10/trang</option>
                        <option value={20}>20/trang</option>
                        <option value={50}>50/trang</option>
                    </select>
                    
                    <div className="pagination-buttons">
                        <button
                            onClick={() => handlePageChange(0)}
                            disabled={currentPage === 0}
                            className="pagination-btn"
                        >
                            ««
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="pagination-btn"
                        >
                            ‹
                        </button>
                        {pages}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="pagination-btn"
                        >
                            ›
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="pagination-btn"
                        >
                            »»
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="member-list-container">
            <Sidebar />
            <div className="main-content">
                <Header
                    onProfileClick={handleProfile}
                    onChangePassword={handleChangePassword}
                    onLogout={handleLogout}
                    isDropdownOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                />

                <div className="search-filters">
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Từ khóa"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Lọc theo đơn vị"
                        value={unitFilter}
                        onChange={(e) => setUnitFilter(e.target.value)}
                    />
                    <button 
                        className="search-btn"
                        onClick={() => fetchUserDashboard(0, pageSize)}
                    >
                        Tìm kiếm
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        {renderUserGroup('Quản trị hệ thống', dashboard.admins, 'Admin')}
                        {renderUserGroup('Lãnh đạo đơn vị', dashboard.leaderDepartments, 'Owner')}
                        {renderUserGroup('Quản lý dự án', dashboard.projectManagers, 'Owner')}
                        {renderUserGroup('Thành viên', dashboard.members, 'Member')}
                        
                        {totalMembers === 0 && (
                            <div className="no-data">Không có dữ liệu để hiển thị</div>
                        )}
                    </>
                )}

                {renderPagination()}
            </div>
        </div>
    );
};

export default MemberListPage;