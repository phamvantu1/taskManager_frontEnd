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

    const fetchUserDashboard = async (page: number = 0, size: number = 10, searchKeyword: string = '', unitFilter: string = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });
            
            if (searchKeyword.trim()) {
                params.append('keyword', searchKeyword.trim());
            }
            
            if (unitFilter.trim()) {
                params.append('unit', unitFilter.trim());
            }

            const response = await fetch(
                `http://localhost:8080/api/users/get-user-dashboard?${params.toString()}`,
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
        fetchUserDashboard(currentPage, pageSize, keyword, unitFilter);
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
        setCurrentPage(0);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        fetchUserDashboard(0, pageSize, keyword, unitFilter);
    };

    const handleKeywordChange = (value: string) => {
        setKeyword(value);
    };

    const handleUnitFilterChange = (value: string) => {
        setUnitFilter(value);
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

    const renderUserGroup = (title: string, users: User[], groupRole?: string, showPagination: boolean = false) => {
        if (users.length === 0 && !showPagination) return null;

        return (
            <div key={title} className="member-group">
                <h3 className="group-title">
                    {title} <span className="count">{showPagination ? totalMembers : users.length}</span>
                </h3>
                {users.length === 0 && showPagination ? (
                    <div className="no-members">Không có thành viên nào</div>
                ) : (
                    users.map((user) => {
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
                    })
                )}
                
                {showPagination && renderPagination()}
            </div>
        );
    };

    const renderPagination = () => {
        return (
            <div className="flex flex-col items-center mt-4">
                <div className="text-sm text-gray-700 mb-2">
                    Hiển thị {totalMembers === 0 ? 0 : Math.min(currentPage * pageSize + 1, totalMembers)} - {Math.min((currentPage + 1) * pageSize, totalMembers)} của {totalMembers} thành viên
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={pageSize} 
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5/trang</option>
                        <option value={10}>10/trang</option>
                        <option value={20}>20/trang</option>
                        <option value={50}>50/trang</option>
                    </select>
                    
                    <div className="flex gap-1">
                        <button
                            onClick={() => handlePageChange(0)}
                            disabled={currentPage === 0}
                            className={`px-3 py-1 rounded-md ${currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            ««
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={`px-3 py-1 rounded-md ${currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            ‹
                        </button>
                        {(() => {
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
                                        className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            }
                            return pages;
                        })()}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className={`px-3 py-1 rounded-md ${currentPage >= totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            ›
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages - 1)}
                            disabled={currentPage >= totalPages - 1}
                            className={`px-3 py-1 rounded-md ${currentPage >= totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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
                        onChange={(e) => handleKeywordChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="Lọc theo đơn vị"
                        value={unitFilter}
                        onChange={(e) => handleUnitFilterChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        className="search-btn"
                        onClick={handleSearch}
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
                        {renderUserGroup('Thành viên', dashboard.members, 'Member', true)}
                        
                        {totalMembers === 0 && dashboard.admins.length === 0 && dashboard.leaderDepartments.length === 0 && dashboard.projectManagers.length === 0 && (
                            <div className="no-data">Không có dữ liệu để hiển thị</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MemberListPage;