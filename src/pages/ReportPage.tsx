import React, { useState } from 'react';
import '../style/report.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const reportData = [
  {
    name: 'Vũ đức việt',
    department: 'Phòng Phát triển phần mềm 2',
    doing: 0,
    overdue: 0,
    pending: 0,
    doneOnTime: 0,
    doneLate: 0,
    total: 0,
    avgScore: 0,
    evalPoint: 0,
    minusPoint: 0
  },
  {
    name: 'Nguyễn Hồng Nhung',
    department: 'Phòng Phát triển phần mềm 2',
    doing: 0,
    overdue: 0,
    pending: 0,
    doneOnTime: 0,
    doneLate: 0,
    total: 0,
    avgScore: 0,
    evalPoint: 0,
    minusPoint: 0
  },
  // Thêm các dòng dữ liệu khác ở đây...
];

const ReportPage = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2025-07-31');

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
    <div className="report-container">
      <Sidebar />
      <div className="main-content" >

        <h2 className="report-title">📊 Báo cáo</h2>

        <div className="report-filters">
          <select className="filter-select">
            <option>Báo cáo theo thành viên</option>
          </select>

          <input
            type="text"
            className="filter-input"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Phòng ban</option>
            <option value="Phòng Phát triển phần mềm 2">Phòng Phát triển phần mềm 2</option>
            <option value="Tổ QC">Tổ QC</option>
          </select>

          <div className="date-range">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span>→</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button className="export-button">Xuất Excel</button>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>Nhân sự</th>
              <th>Phòng ban</th>
              <th>Đang thực hiện</th>
              <th>Quá hạn</th>
              <th>Chờ duyệt hoàn thành</th>
              <th>Hoàn thành đúng hạn</th>
              <th>Hoàn thành không đúng hạn</th>
              <th>Tổng số công việc</th>
              <th>Điểm công việc trung bình</th>
              <th>Điểm cộng đánh giá</th>
              <th>Điểm trừ đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.department}</td>
                <td>{user.doing}</td>
                <td>{user.overdue}</td>
                <td>{user.pending}</td>
                <td>{user.doneOnTime}</td>
                <td>{user.doneLate}</td>
                <td>{user.total}</td>
                <td>{user.avgScore}</td>
                <td>{user.evalPoint}</td>
                <td>{user.minusPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button>{'<<'}</button>
          {[1, 2, 3, 4, 5].map(n => <button key={n}>{n}</button>)}
          <span>...</span>
          <button>15</button>
          <button>{'>>'}</button>
        </div>
      </div>

    </div>
  );
};

export default ReportPage;
