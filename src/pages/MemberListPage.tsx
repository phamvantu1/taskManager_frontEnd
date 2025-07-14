
import React, { useState } from 'react';
import '../style/memberlist.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const members = {
    'Quản trị hệ thống': [
        { name: 'Nhung Test 1', email: 'tham.tranthi@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Owner' },
        { name: 'Nhung Test 44', email: 'chinh.nguyenviet@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Owner' },
    ],
    'Lãnh đạo đơn vị': [
        { name: 'Trần Văn Hà', email: 'ha.tranvan@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Member' },
        { name: 'Ngô Quốc Khánh', email: 'tham.tranthi@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Owner' },
        { name: 'Việt Chinh', email: 'tham.tranthi@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Admin' },
        { name: 'Trưởng phòng', email: 'trang.nguyennhu110@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Member' },
    ],
    'Quản lý đơn vị': [
        { name: 'Chinh 4', email: 'trang.nguyennhu10111@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Member' },
        { name: 'Chinh 1', email: 'chinh.nguyenviet@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Owner' },
        { name: 'Việt Chinh', email: 'chinh.nguyenviet@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Member' },
        { name: 'Lê Văn Hùng', email: 'tham.tranthi@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Member' },
        { name: 'Nguyễn Quang Mùi', email: 'lan.nguyenvan@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Admin' },
    ],
    'Quản lý dự án': [
        { name: 'Test test 1', email: 'chinh.nguyenviet@mobifone.vn', unit: 'Phòng Phát triển phần mềm 2', role: 'Member' },
    ]
};

const roleColors = {
    'Owner': 'purple',
    'Admin': 'orange',
    'Member': 'teal'
};

const MemberListPage = () => {

    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);


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

                <h2 className="page-title">Quản lý hệ thống</h2>

                <div className="search-filters">
                    <input type="text" className="filter-input" placeholder="Từ khóa" />
                    <input type="text" className="filter-input" placeholder="Lọc theo đơn vị" />
                </div>

                {Object.entries(members).map(([group, users]) => (
                    <div key={group} className="member-group">
                        <h3 className="group-title">{group} <span className="count">{users.length}</span></h3>
                        {users.map((user, index) => (
                            <div key={index} className="member-row">
                                <div className="avatar">{getInitials(user.name)}</div>
                                <div className="info">
                                    <div className="name">{user.name} - {user.email}</div>
                                    <div className="unit">{user.unit}</div>
                                </div>
                                <span className={`role-badge ${roleColors[user.role as keyof typeof roleColors]}`}>{user.role}</span>
                                <div className="actions">
                                    <button>👁</button>
                                    <button>✏️</button>
                                    <button>🗑</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0];
    return words[0][0] + words[1][0];
};

export default MemberListPage;
