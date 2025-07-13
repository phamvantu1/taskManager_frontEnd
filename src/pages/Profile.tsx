import React from 'react';
import '../style/dashboard.css';

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  return (
    <div className="content profile-content">
      <div className="profile-card">
        <h2 className="profile-title">Thông tin cá nhân</h2>
        <div className="profile-grid">
          <div className="profile-field">
            <label className="profile-label">Họ và tên</label>
            <input 
              type="text" 
              value="Quản Minh" 
              readOnly 
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Email</label>
            <input 
              type="email" 
              value="quanminh@mobifone.vn" 
              readOnly 
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Số điện thoại</label>
            <input 
              type="tel" 
              value="0123 456 789" 
              readOnly 
              className="profile-input" 
            />
          </div>
          <div className="profile-field">
            <label className="profile-label">Phòng ban</label>
            <input 
              type="text" 
              value="Phòng Phát triển phần mềm 2" 
              readOnly 
              className="profile-input" 
            />
          </div>
        </div>
        <button 
          className="profile-back-btn"
          onClick={onBack}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default Profile;